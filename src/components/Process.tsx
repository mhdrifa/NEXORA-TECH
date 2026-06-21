import React, { useState } from "react";
import { processWorkflow } from "../data";
import LucideIcon from "./LucideIcon";

interface ProcessProps {
  isDarkMode: boolean;
}

export default function Process({ isDarkMode }: ProcessProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = processWorkflow[activeStepIdx];

  return (
    <section 
      id="process" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative overflow-hidden ${
        isDarkMode 
          ? "bg-[#030610] to-[#050816]" 
          : "bg-slate-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // CORPORATE WORKFLOW
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            SLA LIFECYCLE DEPLOYMENTS
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Take a deep look behind our specialized operations workflow. Aligning discovery and automated code reviews to produce bulletproof production frameworks.
          </p>
        </div>

        {/* Stepper timeline selector */}
        <div className="relative max-w-5xl mx-auto mb-12 select-none overflow-x-auto">
          {/* horizontal background line */}
          <div className={`hidden md:block absolute top-[21px] left-8 right-8 h-0.5 z-[1] ${
            isDarkMode ? "bg-slate-900" : "bg-slate-200"
          }`} />

          <div className="flex justify-between items-center min-w-[700px] md:min-w-0 px-2 relative z-10 py-1.5">
            {processWorkflow.map((step, idx) => {
              const isActive = activeStepIdx === idx;
              const isPassed = activeStepIdx > idx;

              let dotStyle = isDarkMode 
                ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700" 
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-350";
              
              if (isActive) {
                dotStyle = "bg-gradient-to-r from-blue-600 to-[#00D4FF] text-white border-blue-500/30 shadow shadow-blue-500/30 ring-2 ring-blue-500/35";
              } else if (isPassed) {
                dotStyle = "bg-blue-600/10 text-blue-500 border-blue-500/45";
              }

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepIdx(idx)}
                  className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                  aria-label={`Select step ${step.stepNumber}: ${step.title}`}
                >
                  {/* Step digit circle */}
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold font-mono text-xs duration-200 ${dotStyle}`}>
                    {isPassed ? (
                      <LucideIcon name="Check" className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span>0{step.stepNumber}</span>
                    )}
                  </div>

                  {/* Horizontal text title descriptor */}
                  <span className={`text-[10px] font-bold font-sans tracking-wide uppercase ${
                    isActive ? "text-[#00D4FF]" : "text-slate-500"
                  }`}>
                    {step.title.split(". ")[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Viewer for selected workflow step */}
        <div className={`max-w-4xl mx-auto rounded-3xl border p-6 md:p-8 ${
          isDarkMode 
            ? "bg-[#0b101c]/45 border-slate-900/60" 
            : "bg-white border-slate-200"
        } shadow-lg relative`}>
          <div className="absolute inset-0 bg-blue-500/5 blur-[50px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Spec side */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono tracking-widest font-black text-[#00D4FF] uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  LIFECYCLE STAGE 0{activeStep.stepNumber}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ ISO compliance verified</span>
              </div>

              <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {activeStep.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                {activeStep.details}
              </p>

              {/* Deliverable/Milestone item */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? "bg-slate-950/60 border-slate-905" : "bg-sky-50/40 border-slate-200 text-slate-800"
              }`}>
                <div className="p-2 bg-[#00D4FF]/10 text-[#00D4FF] rounded">
                  <LucideIcon name="Rocket" className="w-4 h-4 text-[#00D4FF]" />
                </div>
                <div className="leading-tight">
                  <span className="text-[9px] text-slate-500 uppercase block mb-0.5 font-sans">TARGET MILESTONE</span>
                  <span className={`text-xs font-mono font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>{activeStep.milestone}</span>
                </div>
              </div>
            </div>

            {/* Illustration details side column */}
            <div className="md:col-span-5 w-full">
              <div className={`p-5 rounded-2xl border font-mono text-xs text-slate-400 font-mono ${
                isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"
              }`}>
                <div className="flex justify-between items-center text-[9px] text-slate-500 border-b pb-2 mb-3">
                  <span>METRIC_POSTURE</span>
                  <span className="text-[#00D4FF] animate-pulse">● READY</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span>QUALITY AUDIT VERIFY:</span>
                    <span className="text-emerald-500 font-bold">100% PASS</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>SLA INTEGRATION SCORE:</span>
                    <span className="text-blue-400">99.86% TARGET</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>COMPLEXITY MULTIPLIER:</span>
                    <span className="text-slate-250">0.82 DAMPED</span>
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
