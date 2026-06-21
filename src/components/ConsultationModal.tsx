import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LucideIcon from "./LucideIcon";

interface ConsultationFormData {
  fullName: string;
  email: string;
  companyName: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function ConsultationModal({ isOpen, onClose, isDarkMode }: ConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ConsultationFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      service: "ai-solutions",
      budget: "50k-100k",
      timeline: "1-3-months",
      message: ""
    }
  });

  if (!isOpen) return null;

  const onSubmitForm = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    // Simulate real high-fidelity corporate API proxy sequence
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Consultation booked:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border transition-all duration-300 transform scale-100 z-10 ${
          isDarkMode 
            ? "bg-[#0b0f19] border-slate-800 text-white" 
            : "bg-white border-slate-200 text-slate-800"
        } shadow-2xl shadow-sky-500/10`}
      >
        {/* Futuristic glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#00D4FF] to-accent" />

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
          }`}
          aria-label="Close dialog"
        >
          <LucideIcon name="X" className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <LucideIcon name="Brain" className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">Book Strategic Consultation</h3>
                <p className="text-sm text-slate-400">Align your digital architecture with elite solution architects</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("fullName", { required: "Full Name is required" })}
                    placeholder="E.g., Dr. Allison Vance"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-xs text-rose-500 mt-1 block">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    {...register("email", { 
                      required: "Corporate Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email format"
                      }
                    })}
                    placeholder="allison@company.com"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="Global Systems Corp"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500" 
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                    }`}
                  />
                </div>

                {/* Service Required */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Target Solution Pillar
                  </label>
                  <select
                    {...register("service")}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-[#111827] border-slate-800 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="ai-solutions">Artificial Intelligence Solutions</option>
                    <option value="cloud-engineering">Cloud Architecture & Scaling</option>
                    <option value="cybersecurity">Advanced Cybersecurity Audits</option>
                    <option value="software-development">Custom Software Development</option>
                    <option value="web-development">Responsive Web Systems</option>
                    <option value="mobile-app-development">High-Performance Mobile Apps</option>
                    <option value="devops">SRE & Deployment pipelines</option>
                    <option value="data-analytics">Big Data Visualization</option>
                    <option value="ui-ux-design">Visual Identity & Prototyping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Estimated Venture Budget
                  </label>
                  <select
                    {...register("budget")}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-[#111827] border-slate-800 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="under-25k">Under $25,000 USD</option>
                    <option value="25k-50k">$25,000 - $50,000 USD</option>
                    <option value="50k-100k">$50,000 - $100,000 USD</option>
                    <option value="100k-250k">$100,000 - $250,000 USD</option>
                    <option value="250k-plus">$250,000+ USD (Enterprise)</option>
                  </select>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                    Development Schedule
                  </label>
                  <select
                    {...register("timeline")}
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                      isDarkMode 
                        ? "bg-[#111827] border-slate-800 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <option value="immediate">Immediate Launch (1 month)</option>
                    <option value="1-3-months">Standard Span (1-3 months)</option>
                    <option value="3-6-months">Long-Term (3-6 months)</option>
                    <option value="flexible">Flexible / Continuous retainer</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5">
                  Briefly Describe Your Business Objectives
                </label>
                <textarea
                  rows={3}
                  {...register("message")}
                  placeholder="Outline key system scale parameters, compliance goals, or neural objectives..."
                  className={`w-full px-4 py-2.5 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                    isDarkMode 
                      ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500" 
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <input 
                  type="checkbox" 
                  id="agree-checkbox" 
                  required 
                  defaultChecked
                  className="rounded dark:bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <label htmlFor="agree-checkbox" className="text-xs text-slate-400 cursor-pointer select-none">
                  I accept Nexora Tech's zero-sharing data policy and standard NDA guidelines.
                </label>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`w-full py-3 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors ${
                    isDarkMode ? "bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-900 hover:text-white" : "bg-slate-100 text-slate-700 border border-slate-250 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 duration-200 rounded-lg flex items-center justify-center gap-2 border border-blue-500/30 font-mono tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LucideIcon name="Loader2" className="w-4 h-4 animate-spin text-white" />
                      <span>SCHEDULING...</span>
                    </>
                  ) : (
                    <>
                      <LucideIcon name="Rocket" className="w-4 h-4" />
                      <span>INITIALIZE SPAN</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            {/* Holographic Signal Success */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-120 animate-pulse" />
              <div className="relative p-5 rounded-full bg-slate-900/80 border-2 border-[#00D4FF] text-[#00D4FF] flex items-center justify-center shadow-lg">
                <LucideIcon name="Fingerprint" className="w-12 h-12" />
              </div>
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-2">Venture Verification Initiated</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Our automated intake systems successfully compiled your credentials. A Senior Project Architect will contact you directly within 2 business hours.
            </p>

            {/* Custom interactive dashboard preview inside success of modal */}
            <div className={`w-full max-w-sm rounded-xl border p-4 mb-6 text-left text-xs font-mono select-none ${
              isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex justify-between items-center text-slate-500 border-b pb-2 mb-2 dark:border-slate-800">
                <span>SYSTEM SECTOR STATE</span>
                <span className="text-[#00D4FF] animate-pulse">● SECURE SYNC</span>
              </div>
              <div className="space-y-1.5 text-slate-400">
                <p>REF ID: <span className="text-slate-200">NEX-{Math.floor(100000 + Math.random() * 900000)}</span></p>
                <p>STATUS: <span className="text-blue-400 font-bold">READY_INTAKE_QUEUE</span></p>
                <p>VELOCITY: <span className="text-slate-200">94.2 Gbps</span></p>
                <p>SIGNATURE: <span className="text-purple-400">SHA256_VERIFIED</span></p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 duration-200 rounded-lg shadow-md cursor-pointer"
            >
              Back to Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
