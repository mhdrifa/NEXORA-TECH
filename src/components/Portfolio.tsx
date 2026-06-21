import React, { useState } from "react";
import { portfolioData } from "../data";
import { ProjectItem } from "../types";
import LucideIcon from "./LucideIcon";

interface PortfolioProps {
  isDarkMode: boolean;
}

export default function Portfolio({ isDarkMode }: PortfolioProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [inspectedProject, setInspectedProject] = useState<ProjectItem | null>(null);

  const filterTabs = [
    { id: "all", label: "All Engagements" },
    { id: "ai", label: "AI Systems" },
    { id: "web", label: "Web Portals" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "cloud", label: "Cloud Infra" },
    { id: "enterprise", label: "Enterprise ERP" }
  ];

  const filteredProjects = activeTab === "all"
    ? portfolioData
    : portfolioData.filter((proj) => proj.category === activeTab);

  return (
    <section 
      id="portfolio" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#050816]" 
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // CORPORATE CREDENTIALS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            REPRESENTATIVE COMMITMENTS
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Real enterprise networks, custom models, and client dashboards designed and actively maintained by our specialized architects.
          </p>
        </div>

        {/* Filter Navigation Row */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 pb-4 border-b dark:border-slate-900 border-slate-100">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider duration-150 rounded-lg cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : isDarkMode
                      ? "text-slate-450 hover:text-white hover:bg-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            return (
              <div 
                key={proj.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 shadow-black/20" 
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                
                {/* Visual Image container with hover zoom */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                  <img 
                    src={proj.image} 
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 duration-500 transition-all filter brightness-[0.85] contrast-[1.05]"
                  />
                  
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 z-25 text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded-full border border-blue-400/20">
                    {proj.category}
                  </span>
                </div>

                {/* Info Text */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className={`text-lg font-bold uppercase tracking-tight duration-150 mb-3 ${
                      isDarkMode ? "text-white group-hover:text-[#00D4FF]" : "text-slate-900 group-hover:text-blue-600"
                    }`}>
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-450 leading-relaxed mb-4 line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Badges row */}
                  <div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.tech.map((t) => (
                        <span 
                          key={t} 
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                            isDarkMode 
                              ? "bg-slate-900 border-slate-800 text-slate-400" 
                              : "bg-white border-slate-150 text-slate-600"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Operational Metric check */}
                    <div className={`p-3 rounded-lg border text-xs font-mono mb-6 ${
                      isDarkMode ? "bg-slate-950/80 border-slate-900 text-[#00D4FF]" : "bg-white border-slate-150 text-blue-600"
                    }`}>
                      <span className="text-[9px] text-slate-500 uppercase block mb-0.5">METRIC STAT</span>
                      <span className="font-bold">{proj.metrics}</span>
                    </div>
                  </div>
                </div>

                {/* Inspect Button */}
                <div className="p-6 pt-0 border-t dark:border-slate-900 border-slate-150 mt-auto flex items-center justify-between">
                  <button 
                    onClick={() => setInspectedProject(proj)}
                    className="text-xs font-bold font-mono tracking-widest uppercase text-[#00D4FF] hover:text-white duration-150 cursor-pointer inline-flex items-center gap-1 group/btn"
                  >
                    <span>VIEW CASE DETAILS</span>
                    <LucideIcon name="ChevronRight" className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-1 duration-150" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Expanded Project Inspector drawer */}
      {inspectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setInspectedProject(null)}
          />

          <div className={`relative w-full max-w-2xl rounded-2xl border p-6 md:p-8 overflow-hidden z-10 ${
            isDarkMode 
              ? "bg-[#0b0f19] border-slate-800 text-white" 
              : "bg-white border-slate-200 text-slate-800"
          } shadow-2xl`}>
            
            <button 
              onClick={() => setInspectedProject(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              aria-label="Close dialog"
            >
              <LucideIcon name="X" className="w-5 h-5" />
            </button>

            {/* Headline and tags */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                {inspectedProject.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Engagement ref: {inspectedProject.id.toUpperCase()}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
              {inspectedProject.title}
            </h3>

            {/* Screenshot block */}
            <div className="h-56 md:h-64 rounded-xl overflow-hidden mb-6 relative">
              <img 
                src={inspectedProject.image} 
                alt={inspectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.8]"
              />
              {/* Overlay stats banner */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#050816]/85 border border-[#00D4FF]/20 text-white rounded-lg flex justify-between items-center z-10 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-sans">IMPACT PARAMETER:</span>
                <span className="text-xs font-mono font-bold text-[#00D4FF]">{inspectedProject.metrics}</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">// ENGAGEMENT SYNOPSIS</h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                {inspectedProject.details}
              </p>
            </div>

            {/* Tech tag matrix row */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">// DEPLOYED FRAMEWORKS</h4>
              <div className="flex flex-wrap gap-2">
                {inspectedProject.tech.map((t) => (
                  <span 
                    key={t} 
                    className={`text-xs font-mono px-3 py-1 rounded-lg border ${
                      isDarkMode 
                        ? "bg-slate-900 border-slate-800 text-[#00D4FF]" 
                        : "bg-slate-50 border-slate-200 text-blue-600"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInspectedProject(null)}
                className={`py-3 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all font-mono cursor-pointer ${
                  isDarkMode ? "bg-slate-950 text-slate-400 border-slate-800 hover:text-white" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                CLOSE ENGAGEMENT
              </button>
              <button
                onClick={() => {
                  setInspectedProject(null);
                  const contactSec = document.getElementById("contact");
                  if (contactSec) {
                    window.scrollTo({ top: contactSec.offsetTop - 80, behavior: "smooth" });
                  }
                }}
                className="py-3 text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 duration-200 rounded-lg font-mono border border-blue-500/30 shadow-lg cursor-pointer"
              >
                INQUIRE REPLICA
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
