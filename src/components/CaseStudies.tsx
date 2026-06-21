import React, { useState } from "react";
import { caseStudiesData } from "../data";
import LucideIcon from "./LucideIcon";

interface CaseStudiesProps {
  isDarkMode: boolean;
}

export default function CaseStudies({ isDarkMode }: CaseStudiesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCase = caseStudiesData[activeIndex];

  return (
    <section 
      id="case-studies" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#030610] to-[#050816]" 
          : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // PLATFORM AUDIT RECORDS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            SUCCESS ARCH REVIEWS
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Examine the challenge mappings, strategic solutions, and verified fiscal gains recorded across representative global customer clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Selectors List Column */}
          <div className="lg:col-span-4 space-y-3">
            {caseStudiesData.map((cs, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={cs.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/40 shadow-md"
                      : isDarkMode
                        ? "bg-[#0b101c]/45 border-slate-900 hover:border-slate-800 text-slate-350"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider mb-2 ${
                    isSelected ? "text-blue-200" : "text-[#00D4FF]"
                  }`}>
                    {cs.industry}
                  </span>
                  
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-tight truncate w-full mb-3">
                    {cs.client}
                  </h3>

                  <div className="flex justify-between items-center text-[9px] font-mono w-full opacity-80 pt-1.5 border-t border-white/10">
                    <span>DURATION</span>
                    <span>{cs.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Main Timeline Container Box Column */}
          <div className="lg:col-span-8">
            <div className={`p-6 md:p-8 rounded-2xl border ${
              isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-white border-slate-200"
            } shadow-xl`}>
              
              {/* Header metadata layout */}
              <div className="flex flex-wrap justify-between items-center gap-4 border-b dark:border-slate-900 border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-bold text-[#00D4FF] uppercase bg-cyan-500/5 px-2.5 py-1 rounded border border-cyan-500/10">
                    {activeCase.industry}
                  </span>
                  <h3 className={`text-base font-bold font-sans mt-2.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Client: {activeCase.client}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 font-mono block">AUDIT STAGE: COMPLETE</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{activeCase.duration} span</span>
                </div>
              </div>

              {/* Success metrics flash box */}
              <div className={`p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs md:text-sm font-mono mb-6 flex items-center gap-3 ${
                isDarkMode ? "" : "border-emerald-500/30 bg-emerald-50"
              }`}>
                <LucideIcon name="Check" className="w-5 h-5 flex-shrink-0" />
                <div className="leading-tight">
                  <span className="text-[10px] text-slate-500 uppercase block mb-0.5 font-sans">VERIFIED OUTCOME</span>
                  <span className="font-bold">{activeCase.metrics}</span>
                </div>
              </div>

              {/* Interactive Timeline steps (Challenge, Solution, Result) */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-1 before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-800">
                
                {/* 1. CHALLENGE */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-[9px] h-[9px] rounded-full bg-red-500/80 border border-red-500 animate-pulse" />
                  <h4 className="text-xs font-black font-mono tracking-wider text-slate-500 uppercase">CHALLENGE</h4>
                  <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed font-sans">
                    {activeCase.challenge}
                  </p>
                </div>

                {/* 2. SOLUTION */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-[9px] h-[9px] rounded-full bg-[#00D4FF]/80 border border-[#00D4FF]" />
                  <h4 className="text-xs font-black font-mono tracking-wider text-[#00D4FF] uppercase">SOLUTION DEPLOYED</h4>
                  <p className="text-xs md:text-sm text-slate-450 mt-1.5 leading-relaxed font-sans">
                    {activeCase.solution}
                  </p>
                </div>

                {/* 3. RESULT */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-[9px] h-[9px] rounded-full bg-emerald-500/80 border border-emerald-500" />
                  <h4 className="text-xs font-black font-mono tracking-wider text-emerald-400 uppercase">RESULT COUPLING</h4>
                  <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed font-sans">
                    {activeCase.result}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
