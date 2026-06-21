import React, { useState } from "react";
import { servicesData } from "../data";
import { ServiceItem } from "../types";
import LucideIcon from "./LucideIcon";

interface ServicesProps {
  isDarkMode: boolean;
  onConsultationClick: () => void;
}

export default function Services({ isDarkMode, onConsultationClick }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section 
      id="services" 
      className={`py-16 md:py-24 transition-colors duration-300 border-b relative ${
        isDarkMode 
          ? "bg-[#050816] border-slate-900" 
          : "bg-white border-slate-200"
      }`}
    >
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            // SOLUTIONS CATALOG
          </span>
          <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase mt-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            CORE ARCHITECTURAL PILLARS
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-4 leading-relaxed">
            Highly specialized engineering modules deployed directly into your live ecosystems. Fully certified, cloud-native, and encrypted under SOC2.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            return (
              <div 
                key={service.id}
                className={`p-6 rounded-2xl border transition-all duration-300 group hover:shadow-xl hover:shadow-sky-500/5 relative overflow-hidden flex flex-col justify-between ${
                  isDarkMode 
                    ? "bg-[#0b101c]/45 border-slate-900 hover:border-slate-800" 
                    : "bg-slate-50/50 border-slate-200 hover:border-slate-350"
                }`}
              >
                {/* Subtle colored accent overlay on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/15 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-500 transition-all pointer-events-none" />

                <div>
                  {/* Icon */}
                  <div className="p-3 w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-[#00D4FF] mb-5">
                    <LucideIcon name={service.iconName} className="w-6 h-6 text-[#00D4FF]" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg md:text-xl font-bold tracking-tight uppercase mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Mini-bullets of features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-slate-350 font-sans">
                        <LucideIcon name="Check" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More click pathway */}
                <button
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider font-mono text-[#00D4FF] hover:text-white duration-200 uppercase pt-2 cursor-pointer w-fit"
                >
                  <span>INSPECT SPEC</span>
                  <LucideIcon name="ChevronRight" className="w-4 h-4 translate-x-0 group-hover:translate-x-1 duration-200" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded service inspector overlay modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedService(null)}
          />

          <div className={`relative w-full max-w-xl rounded-2xl border p-6 md:p-8 overflow-hidden z-10 ${
            isDarkMode 
              ? "bg-[#0b0f19] border-slate-800 text-white" 
              : "bg-white border-slate-200 text-slate-800"
          } shadow-2xl`}>
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <button 
              onClick={() => setSelectedService(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              aria-label="Close dialog"
            >
              <LucideIcon name="X" className="w-5 h-5" />
            </button>

            {/* Icon Block */}
            <div className="p-3 w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-[#00D4FF] mb-5">
              <LucideIcon name={selectedService.iconName} className="w-6 h-6" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold tracking-tight uppercase mb-3">
              {selectedService.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
              {selectedService.longDescription}
            </p>

            <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-3">// FEATURED TECHNICAL METRICS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {selectedService.features.map((feat, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <LucideIcon name="Check" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-350">{feat}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className={`py-3 text-xs font-bold tracking-widest uppercase rounded-lg border transition-all font-mono cursor-pointer ${
                  isDarkMode ? "bg-slate-950 text-slate-400 border-slate-800 hover:text-white" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                CLOSE SPEC
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  onConsultationClick();
                }}
                className="py-3 text-xs font-bold tracking-widest text-white uppercase bg-blue-600 hover:bg-blue-500 duration-200 rounded-lg font-mono border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                REQUEST SCOPE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
