import React, { useState } from "react";
import { Calendar, RotateCcw, Save } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
    status: "Open"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // TanStack Query Mutation Setup
  const mutation = useMutation({
    mutationFn: async (newComplaint) => {
      const response = await axios.post("http://127.0.0.1:8000/complaints/", newComplaint);
      return response.data;
    },
    onSuccess: () => {
      setMessage("Complaint submitted successfully!");
      setFormData({ title: "", description: "", severity: "Low", status: "Open" });
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
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
      {message && <p className="text-sm font-semibold text-blue-600">{message}</p>}

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {mutation.isPending ? "Submitting..." : "Submit Complaint"}
        </button>

        <button
          type="button"
          onClick={() => setFormData({ title: "", description: "", severity: "Low", status: "Open" })}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </form>
  );
}