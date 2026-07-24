import React from 'react';
import { Upload, Clipboard, Sparkles, Bot, Send } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">AI Complaint Intake Assistant</h2>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded border border-blue-200">
            BETA
          </span>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-slate-50/50">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Drag & drop complaint document here</span>
          </p>
          <p className="text-xs text-blue-600 hover:underline cursor-pointer mt-1">or click to browse</p>
        </div>

        <div className="text-center text-xs text-slate-400 font-semibold my-2">OR</div>

        <button className="w-full flex items-center justify-center gap-2 border border-slate-200 p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
          <Clipboard className="w-4 h-4 text-slate-500" />
          Paste Complaint Text / Email
        </button>

        <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 space-y-1 border border-slate-100">
          <p>⚡ <b>Supported formats:</b> PDF, DOCX, TXT, EML</p>
          <p>Max file size: 10MB</p>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-600 text-[11px]">EXTRACTION PROGRESS</span>
            <span className="font-bold text-blue-600 text-[11px]">10%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[10%]" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Analyzing document content and extracting key details... <br/>
            Please wait, this may take a few moments.
          </p>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900">
          <Bot className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-6">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask me anything about this complaint..." 
            className="w-full text-xs p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-2">
          AI responses may contain errors. Please verify information.
        </p>
      </div>
    </div>
  );
}