import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { openCareers } from "../data";
import { JobPosition } from "../types";
import LucideIcon from "./LucideIcon";

interface CareersProps {
  isDarkMode: boolean;
}

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  githubUrl: string;
  resumeText: string;
}

export default function Careers({ isDarkMode }: CareersProps) {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ApplicationFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      githubUrl: "",
      resumeText: ""
    }
  });

  const onSubmitApplication = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Job application submitted:", { job: applyingJob?.title, candidate: data });
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleCloseApplication = () => {
    setIsSuccess(false);
    reset();
    setApplyingJob(null);
  };

  return (
    <section 
      id="careers" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#050816]" 
          : "bg-white"
      }`}
    >
      <div className="absolute bottom-1/4 right-[5%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // HUMAN ACQUISITIONS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            JOIN SEC-NEXORA FORCE
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Build serverless networks, fine-tune transformer model structures, and run tactical compliance tests with certified PhD architects.
          </p>
        </div>

        {/* Benefits Quick Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 select-none">
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-950/50 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
            <LucideIcon name="Award" className="w-6 h-6 text-[#00D4FF]" />
            <div className="text-left font-sans text-xs">
              <h4 className={`font-bold uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}>100% Core coverage</h4>
              <p className="text-slate-450 mt-0.5">Toptier health/vision plans</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-950/50 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
            <LucideIcon name="Rocket" className="w-6 h-6 text-blue-500" />
            <div className="text-left font-sans text-xs">
              <h4 className={`font-bold uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}>Uncapped Paid Off Time</h4>
              <p className="text-slate-450 mt-0.5">Focus on mental posture</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-950/50 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
            <LucideIcon name="Cpu" className="w-6 h-6 text-purple-500" />
            <div className="text-left font-sans text-xs">
              <h4 className={`font-bold uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}>Venture workstation</h4>
              <p className="text-slate-450 mt-0.5">$5,000 yearly tech allowance</p>
            </div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${isDarkMode ? "bg-slate-950/50 border-slate-900" : "bg-slate-50 border-slate-200"}`}>
            <LucideIcon name="Globe" className="w-6 h-6 text-emerald-500" />
            <div className="text-left font-sans text-xs">
              <h4 className={`font-bold uppercase ${isDarkMode ? "text-white" : "text-slate-800"}`}>Global remote scope</h4>
              <p className="text-slate-450 mt-0.5">Work from any time zone</p>
            </div>
          </div>
        </div>

        {/* Career Positions Cards Row list */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {openCareers.map((job) => {
            const isExpanded = selectedJob?.id === job.id;
            return (
              <div 
                key={job.id}
                className={`p-5 rounded-2xl border transition-all text-left ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 hover:border-slate-800" 
                    : "bg-slate-50/50 border-slate-200 hover:border-slate-350"
                }`}
              >
                
                {/* Header overview row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className={`text-base md:text-lg font-bold uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2.5 mt-1.5 text-[10px] font-mono text-slate-400">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="text-[#00D4FF] font-bold uppercase">{job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block">SALARY COMPENSATION</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{job.salary}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-450 leading-relaxed mt-4">
                  {job.description}
                </p>

                {/* Requirements / Benefits expansion toggled */}
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t dark:border-slate-900 border-slate-200 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">// POSITION MANDATES</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex gap-2 items-start text-xs text-slate-400">
                            <LucideIcon name="Check" className="w-4 h-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">// REWARDS BENEFIT MAP</h4>
                      <ul className="space-y-2">
                        {job.benefits.map((ben, bIdx) => (
                          <li key={bIdx} className="flex gap-2 items-start text-xs text-slate-400">
                            <LucideIcon name="Check" className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Expand / Apply Controls */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t dark:border-slate-905 border-slate-150">
                  <button
                    onClick={() => setSelectedJob(isExpanded ? null : job)}
                    className={`px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded border transition-all cursor-pointer ${
                      isExpanded
                        ? "bg-slate-950 text-white border-slate-804"
                        : isDarkMode
                          ? "bg-[#111827] text-slate-400 border-slate-800 hover:text-white"
                          : "bg-white text-slate-650 border-slate-250 hover:bg-slate-100"
                    }`}
                  >
                    {isExpanded ? "HIDE REQUIREMENTS" : "INSPECT REQUIREMENTS"}
                  </button>
                  <button
                    onClick={() => setApplyingJob(job)}
                    className="px-5 py-2 text-xs font-bold font-mono tracking-wider text-white uppercase bg-blue-600 hover:bg-blue-500 rounded transition-colors duration-150 border border-blue-500/25 cursor-pointer"
                  >
                    APPLY CARREER
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Candidacy Entry Modal Popup overlay */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleCloseApplication}
          />

          <div className={`relative w-full max-w-xl rounded-2xl border transition-all p-6 md:p-8 z-10 ${
            isDarkMode 
              ? "bg-[#0b0f19] border-slate-800 text-white" 
              : "bg-white border-slate-200 text-slate-800"
          } shadow-2xl`}>
            
            <button 
              onClick={handleCloseApplication}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              aria-label="Close dialog"
            >
              <LucideIcon name="X" className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1">Candidacy submission</h3>
                <p className="text-xs text-slate-400">Position target: <span className="text-[#00D4FF] font-semibold">{applyingJob.title}</span></p>

                <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4 mt-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Candidate Name */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("fullName", { required: "Full name is required" })}
                        placeholder="Dr. Allison Vance"
                        className={`w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                      {errors.fullName && (
                        <span className="text-xs text-rose-500 mt-1 block">{errors.fullName.message}</span>
                      )}
                    </div>

                    {/* Candidate Email */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        placeholder="allison@mit.edu"
                        className={`w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
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
                    {/* Candidate Phone */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Phone contact
                      </label>
                      <input
                        type="text"
                        {...register("phone")}
                        placeholder="+1 (555) 0192"
                        className={`w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                    </div>

                    {/* Github URL */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Github / LinkedIn Link *
                      </label>
                      <input
                        type="text"
                        {...register("githubUrl", { required: "Portfolio URL is required" })}
                        placeholder="github.com/allisonv"
                        className={`w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                          isDarkMode 
                            ? "bg-slate-900 border-slate-800 text-white" 
                            : "bg-slate-50 border-slate-205 text-slate-800"
                        }`}
                      />
                      {errors.githubUrl && (
                        <span className="text-xs text-rose-500 mt-1 block">{errors.githubUrl.message}</span>
                      )}
                    </div>
                  </div>

                  {/* resume cover pitch */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Brief cover highlights & references
                    </label>
                    <textarea
                      rows={3}
                      {...register("resumeText")}
                      placeholder="List core academic structures, previous team capacities, or docker optimization wins..."
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        isDarkMode 
                          ? "bg-slate-900 border-slate-800 text-white" 
                          : "bg-slate-50 border-slate-205 text-slate-800"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseApplication}
                      className={`py-3 text-xs font-bold uppercase rounded-lg border hover:bg-slate-100 transition-colors ${
                        isDarkMode ? "bg-slate-950 text-slate-300 border-slate-800" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3 text-xs font-bold text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded duration-200 flex items-center justify-center gap-2 border border-blue-500/25 cursor-pointer font-mono disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <LucideIcon name="Loader2" className="w-3.5 h-3.5 animate-spin" />
                          <span>FILING...</span>
                        </>
                      ) : (
                        <>
                          <LucideIcon name="Rocket" className="w-3.5 h-3.5" />
                          <span>SUBMIT APPL</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center select-none">
                <div className="relative mb-5 flex justify-center">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full scale-110" />
                  <div className="relative p-4 rounded-full bg-slate-900 border border-[#00D4FF] text-[#00D4FF]">
                    <LucideIcon name="Check" className="w-10 h-10" />
                  </div>
                </div>

                <h3 className="text-xl font-bold uppercase mb-1">Candidacy Logged</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Candidacy credentials successfully indexed under reference queue. Our Operations leadership team will contact you following resume reviews.
                </p>

                <button
                  onClick={handleCloseApplication}
                  className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 duration-150 rounded"
                >
                  Verify Complete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
