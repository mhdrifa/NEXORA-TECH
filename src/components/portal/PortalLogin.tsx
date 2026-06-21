import React, { useState } from "react";
import LucideIcon from "../LucideIcon";

interface PortalLoginProps {
  isDarkMode: boolean;
  onLoginSuccess: (token: string, user: any) => void;
  onClose: () => void;
}

export default function PortalLogin({ isDarkMode, onLoginSuccess, onClose }: PortalLoginProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot" | "reset">("login");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleTabChange = (tab: "login" | "register" | "forgot" | "reset") => {
    setActiveTab(tab);
    resetMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      let endpoint = "/api/auth/login";
      let payload: any = {};

      if (activeTab === "login") {
        endpoint = "/api/auth/login";
        payload = { email, password };
      } else if (activeTab === "register") {
        endpoint = "/api/auth/register";
        payload = { email, password, fullName, companyName };
      } else if (activeTab === "forgot") {
        endpoint = "/api/auth/forgot-password";
        payload = { email };
      } else if (activeTab === "reset") {
        endpoint = "/api/auth/reset-password";
        payload = { token: resetToken, newPassword };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred in authorization tunnel.");
      }

      if (activeTab === "login" || activeTab === "register") {
        setSuccess("Session verified. Mounting authorization schemas...");
        setTimeout(() => {
          onLoginSuccess(data.token, data.user);
        }, 1200);
      } else if (activeTab === "forgot") {
        setSuccess(data.message || "Reset request finished. Check SendGrid system simulated console logs!");
      } else if (activeTab === "reset") {
        setSuccess("Corporate credential updated. Transitioning to login...");
        setTimeout(() => {
          setActiveTab("login");
        }, 1500);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to establish tunnel connection.");
    }
  };

  // Preset 1-Click Login Simulators for rapid evaluation
  const triggerPresetLogin = async (presetRole: "super_admin" | "admin" | "employee" | "client") => {
    resetMessages();
    setLoading(true);
    let presetEmail = "solutions@nexora.tech"; // Super Admin
    
    if (presetRole === "admin") presetEmail = "finance@nexora.tech";
    if (presetRole === "employee") presetEmail = "lead_dev@nexora.tech";
    if (presetRole === "client") presetEmail = "acme.corp@gmail.com";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: presetEmail, password: "nexora123" })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error);

      setSuccess(`Holographic credentials authorized for ${presetRole.replace("_", " ").toUpperCase()}. Booting portal...`);
      setTimeout(() => {
        onLoginSuccess(data.token, data.user);
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto rounded-2xl border p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl transition duration-300 ${
      isDarkMode 
        ? "bg-slate-950/80 border-slate-800 text-white shadow-blue-900/10" 
        : "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
    }`}>
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#00D4FF]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] mb-3 animate-pulse">
          <LucideIcon name="ShieldAlert" className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold tracking-tight font-mono text-[#00D4FF] uppercase">
          NEXORA CONNECT GATE
        </h3>
        <p className="text-xs text-slate-500 font-mono mt-1">
          SECURE MULTI-DEVICE IDENTITY CONSOLE
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
          <LucideIcon name="AlertCircle" className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <LucideIcon name="CheckCircle" className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {activeTab === "register" && (
          <>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Human Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                    isDarkMode 
                      ? "bg-slate-900/60 border-slate-800 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]/30" 
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company Entity</label>
              <input
                type="text"
                placeholder="e.g. Acme Enterprises Ltd (Optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                  isDarkMode 
                    ? "bg-slate-900/60 border-slate-800 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]/30" 
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>
          </>
        )}

        {(activeTab === "login" || activeTab === "register" || activeTab === "forgot") && (
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Security Mailbox</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]/30" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
        )}

        {(activeTab === "login" || activeTab === "register") && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Access Secret</label>
              {activeTab === "login" && (
                <button 
                  type="button" 
                  onClick={() => handleTabChange("forgot")}
                  className="text-[10px] font-mono text-[#00D4FF] uppercase hover:underline"
                >
                  Forgot Key?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF]/30" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
        )}

        {activeTab === "reset" && (
          <>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Holographic Reset Token</label>
              <input
                type="text"
                required
                placeholder="reset-xxxx..."
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                  isDarkMode 
                    ? "bg-slate-900/60 border-slate-800 text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">New System Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full text-xs font-mono px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-1 ${
                  isDarkMode 
                    ? "bg-slate-900/60 border-slate-800 text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest text-white transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-center uppercase cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LucideIcon name="Loader2" className="w-4 h-4 animate-spin" />
              <span>SYNCHRONIZING SECURE KEY...</span>
            </>
          ) : (
            <>
              <LucideIcon name="Lock" className="w-4 h-4" />
              <span>
                {activeTab === "login" && "AUTHORIZE SESSION"}
                {activeTab === "register" && "ENROLL IDENTITY NODE"}
                {activeTab === "forgot" && "DISPATCH RESET MAIL"}
                {activeTab === "reset" && "COMMIT NEW SECURE PASSWORD"}
              </span>
            </>
          )}
        </button>

        {/* Tab toggler */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/10 dark:border-slate-800">
          {activeTab === "login" ? (
            <p>
              New node?{" "}
              <button type="button" onClick={() => handleTabChange("register")} className="text-[#00D4FF] hover:underline">
                Register Profile
              </button>
            </p>
          ) : (
            <p>
              Already enrolled?{" "}
              <button type="button" onClick={() => handleTabChange("login")} className="text-[#00D4FF] hover:underline">
                Unlock Session
              </button>
            </p>
          )}
          {activeTab === "forgot" && (
            <button type="button" onClick={() => handleTabChange("reset")} className="text-[#00D4FF] hover:underline">
              Enter Reset Token
            </button>
          )}
        </div>
      </form>

      {/* 1-Click Fast Pass Simulator Panel (For evaluation) */}
      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <p className="text-[9px] font-mono text-[#00D4FF] tracking-wider uppercase mb-3 text-center flex items-center justify-center gap-1.5 font-bold">
          <LucideIcon name="Atom" className="w-3.5 h-3.5 animate-spin" />
          DEVELOPMENT PORTAL BYPASS (1-CLICK TEST)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => triggerPresetLogin("super_admin")}
            className="px-2 py-1.5 rounded bg-blue-900/30 border border-blue-500/20 text-blue-400 text-[10px] font-mono hover:bg-blue-800/45 hover:text-white transition uppercase text-left flex items-center gap-1 cursor-pointer"
          >
            <LucideIcon name="Settings" className="w-3 h-3 shrink-0" />
            <span>Super Admin</span>
          </button>
          <button
            onClick={() => triggerPresetLogin("client")}
            className="px-2 py-1.5 rounded bg-purple-900/30 border border-purple-500/20 text-purple-400 text-[10px] font-mono hover:bg-purple-800/45 hover:text-white transition uppercase text-left flex items-center gap-1 cursor-pointer"
          >
            <LucideIcon name="Briefcase" className="w-3 h-3 shrink-0" />
            <span>Clients Profile</span>
          </button>
          <button
            onClick={() => triggerPresetLogin("employee")}
            className="px-2 py-1.5 rounded bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono hover:bg-emerald-800/45 hover:text-white transition uppercase text-left flex items-center gap-1 cursor-pointer"
          >
            <LucideIcon name="Cpu" className="w-3 h-3 shrink-0" />
            <span>Lead Developer</span>
          </button>
          <button
            onClick={() => triggerPresetLogin("admin")}
            className="px-2 py-1.5 rounded bg-amber-900/30 border border-amber-500/20 text-amber-400 text-[10px] font-mono hover:bg-amber-800/45 hover:text-white transition uppercase text-left flex items-center gap-1 cursor-pointer"
          >
            <LucideIcon name="Coins" className="w-3 h-3 shrink-0" />
            <span>Finance Admin</span>
          </button>
        </div>
        <p className="text-[8px] text-center text-slate-500 font-mono mt-2.5">
          Preset models use seed security configurations (password: `nexora123`)
        </p>
      </div>
    </div>
  );
}
