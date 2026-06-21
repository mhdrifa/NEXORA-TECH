import React, { useState } from "react";
import LucideIcon from "../LucideIcon";

// Import modules
import DashboardView from "./modules/DashboardView";
import ServicesView from "./modules/ServicesView";
import CareersView from "./modules/CareersView";
import BlogView from "./modules/BlogView";
import PortfolioView from "./modules/PortfolioView";
import TestimonialsView from "./modules/TestimonialsView";
import { 
  HomepageView, 
  AboutView, 
  TeamView, 
  ContactView, 
  SEOView, 
  MediaLibraryView, 
  WebsiteSettingsView 
} from "./modules/CMSViews";

interface PortalDashboardProps {
  isDarkMode: boolean;
  user: any;
  token: string;
  onLogout: () => void;
  onTerminalRequest: () => void;
}

type TabMode = 
  "dashboard" | "homepage" | "services" | "about" | "team" | "portfolio" | 
  "testimonials" | "blog" | "careers" | "contact" | "seo" | "media" | "settings";

export default function PortalDashboard({ isDarkMode, user, token, onLogout, onTerminalRequest }: PortalDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper arrays for sidebar mapping
  const menuConfig = [
    { id: "dashboard", label: "Overview", icon: "LayoutDashboard" },
    { id: "homepage", label: "Homepage Manager", icon: "Home" },
    { id: "services", label: "Services Manager", icon: "Layers" },
    { id: "about", label: "About Manager", icon: "Info" },
    { id: "team", label: "Team Manager", icon: "Users" },
    { id: "portfolio", label: "Portfolio Manager", icon: "Briefcase" },
    { id: "testimonials", label: "Testimonial Manager", icon: "Star" },
    { id: "blog", label: "Blog Manager", icon: "Feather" },
    { id: "careers", label: "Careers Manager", icon: "Briefcase" },
    { id: "contact", label: "Contact Manager", icon: "MessageSquare" },
    { id: "seo", label: "SEO Manager", icon: "Search" },
    { id: "media", label: "Media Library", icon: "Image" },
    { id: "settings", label: "Website Settings", icon: "Settings" }
  ];

  const renderActiveModule = () => {
    const props = { token, currentUser: user, isDarkMode };
    switch (activeTab) {
      case "dashboard": return <DashboardView {...props} />;
      case "homepage": return <HomepageView {...props} />;
      case "services": return <ServicesView {...props} />;
      case "about": return <AboutView {...props} />;
      case "team": return <TeamView {...props} />;
      case "portfolio": return <PortfolioView {...props} />;
      case "testimonials": return <TestimonialsView {...props} />;
      case "blog": return <BlogView {...props} />;
      case "careers": return <CareersView {...props} />;
      case "contact": return <ContactView {...props} />;
      case "seo": return <SEOView {...props} />;
      case "media": return <MediaLibraryView {...props} />;
      case "settings": return <WebsiteSettingsView {...props} />;
      default: return null;
    }
  };

  return (
    <div className={`w-full min-h-[85vh] rounded-3xl border backdrop-blur-xl overflow-hidden shadow-2xl transition duration-300 flex flex-col md:flex-row ${
      isDarkMode ? "bg-slate-950/90 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-800 shadow-slate-100/50"
    }`}>
      
      {/* SaaS Sidebar Desktop */}
      <aside className={`w-64 border-r hidden md:flex flex-col shrink-0 ${isDarkMode ? "border-slate-800/60 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"}`}>
        <div className="p-5 border-b border-slate-800/20 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066FF] to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg font-mono">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-tight">NEXORA PLATFORM</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{user.role?.replace("_", " ") || "UNKNOWN"} Node</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide select-none">
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[9px] font-mono text-[#00D4FF] uppercase tracking-widest font-bold">CMS Admin</p>
            {menuConfig.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabMode)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono tracking-tight transition ${
                  activeTab === item.id
                    ? "bg-[#00D4FF]/10 text-[#00D4FF] font-black shadow-inner"
                    : `text-slate-400 ${isDarkMode ? "hover:text-white hover:bg-white/5" : "hover:text-slate-900 hover:bg-black/5"}`
                }`}
              >
                <LucideIcon name={item.icon} className={`w-4 h-4 ${activeTab === item.id ? "opacity-100" : "opacity-60"}`} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/30 shrink-0 flex flex-col gap-2">
           <button
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 font-mono text-[10px] bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition uppercase font-bold"
           >
             <LucideIcon name="LogOut" className="w-3.5 h-3.5" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent h-full relative overflow-y-auto">
        {/* Top Header Mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800/50 bg-slate-950/40">
           <div className="font-bold font-mono text-sm tracking-tight flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-1.5 rounded transition ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"}`}
              >
                 <LucideIcon name="Menu" className="w-4 h-4"/>
              </button>
              <span>NEXORA </span>
           </div>
           
           <div className="flex gap-2">
             <button onClick={onLogout} className="p-2 bg-red-950 text-red-500 rounded">
                <LucideIcon name="LogOut" className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Mobile Sidebar Dropdown */}
        {isSidebarOpen && (
          <div className="md:hidden absolute inset-0 z-40 flex">
             <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto">
                <div className="p-4 flex justify-between items-center border-b border-slate-800">
                   <div className="flex items-center gap-2">
                     <span className="font-bold font-mono text-xs">MENU</span>
                   </div>
                   <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 p-1 bg-slate-900 rounded">
                      <LucideIcon name="X" className="w-4 h-4"/>
                   </button>
                </div>
                <div className="flex-1 py-4 space-y-6">
                  <div className="space-y-1">
                    <p className="px-4 mb-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Workspace</p>
                    {menuConfig.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as TabMode); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center justify-start gap-3 px-4 py-3 text-xs font-mono transition ${
                          activeTab === item.id ? "bg-[#0066FF]/20 text-blue-400 border-l-2 border-blue-500" : "text-slate-400 border-l-2 border-transparent"
                        }`}
                      >
                        <LucideIcon name={item.icon} className="w-4 h-4" /> {item.label}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
             {/* Backdrop */}
             <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 relative z-0">
           {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}
