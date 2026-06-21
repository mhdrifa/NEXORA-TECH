import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

interface FooterProps {
  isDarkMode: boolean;
  onConsultationClick: () => void;
}

export default function Footer({ isDarkMode, onConsultationClick }: FooterProps) {
  const [emailValue, setEmailValue] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmailValue("");
  };

  const footerLinks = {
    company: [
      { label: "About Corporate", href: "#about" },
      { label: "Executive Leadership", href: "#team" },
      { label: "Active Careers", href: "#careers" },
      { label: "Case success stories", href: "#case-studies" },
      { label: "News & Releases", href: "#blog" }
    ],
    services: [
      { label: "Artificial Intelligence", href: "#services" },
      { label: "Cloud Engineering", href: "#services" },
      { label: "Cybersecurity Systems", href: "#services" },
      { label: "Custom Software Dev", href: "#services" },
      { label: "Mobile Touch Apps", href: "#services" }
    ],
    resources: [
      { label: "Technology Stack", href: "#technologies" },
      { label: "Developer Sandbox", href: "#home" },
      { label: "Research Publications", href: "#blog" },
      { label: "API Integrations", href: "#solutions" },
      { label: "Venture Audits", href: "#case-studies" }
    ],
    support: [
      { label: "Help Center Docs", href: "#contact" },
      { label: "System Posture State", href: "#home" },
      { label: "SLA Escalation Queue", href: "#contact" },
      { label: "Enterprise Relias", href: "#about" }
    ],
    legal: [
      { label: "Privacy Core Policy", href: "#" },
      { label: "Terms & Operating rules", href: "#" },
      { label: "Non-Disclosure NDA", href: "#" },
      { label: "SOC2 Compliance Seal", href: "#" }
    ]
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <footer className={`border-t font-sans transition-colors duration-300 ${
      isDarkMode 
        ? "bg-[#030610] border-slate-900 text-slate-400" 
        : "bg-slate-50 border-slate-200 text-slate-600"
    }`}>
      {/* Upper Newsletter Block */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b dark:border-slate-900/60 border-slate-200/60">
        
        {/* Newsletter Pitch */}
        <div className="lg:col-span-5">
          <h3 className={`text-xl md:text-2xl font-bold font-sans tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Subscribe to Tech Insights & Advisories
          </h3>
          <p className="text-sm mt-2 text-slate-400">
            Get early research updates, security notifications, and tactical cloud optimization guides. No tracking, zero spam.
          </p>
        </div>

        {/* Input Box */}
        <div className="lg:col-span-7 w-full">
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-xl lg:ml-auto">
              <input
                type="email"
                required
                placeholder="Secure email (e.g. tech@company.com)"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className={`flex-grow px-4 py-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  isDarkMode 
                    ? "bg-slate-950/80 border-slate-800 text-white placeholder-slate-500" 
                    : "bg-white border-slate-250 text-slate-850 placeholder-slate-400"
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase bg-blue-600 hover:bg-blue-500 rounded-lg duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LucideIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    <span>SUBSCRIBING...</span>
                  </>
                ) : (
                  <>
                    <LucideIcon name="Send" className="w-3.5 h-3.5" />
                    <span>SUBSCRIBE</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2 max-w-xl lg:ml-auto select-none">
              <LucideIcon name="Check" className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-semibold">Subscribed successfully. Welcome to Nexora Intelligence.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Structural Link Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        
        {/* Company Column */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm select-none">
              N
            </div>
            <span className={`font-sans font-black tracking-widest text-[#00D4FF] ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              NEXORA
            </span>
          </a>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            Building premium, high-concurrency software services, secure deep architectures, and automated agent environments.
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <a href="https://www.instagram.com/nexora.tech__?igsh=MWVpcGdoa28wOTY0" target="_blank" rel="noopener noreferrer" aria-label="Nexora Tech Instagram" className={`p-2 rounded-full border transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}>
              <LucideIcon name="Instagram" className="w-4 h-4" />
            </a>
            <a href="#" className={`p-2 rounded-full border transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}>
              <LucideIcon name="Linkedin" className="w-4 h-4" />
            </a>
            <a href="#" className={`p-2 rounded-full border transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}>
              <LucideIcon name="Globe" className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dynamic Loops */}
        {Object.entries(footerLinks).map(([key, links]) => (
          <div key={key}>
            <h4 className={`text-xs font-bold tracking-wider uppercase mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {key}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="hover:text-blue-500 duration-150 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ground Footer copyright block */}
      <div className={`border-t py-6 text-xs transition-colors duration-300 ${isDarkMode ? "bg-[#02040c] border-slate-900 text-slate-500" : "bg-slate-100 border-slate-250 text-slate-500"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nexora Tech Global Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Vulnerability Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
