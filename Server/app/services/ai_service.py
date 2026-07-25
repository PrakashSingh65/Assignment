import json
from typing import Dict, Any, Optional, List, TypedDict
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
import os
from dotenv import load_dotenv
load_dotenv()

# ─── Gemini model name (single source of truth) ───
GEMINI_MODEL = "gemini-3.6-flash"

# ═══════════════════════════════════════════════════
# 1. EXTRACTION GRAPH  (existing – extracts fields from raw text)
# ═══════════════════════════════════════════════════

class ComplaintExtraction(BaseModel):
    complaint_source: str = Field(description="Source of the complaint (e.g. Email, Phone, Fax, Form). Fallback to 'Unknown' if not found.", default="Unknown")
    customer_name: str = Field(description="Name of the customer or company. Fallback to 'Unknown' if not found.", default="Unknown")
    product_name: str = Field(description="Name of the product. Fallback to 'Unknown' if not found.", default="Unknown")
    product_strength: Optional[str] = Field(description="Strength or Grade of the product", default=None)
    batch_number: str = Field(description="Batch or Lot number. Fallback to 'Unknown' if not found.", default="Unknown")
    manufacturing_date: Optional[str] = Field(description="Manufacturing Date in YYYY-MM-DD", default=None)
    expiry_date: Optional[str] = Field(description="Expiry Date in YYYY-MM-DD", default=None)
    quantity_affected: Optional[int] = Field(description="Quantity affected (integer)", default=None)
    complaint_type: str = Field(description="Type or category of complaint. Fallback to 'General' if not found.", default="General")
    complaint_description: str = Field(description="Detailed description of the issue. Fallback to 'No description' if not found.", default="No description")
    complaint_date: str = Field(description="Date of the complaint in YYYY-MM-DD", default="2026-07-25")
    severity: str = Field(description="Severity (LOW, MEDIUM, HIGH, CRITICAL)", default="LOW")
    priority: str = Field(description="Priority (LOW, MEDIUM, HIGH, URGENT)", default="LOW")

class ExtractState(TypedDict):
    raw_text: str
    extracted_data: Optional[Dict[str, Any]]

def extract_fields_node(state: ExtractState):
    try:
        llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL, temperature=0)
        structured_llm = llm.with_structured_output(ComplaintExtraction)
        prompt = f"Extract the following information from the complaint document. If a field is not found, leave it empty or null.\n\nDocument:\n{state['raw_text']}"
        result = structured_llm.invoke(prompt)
        return {"extracted_data": result.model_dump()}
    except Exception as e:
        print(f"Extraction failed: {e}")
        return {"extracted_data": {}}

extract_builder = StateGraph(ExtractState)
extract_builder.add_node("extract", extract_fields_node)
extract_builder.set_entry_point("extract")
extract_builder.add_edge("extract", END)
extract_graph = extract_builder.compile()


# ═══════════════════════════════════════════════════
# 2. CHAT GRAPH  (NEW – answers user questions about DB complaints)
# ═══════════════════════════════════════════════════

class ChatState(TypedDict):
    user_question: str
    complaints_context: str          # serialised complaint records
    ai_answer: Optional[str]

