import React, { useState, useEffect } from "react";
import { RotateCcw, Save } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function ComplaintForm({ extractedData }) {
  const initialData = {
    complaint_source: "",
    customer_name: "",
    product_name: "",
    product_strength: "",
    batch_number: "",
    manufacturing_date: "",
    expiry_date: "",
    quantity_affected: "",
    complaint_type: "",
    complaint_description: "",
    complaint_date: "",
    severity: "LOW",
    priority: "LOW",
    status: "DRAFT"
  };

  const [formData, setFormData] = useState(initialData);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));
    }
  }, [extractedData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // TanStack Query Mutation Setup
  const mutation = useMutation({
    mutationFn: async (newComplaint) => {
      // Clean up empty strings for date and numbers
      const payload = { ...newComplaint };
      if (!payload.manufacturing_date) payload.manufacturing_date = null;
      if (!payload.expiry_date) payload.expiry_date = null;
      if (!payload.quantity_affected) payload.quantity_affected = null;

      const response = await axios.post("http://127.0.0.1:8000/complaints/", payload);
      return response.data;
    },
    onSuccess: () => {
      setMessage("Complaint submitted successfully!");
      setFormData(initialData);
    },
    onError: (error) => {
      console.error(error);
      setMessage("Failed to submit complaint.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Log Customer Complaint</h1>
          <p className="text-sm text-slate-500">API & FDF Quality Assurance Module</p>
        </div>
        <span className="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-full text-xs font-semibold">
          Pending Triage
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && <p className="text-sm font-semibold text-blue-600">{message}</p>}

        {/* 1. ORIGIN & CUSTOMER DETAILS */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">1. Origin & Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Complaint Source</label>
              <input type="text" name="complaint_source" value={formData.complaint_source} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
              <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
          </div>
        </div>

        {/* 2. PRODUCT & BATCH IDENTIFICATION */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">2. Product & Batch Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
              <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Product Strength/Grade</label>
              <input type="text" name="product_strength" value={formData.product_strength || ""} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Batch/Lot Number</label>
              <input type="text" name="batch_number" value={formData.batch_number} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Manufacturing Date</label>
              <input type="date" name="manufacturing_date" value={formData.manufacturing_date || ""} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date</label>
              <input type="date" name="expiry_date" value={formData.expiry_date || ""} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity Affected (kg)</label>
              <input type="number" name="quantity_affected" value={formData.quantity_affected || ""} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
          </div>
        </div>

        {/* 3. COMPLAINT DETAILS */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">3. Complaint Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Complaint Type</label>
              <input type="text" name="complaint_type" value={formData.complaint_type} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Complaint Date</label>
              <input type="date" name="complaint_date" value={formData.complaint_date || ""} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Complaint Description</label>
            <textarea name="complaint_description" value={formData.complaint_description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Awaiting AI extraction..." />
          </div>
        </div>

        {/* 4. INITIAL ASSESSMENT & PRIORITY */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">4. Initial Assessment & Priority</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Severity</label>
              <select name="severity" value={formData.severity} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-100">
          <button type="button" onClick={() => setFormData(initialData)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <RotateCcw size={16} /> Reset Form
          </button>
          
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {mutation.isPending ? "Saving..." : <><Save size={16} /> Save Complaint</>}
          </button>
        </div>
      </form>
    </div>
  );
}