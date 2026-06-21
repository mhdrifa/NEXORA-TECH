import React, { useState, useEffect } from "react";
import PortalLogin from "./PortalLogin";
import PortalDashboard from "./PortalDashboard";
import ClientPortalDashboard from "./ClientPortalDashboard";
import PortalTerminal from "./PortalTerminal";
import LucideIcon from "../LucideIcon";

interface PortalViewProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export default function PortalView({ isDarkMode, onClose }: PortalViewProps) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  
  // Auxiliary views: "portal" dashboard vs "sandbox" interactive REST console
  const [portalMode, setPortalMode] = useState<"interface" | "rest_console">("interface");

  useEffect(() => {
    // Attempt local retrieval of corporate session tokens
    const token = localStorage.getItem("NEXORA_PORTAL_TOKEN");
    const userStr = localStorage.getItem("NEXORA_PORTAL_USER");
    if (token && userStr) {
      try {
        setSessionToken(token);
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem("NEXORA_PORTAL_TOKEN");
        localStorage.removeItem("NEXORA_PORTAL_USER");
      }
    }
  }, []);

  const handleLoginSuccess = (token: string, user: any) => {
    setSessionToken(token);
    setCurrentUser(user);
    localStorage.setItem("NEXORA_PORTAL_TOKEN", token);
    localStorage.setItem("NEXORA_PORTAL_USER", JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
    } catch (e) {
      // Continue client resolution regardless of server latency
    }
    setSessionToken(null);
    setCurrentUser(null);
    localStorage.removeItem("NEXORA_PORTAL_TOKEN");
    localStorage.removeItem("NEXORA_PORTAL_USER");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Controller Segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 font-mono text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest cursor-pointer mb-2.5 transition"
          >
            <LucideIcon name="ArrowLeft" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Public Site</span>
          </button>
          
          <h2 className="text-xl font-black font-sans bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight tracking-tight">
            NEXORA ENTERPRISE GATEWAY
          </h2>
          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
            Governance Console / JWT Verification Handshake Node
          </p>
        </div>

        {sessionToken && (
          <div className="flex bg-slate-900/55 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => setPortalMode("interface")}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition uppercase ${
                portalMode === "interface" 
                  ? "bg-[#00D4FF] text-white font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Control Interface
            </button>
            <button
              onClick={() => setPortalMode("rest_console")}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition uppercase ${
                portalMode === "rest_console" 
                  ? "bg-[#00D4FF] text-white font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              REST API Terminal
            </button>
          </div>
        )}
      </div>

      {/* Main body depending on state */}
      {!sessionToken ? (
        <div className="py-2">
          <PortalLogin 
            isDarkMode={isDarkMode} 
            onLoginSuccess={handleLoginSuccess} 
            onClose={onClose} 
          />
        </div>
      ) : portalMode === "rest_console" ? (
        <div className="animate-in fade-in zoom-in-95 duration-150">
          <PortalTerminal isDarkMode={isDarkMode} token={sessionToken} />
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-150">
          {["super_admin", "admin", "editor"].includes(currentUser?.role) ? (
            <PortalDashboard 
              isDarkMode={isDarkMode} 
              user={currentUser} 
              token={sessionToken} 
              onLogout={handleLogout}
              onTerminalRequest={() => setPortalMode("rest_console")}
            />
          ) : (
            <ClientPortalDashboard 
              isDarkMode={isDarkMode} 
              user={currentUser} 
              token={sessionToken} 
              onLogout={handleLogout}
            />
          )}
        </div>
      )}

    </div>
  );
}
