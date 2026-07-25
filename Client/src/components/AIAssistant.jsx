import React, { useState } from "react";
import { Upload, Sparkles, Send } from "lucide-react";
import axios from "axios";

export default function AIAssistant({ onExtractedData }) {
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  // File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded successfully!");
      if (onExtractedData) onExtractedData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload document. Check backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  // Text Handler
  const handleSendText = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    try {
      alert(`Processing: ${textInput}`);
      setTextInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">AI Complaint Intake Assistant</h2>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">
            BETA
          </span>
        </div>

        {/* File Upload Box */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="text-xs text-slate-600 font-medium">
            {loading ? "Uploading & Extracting..." : "Drag & drop complaint document here or click to browse"}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Supported formats: PDF, DOCX, TXT, EML (Max 10MB)</p>
        </div>

        {/* Text Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            OR Paste Complaint Text / Email
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask me anything about this complaint..."
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
        </div>
      </div>
    </div>
  );
}