import React from "react";
import { Calendar, RotateCcw, Save } from "lucide-react";

export default function ComplaintForm() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Log Customer Complaint
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            API & FDF Quality Assurance Module
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200">
          Pending Triage
        </span>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          1. Origin & Customer Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Complaint Source
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          2. Product & Batch Identification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Product Strength/Grade
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Batch/Lot Number
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Manufacturing Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Quantity Affected
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-400 absolute right-2.5 top-2.5">
                kg
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          3. Complaint Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Complaint Type
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Complaint Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Detailed Complaint Description
          </label>
          <textarea
            rows="3"
            placeholder="Awaiting AI extraction..."
            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          4. Initial Assessment & Priority
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Initial Severity
            </label>
            <select className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Awaiting AI extraction...</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Priority
            </label>
            <input
              type="text"
              placeholder="Awaiting AI extraction..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button className="flex items-center gap-1.5 text-xs text-slate-600 font-medium border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 transition">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Form
        </button>
        <button className="flex items-center gap-1.5 text-xs bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Save className="w-3.5 h-3.5" />
          Save Complaint
        </button>
      </div>
    </div>
  );
}
