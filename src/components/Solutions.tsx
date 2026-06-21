import React, { useState } from "react";
import { solutionsData } from "../data";
import { SolutionItem } from "../types";
import LucideIcon from "./LucideIcon";

interface SolutionsProps {
  isDarkMode: boolean;
  onConsultationClick: () => void;
}

export default function Solutions({ isDarkMode, onConsultationClick }: SolutionsProps) {
  const [activeTab, setActiveTab] = useState<string>(solutionsData[0].id);
  const activeSolution = solutionsData.find((s) => s.id === activeTab) || solutionsData[0];

  return (
    <section 
      id="solutions" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative overflow-hidden ${
        isDarkMode 
          ? "bg-[#050816] border-slate-900" 
          : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // SPECIALIZED COMPLIANT SYSTEMS
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            FEATURED ENTERPRISE SUITES
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Scalable, pre-engineered high-concurrency boilerplates and autonomous agent containers designed to replace manual overheads immediately.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {solutionsData.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/40 shadow-md"
                    : isDarkMode
                      ? "bg-[#0b101c]/45 border-slate-900 text-slate-400 hover:text-white"
                      : "bg-slate-50 border-slate-250 text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.subtitle}
              </button>
            );
          })}
        </div>

        {/* Expanded Dashboard Mockup panel for active Solution item */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl relative ${
          isDarkMode 
            ? "bg-[#080d1a] border-slate-800"
            : "bg-slate-50/60 border-slate-200"
        }`}>
          {/* Subtle colored shadow */}
          <div className="absolute inset-0 bg-blue-500/5 blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 items-center">
            
            {/* Details Side */}
            <div className="lg:col-span-7 space-y-6">
              <span className={`inline-flex px-3 py-1 text-[10px] font-bold font-mono tracking-wider text-white uppercase rounded-full bg-gradient-to-r ${activeSolution.gradient}`}>
                {activeSolution.subtitle}
              </span>

              <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {activeSolution.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {activeSolution.description}
              </p>

              {/* Dynamic verified Badge */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isDarkMode ? "bg-slate-950/60 border-slate-905" : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-500">VERIFIED METRIC SAVINGS</span>
                </div>
                <span className="text-xs md:text-sm font-bold font-mono text-emerald-400">{activeSolution.metrics}</span>
              </div>

              {/* Benefits list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">// core architectural features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSolution.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex gap-2.5 items-start">
                      <LucideIcon name="Check" className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-350">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onConsultationClick}
                  className="px-6 py-3 text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 duration-200 rounded-lg shadow-md font-mono border border-blue-500/20 cursor-pointer"
                >
                  INTEGRATE WITH MY ARCHITECTURE
                </button>
              </div>
            </div>

            {/* Interactive Schematic Side */}
            <div className="lg:col-span-5 w-full">
              <div className={`p-6 rounded-2xl border font-mono text-xs text-slate-400 ${
                isDarkMode ? "bg-slate-950/90 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-b pb-3 mb-4 dark:border-slate-800 border-slate-100">
                  <span>SCHEMATIC_VIEW</span>
                  <span className="text-[#00D4FF] animate-pulse">● PIPELINE_ACTIVE</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-2 rounded dark:bg-slate-900 border dark:border-slate-800 border-slate-100">
                    <span>INTERFACE ENCRYPTION</span>
                    <span className="text-emerald-500 font-bold">AES_256_GCM</span>
                  </div>
                  <div className="flex justify-between p-2 rounded dark:bg-slate-900 border dark:border-slate-800 border-slate-100">
                    <span>API RETRY TIMERS</span>
                    <span className="text-slate-250">BACKOFF_DAMPED_60S</span>
                  </div>
                  <div className="flex justify-between p-2 rounded dark:bg-slate-900 border dark:border-slate-800 border-slate-100">
                    <span>DATABASE BACKUP TYPE</span>
                    <span className="text-blue-400 font-bold">DISTRIBUTED_SHARD</span>
                  </div>
                  
                  {/* Glowing custom dynamic canvas status element */}
                  <div className={`p-3 rounded border flex items-center justify-between ${
                    isDarkMode ? "bg-blue-950/10 border-blue-900/30 text-blue-300" : "bg-blue-50 border-blue-100 text-blue-700"
                  }`}>
                    <div className="flex items-center gap-2">
                      <LucideIcon name={activeSolution.iconName} className="w-4 h-4 animate-spin duration-5000" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{activeSolution.subtitle}</span>
                    </div>
                    <span className="text-[10px] font-bold">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
