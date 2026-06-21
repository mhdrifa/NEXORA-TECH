import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LucideIcon from "./LucideIcon";

interface ContactProps {
  isDarkMode: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export default function Contact({ isDarkMode }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "ai-solutions",
      budget: "50k-100k",
      message: ""
    }
  });

  const onSubmitContact = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact ticket logged:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    reset();
  };

  return (
    <section 
      id="contact" 
      className={`py-16 md:py-24 transition-colors duration-300 relative ${
        isDarkMode 
          ? "bg-[#030610] to-[#050816]" 
          : "bg-slate-50"
      }`}
    >
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // SECURE COMMUNICATIONS Channels
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            ESTABLISH COMMUNICATION CORE
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Open a secure channel to map integrations, plan structural compliance audits, or schedule deep team sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">
          
          {/* Business Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <h3 className={`text-xl font-bold uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Nexora Operations Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Our principal communication coordinators are available continuously under corporate SLAs. For direct emergencies, reference critical system escalation pathways.
              </p>

              {/* Grid of contact details */}
              <div className="space-y-4 pt-2">
                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-[#00D4FF] flex-shrink-0">
                    <LucideIcon name="Mail" className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[9px] text-slate-500 uppercase block">EMAIL COMMUNICATION</span>
                    <a href="mailto:nexoratech.lk@gmail.com" className={`text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"} hover:text-[#00D4FF] duration-150`}>
                      nexoratech.lk@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0">
                    <LucideIcon name="Phone" className="w-4 h-4" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[9px] text-slate-500 uppercase block">PHONE ESCALATIONS</span>
                    <a href="tel:0764986133" className={`text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"} hover:text-purple-400 duration-150`}>
                      0764986133
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                    <LucideIcon name="MapPin" className="w-4 h-4" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="text-[9px] text-slate-500 uppercase block">SATELLITE POSITION</span>
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-250" : "text-slate-800"}`}>
                      Main building, Puttalam
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Futuristic Map Blueprint Map */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between h-56 select-none relative overflow-hidden ${
              isDarkMode ? "bg-slate-950 border-slate-900" : "bg-white border-slate-200 shadow-sm"
            }`}>
              {/* Overlay dark blueprint gird lines */}
              <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
              
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-b dark:border-slate-8D5 pb-2 relative z-10">
                <span>GPS POSITION COUPLING</span>
                <span className="text-[#00D4FF] animate-pulse">● LAT_8.0330_N</span>
              </div>

              {/* Schematic Map visual circle representation */}
              <div className="flex items-center justify-center py-4 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full scale-130 animate-pulse" />
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00D4FF]/40 flex items-center justify-center animate-spin duration-10000">
                    <div className="w-10 h-10 rounded-full border border-blue-500/50 flex items-center justify-center">
                      <LucideIcon name="Compass" className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  {/* blinking dot indicator representing corporate headquarter */}
                  <div className="absolute top-[30px] left-[30px] w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
                  <div className="absolute top-[30px] left-[30px] w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </div>
                <div className="text-left font-mono text-[9px] text-slate-500 ml-6 space-y-0.5">
                  <p>HQ_OFFICE: <span className="text-[#00D4FF]">ACTIVE</span></p>
                  <p>LAT: 8.0330° N</p>
                  <p>LONG: 79.8257° E</p>
                  <p>ALTITUDE: 8m (MSL)</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 pt-1.5 border-t dark:border-slate-905 relative z-10">
                <span>ZOOM REGION: 1.2M CLUSTER</span>
                <span className="text-slate-450">SEC2_VERIFIED_HQ</span>
              </div>
            </div>

          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className={`p-6 md:p-8 rounded-2xl border ${
              isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-white border-slate-200"
            } shadow-xl`}>
              
              {!isSuccess ? (
                <form onSubmit={handleSubmit(onSubmitContact)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        placeholder="E.g., Allison Vance"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-xs text-rose-500 mt-1 block">{errors.name.message}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Company Email *
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        placeholder="allison@company.com"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                      {errors.email && (
                        <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Phone contact
                      </label>
                      <input
                        type="text"
                        {...register("phone")}
                        placeholder="+1 (555) 0192"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                    </div>

                    {/* Company */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        {...register("company")}
                        placeholder="Global Systems Corp"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service Required */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        ServiceRequired
                      </label>
                      <select
                        {...register("service")}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-[#111827] border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-805"
                        }`}
                      >
                        <option value="ai-solutions">Artificial Intelligence Solutions</option>
                        <option value="cloud-engineering">Cloud Architecture & Scaling</option>
                        <option value="cybersecurity">Advanced Cybersecurity Audits</option>
                        <option value="software-development">Custom Software Development</option>
                        <option value="mobile development">Mobile Touch Apps</option>
                        <option value="web development">Responsive Web Systems</option>
                        <option value="devops">SRE & Deployment pipelines</option>
                        <option value="data-analytics">Big Data Visualization</option>
                        <option value="ui-ux-design">Visual Identity & Prototyping</option>
                      </select>
                    </div>

                    {/* Budget */}
                    <div className="text-left">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Venture Budget Estimate
                      </label>
                      <select
                        {...register("budget")}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-[#111827] border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-805"
                        }`}
                      >
                        <option value="under-25k">Under $25,000 USD</option>
                        <option value="25k-50k">$25,000 - $50,000 USD</option>
                        <option value="50k-100k">$50,000 - $100,000 USD</option>
                        <option value="100k-250k">$100,000 - $250,000 USD</option>
                        <option value="250k-plus">$250,000+ USD</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Business objectives & constraints
                    </label>
                    <textarea
                      rows={4}
                      {...register("message")}
                      placeholder="Outline operational metrics, timeline, or compliance requirements."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        isDarkMode 
                          ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" 
                          : "bg-slate-50 border-slate-205 text-slate-800 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded duration-200 flex items-center justify-center gap-2 border border-blue-500/25 cursor-pointer font-mono shadow-md shadow-blue-500/10"
                    >
                      {isSubmitting ? (
                        <>
                          <LucideIcon name="Loader2" className="w-3.5 h-3.5 animate-spin" />
                          <span>TRANSMITTING CORE BLOCK...</span>
                        </>
                      ) : (
                        <>
                          <LucideIcon name="Send" className="w-3.5 h-3.5" />
                          <span>SEND SECURE TRANSMISSION</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-12 text-center select-none">
                  <div className="relative mb-6 flex justify-center">
                    <div className="absolute inset-0 bg-blue-500/15 blur-2xl rounded-full scale-120 animate-pulse" />
                    <div className="relative p-5 rounded-full bg-slate-900 border-2 border-[#00D4FF] text-[#00D4FF]">
                      <LucideIcon name="Fingerprint" className="w-12 h-12" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">Transmission complete</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8">
                    Your secure communication ticket has been received and compiled. Our Client Success unit will contact you following qualification steps.
                  </p>

                  <button
                    onClick={handleResetForm}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-905 border border-slate-800 hover:bg-slate-800 duration-150 rounded"
                  >
                    Transmit another ticket
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
