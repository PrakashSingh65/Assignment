import json
from typing import Dict, Any

def analyze_complaint_text(text: str) -> Dict[str, Any]:
    """
    Analyzes complaint text/document content to extract severity,
    category, root cause, and CAPA recommendations.
    """
    text_lower = text.lower()
    
    # 1. Determine Severity
    if any(w in text_lower for w in ["critical", "failure", "danger", "broken", "severe", "leak"]):
        severity = "High"
    elif any(w in text_lower for w in ["delay", "issue", "defect", "error"]):
        severity = "Medium"
    else:
        severity = "Low"
        
    # 2. Determine Category
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