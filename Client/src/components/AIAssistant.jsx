import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, Send, Bot, User, FileText, MessageSquare } from "lucide-react";
import axios from "axios";


const safeText = (val) => {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map(safeText).filter(Boolean).join("\n");
  if (val && typeof val === "object") {
    if (val.text !== undefined) return safeText(val.text);
    if (val.content !== undefined) return safeText(val.content);
    if (val.message !== undefined) return safeText(val.message);
    return JSON.stringify(val, null, 2);
  }
  return String(val ?? "");
};

export default function AIAssistant({ onExtractedData }) {
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat"); // "chat" or "extract"
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", content: "Hi! I'm your QMS AI Assistant. You can:\n• **Chat** – Ask me questions about complaints in the database.\n• **Extract** – Paste complaint text or upload a document to auto-fill the form.\n\nSwitch modes using the buttons above." }
  ]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // File Upload Handler (always extracts)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setChatHistory(prev => [...prev, { role: "user", content: `📎 Uploaded file: ${file.name}` }]);
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (onExtractedData) onExtractedData(res.data.extracted_data || res.data);
      setChatHistory(prev => [...prev, { role: "ai", content: "✅ Document processed successfully! I've populated the form fields with the extracted data." }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "ai", content: "❌ Failed to upload and extract document. Check backend terminal for details." }]);
    } finally {
      setLoading(false);
    }
  };

  // Text Handler – routes to either /ai/chat or /ai/extract_text
  const handleSendText = async () => {
    if (!textInput.trim()) return;

    const userText = textInput;
    setTextInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      if (mode === "extract") {
        // Extraction mode: send to /ai/extract_text and auto-fill form
        const res = await axios.post("http://127.0.0.1:8000/ai/extract_text", { text: userText });
        if (onExtractedData) onExtractedData(res.data.extracted_data || res.data);
        setChatHistory(prev => [...prev, { role: "ai", content: "✅ Text processed! The form has been populated with the extracted information." }]);
      } else {
        // Chat mode: send to /ai/chat and display AI answer
        const res = await axios.post("http://127.0.0.1:8000/ai/chat", { message: userText });
        const answer = safeText(res.data.answer) || "I could not generate an answer.";
        setChatHistory(prev => [...prev, { role: "ai", content: answer }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "ai", content: "❌ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">AI Complaint Intake Assistant</h2>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">
          BETA
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setMode("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === "chat"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <MessageSquare size={14} />
          Chat with AI
        </button>
        <button
          onClick={() => setMode("extract")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === "extract"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <FileText size={14} />
          Extract Data
        </button>
      </div>

      {/* File Upload Box (only in extract mode) */}
      {mode === "extract" && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer relative shrink-0">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto text-slate-400 mb-2" size={24} />
          <p className="text-xs text-slate-600 font-medium">
            {loading ? "Processing..." : "Drag & drop complaint document"}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, TXT, EML (Max 10MB)</p>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto min-h-[200px] border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 text-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div className={`p-2.5 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
              {safeText(msg.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 text-xs">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
              <Bot size={12} />
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center gap-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.15s" }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>●</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Text Input Box */}
      <div className="pt-2 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder={mode === "chat" ? "Ask about complaints in the database..." : "Paste complaint text to extract fields..."}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendText}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 text-center">
          Mode: <span className="font-semibold">{mode === "chat" ? "Chat (Q&A about DB)" : "Extract (auto-fill form)"}</span>
        </p>
      </div>
    </div>
  );
}