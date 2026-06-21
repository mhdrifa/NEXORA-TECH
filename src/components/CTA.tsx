import React from "react";
import LucideIcon from "./LucideIcon";

interface CTAProps {
  isDarkMode: boolean;
  onConsultationClick: () => void;
}

export default function CTA({ isDarkMode, onConsultationClick }: CTAProps) {
  return (
    <section 
      className={`py-12 md:py-16 transition-colors duration-300 relative overflow-hidden ${
        isDarkMode 
          ? "bg-[#050816]" 
          : "bg-white"
      }`}
    >
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="p-8 md:p-12 rounded-3xl border relative overflow-hidden text-center bg-gradient-to-br from-slate-950 via-[#0b101c] to-[#040813] border-slate-800 shadow-2xl shadow-sky-500/10">
          
          {/* Internal gradient bubble glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-blue-500/20 rounded-full blur-[80px]" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <span className="text-xs font-bold font-mono tracking-widest text-[#00D4FF] uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              // READY TO BUILD THE FUTURE?
            </span>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
              KICKSTART YOUR DIGITAL TRANSFORMATION SPAN
            </h2>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans max-w-lg mx-auto">
              Empower your corporate platform with certified model operations, autoscaling cloud backbones, and robust defensive threat shields.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-3 justify-center">
              <button
                onClick={onConsultationClick}
                className="px-8 py-3.5 text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 duration-200 rounded-lg shadow-lg shadow-blue-500/10 cursor-pointer flex items-center gap-2 border border-blue-500/30 font-mono"
              >
                <LucideIcon name="Rocket" className="w-4 h-4 text-white" />
                <span>SCHEDULE CONSULTATION</span>
              </button>
              <button
                onClick={() => {
                  const contactSec = document.getElementById("contact");
                  if (contactSec) {
                    window.scrollTo({ top: contactSec.offsetTop - 80, behavior: "smooth" });
                  }
                }}
                className="px-8 py-3.5 text-xs font-bold tracking-widest text-slate-250 uppercase bg-slate-950 border border-slate-800 hover:bg-slate-900 rounded-lg duration-250 flex items-center gap-2 cursor-pointer font-mono"
              >
                <LucideIcon name="Mail" className="w-4 h-4" />
                <span>INQUIRE FREE QUOTE</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