def _extract_text(content) -> str:
    """Safely extract plain text from a LangChain AI response content field.
    Newer langchain-google-genai versions may return nested content blocks
    such as {'type': 'text', 'text': ...} or lists of blocks."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(_extract_text(item) for item in content if item is not None)
    if isinstance(content, dict):
        if "text" in content:
            return _extract_text(content["text"])
        if "content" in content:
            return _extract_text(content["content"])
        if "message" in content:
            return _extract_text(content["message"])
        if "choices" in content:
            return _extract_text(content["choices"])
        if "data" in content:
            return _extract_text(content["data"])
        return " ".join(_extract_text(v) for v in content.values() if v is not None)
    return str(content)


def chat_answer_node(state: ChatState):
    """LangGraph node: sends complaint DB context + user question to Gemini."""
    try:
        llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL, temperature=0.3)

        system_prompt = (
            "You are a helpful QMS (Quality Management System) AI Assistant for a pharmaceutical company. "
            "You have access to the customer complaint records shown below. "
            "Answer the user's question accurately based on this data. "
            "If the data does not contain enough information to answer, say so clearly. "
            "Be concise but thorough. Use bullet points or tables when helpful.\n\n"
            "── COMPLAINT RECORDS ──\n"
            f"{state['complaints_context']}\n"
            "── END OF RECORDS ──"
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": state["user_question"]},
        ]

        response = llm.invoke(messages)
        answer_text = _extract_text(response.content)
        return {"ai_answer": answer_text}
    except Exception as e:
        print(f"Chat answer failed: {e}")
        return {"ai_answer": f"Sorry, I encountered an error: {str(e)}"}

chat_builder = StateGraph(ChatState)
chat_builder.add_node("answer", chat_answer_node)
chat_builder.set_entry_point("answer")
chat_builder.add_edge("answer", END)
chat_graph = chat_builder.compile()


# ═══════════════════════════════════════════════════
# Public helper functions
# ═══════════════════════════════════════════════════

def serialize_complaints(complaints) -> str:
    """Convert a list of SQLAlchemy Complaint objects into a readable text block."""
    if not complaints:
        return "No complaints found in the database."

    lines = []
    for c in complaints:
        lines.append(
            f"--- Complaint #{c.complaint_number} ---\n"
            f"  Customer     : {c.customer_name}\n"
            f"  Source       : {c.complaint_source}\n"
            f"  Product      : {c.product_name} ({c.product_strength or 'N/A'})\n"
            f"  Batch        : {c.batch_number}\n"
            f"  Mfg Date     : {c.manufacturing_date}\n"
            f"  Exp Date     : {c.expiry_date}\n"
            f"  Qty Affected : {c.quantity_affected}\n"
            f"  Type         : {c.complaint_type}\n"
            f"  Description  : {c.complaint_description}\n"
            f"  Date         : {c.complaint_date}\n"
            f"  Severity     : {c.severity}\n"
            f"  Priority     : {c.priority}\n"
            f"  Status       : {c.status}\n"
            f"  Created At   : {c.created_at}\n"
        )
    return "\n".join(lines)


def chat_with_complaints(user_question: str, complaints) -> str:
    """
    Uses LangGraph chat_graph to answer a user question about complaint data.
    `complaints` should be a list of SQLAlchemy Complaint model instances.
    """
    context = serialize_complaints(complaints)
    initial_state = {
        "user_question": user_question,
        "complaints_context": context,
        "ai_answer": None,
    }
    final_state = chat_graph.invoke(initial_state)
    return final_state.get("ai_answer", "I could not generate an answer.")


def extract_complaint_from_document(text: str) -> Dict[str, Any]:
    """
    Uses LangGraph and Gemini to extract structured complaint fields from text.
    """
    if not text.strip():
        return {}
    initial_state = {"raw_text": text, "extracted_data": None}
    final_state = extract_graph.invoke(initial_state)
    return final_state.get("extracted_data", {})


def analyze_complaint_text(text: str) -> Dict[str, Any]:
    """
    Legacy keyword-based analysis (fallback).
    """
    text_lower = text.lower()

    if any(w in text_lower for w in ["critical", "failure", "danger", "broken", "severe", "leak"]):
        severity = "High"
    elif any(w in text_lower for w in ["delay", "issue", "defect", "error"]):
        severity = "Medium"
    else:
        severity = "Low"

    if any(w in text_lower for w in ["software", "bug", "app", "crash", "code"]):
        category = "Software / IT"
    elif any(w in text_lower for w in ["hardware", "machine", "part", "physical"]):
        category = "Hardware / Physical"
    elif any(w in text_lower for w in ["delay", "shipment", "delivery", "logistics"]):
        category = "Logistics / Supply Chain"
    else:
        category = "Quality / Process"

    return {
        "suggested_category": category,
        "suggested_severity": severity,
        "summary": f"Automated analysis: Identified issue regarding '{category}' with '{severity}' severity.",
        "root_cause_recommendation": f"Potential root cause related to {category.lower()} execution or component degradation.",
        "capa_recommendation": f"1. Inspect the affected {category.lower()} process.\n2. Apply corrective patch or maintenance.\n3. Monitor for 14 days."
    }