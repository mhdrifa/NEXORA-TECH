import React, { useState } from "react";
import LucideIcon from "../../LucideIcon";

interface SettingsViewProps {
  isDarkMode: boolean;
  currentUser: any;
  token: string;
}

export default function SettingsView({ isDarkMode, currentUser, token }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "billing">("profile");

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-black font-sans tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            PLATFORM SETTINGS
          </h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1.5">
            Configure Workspace & Security Preferences
          </p>
        </div>
      </div>

      <div className={`flex border-b overflow-x-auto scrollbar-hide ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "profile" ? "border-blue-500 text-blue-500" : "border-transparent text-slate-500 hover:text-slate-400"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-3 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "security" ? "border-blue-500 text-blue-500" : "border-transparent text-slate-500 hover:text-slate-400"
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-3 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "notifications" ? "border-blue-500 text-blue-500" : "border-transparent text-slate-500 hover:text-slate-400"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-3 text-xs font-mono uppercase tracking-wider font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "billing" ? "border-blue-500 text-blue-500" : "border-transparent text-slate-500 hover:text-slate-400"
          }`}
        >
          Billing & Plans
        </button>
      </div>

      <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"}`}>
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-2xl">
            <h3 className={`font-mono text-sm uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Account Profile</h3>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xl font-bold font-mono text-blue-400 overflow-hidden shrink-0">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.fullName?.substring(0, 2).toUpperCase() || "US"
                )}
              </div>
              <div className="space-y-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase tracking-wider font-bold rounded">
                  Upload Avatar
                </button>
                <p className="text-[10px] text-slate-500 font-mono">Recommended size: 256x256px.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={currentUser?.fullName || ""}
                  className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={currentUser?.email || ""}
                  disabled
                  className={`w-full px-3 py-2 text-sm rounded border opacity-50 cursor-not-allowed ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">System Role</label>
                <input 
                  type="text" 
                  defaultValue={currentUser?.role?.replace("_", " ").toUpperCase() || ""}
                  disabled
                  className={`w-full px-3 py-2 text-sm rounded border opacity-50 cursor-not-allowed font-mono text-blue-500 font-bold ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="px-6 py-2 bg-[#0066FF] hover:bg-blue-500 text-white text-[10px] uppercase tracking-wider font-bold rounded cursor-pointer transition">
                SAVE CHANGES
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            <h3 className={`font-mono text-sm uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Security & Authentication</h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Current Password</label>
                <input 
                  type="password" 
                  className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">New Password</label>
                <input 
                  type="password" 
                  className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Confirm New Password</label>
                <input 
                  type="password" 
                  className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <div className="space-y-1 mt-4">
                 <h4 className="text-sm font-bold text-slate-300">Two-Factor Authentication</h4>
                 <p className="text-[10px] font-mono text-slate-500">Secure your account with 2FA setup.</p>
              </div>
              <button className="px-4 py-1.5 border border-slate-700 hover:border-slate-500 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded cursor-pointer transition">
                ENABLE 2FA
              </button>
            </div>

            <div className="pt-4 flex justify-end gap-3 mt-8">
               <button className="px-6 py-2 bg-[#0066FF] hover:bg-blue-500 text-white text-[10px] uppercase tracking-wider font-bold rounded cursor-pointer transition">
                UPDATE PASSWORD
              </button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
           <div className="space-y-6 w-full max-w-2xl">
             <h3 className={`font-mono text-sm uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Alert Preferences</h3>
              
              <div className="space-y-3">
                 {[
                   { id: "email_alerts", label: "Email Alerts", desc: "Receive direct emails for task/project updates." },
                   { id: "sms_alerts", label: "SMS Notifications", desc: "Priority updates via mobile network." },
                   { id: "weekly_digest", label: "Weekly System Digest", desc: "Summary of activities every Monday 9AM UTC." },
                   { id: "security_alerts", label: "Critical Security Events", desc: "Always enabled to secure your digital footprint.", disabled: true, checked: true }
                 ].map(item => (
                   <label key={item.id} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer ${isDarkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                      <input 
                        type="checkbox" 
                        defaultChecked={item.checked} 
                        disabled={item.disabled}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-bold text-sm tracking-tight">{item.label}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.desc}</div>
                      </div>
                   </label>
                 ))}
              </div>
           </div>
        )}

        {activeTab === "billing" && (
           <div className="space-y-6 w-full max-w-2xl">
             <h3 className={`font-mono text-sm uppercase tracking-widest font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Current Hardware Plan</h3>
             
             <div className="p-6 border border-blue-500/30 bg-blue-500/5 rounded-2xl flex justify-between items-center">
                <div>
                   <h4 className="text-xl font-bold tracking-tight text-blue-400">ENTERPRISE NODE</h4>
                   <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Dedicated Container Resources • $240/mo</p>
                </div>
                <button className="px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] uppercase font-bold rounded transition">
                  UPGRADE PLAN
                </button>
             </div>

             <h4 className="text-sm font-bold font-mono tracking-widest uppercase text-slate-400 mt-8">Recent Payments</h4>
             <div className="divide-y divide-slate-800 border-t border-b border-slate-800 text-xs font-mono text-slate-400">
               {[
                 { id: "INV-899120", total: "$240.00", date: "2026-05-01", status: "PAID" },
                 { id: "INV-788102", total: "$240.00", date: "2026-04-01", status: "PAID" },
               ].map((inv, idx) => (
                 <div key={idx} className="flex justify-between items-center py-3 px-2">
                    <span className="font-bold text-slate-300">{inv.id}</span>
                    <span>{inv.date}</span>
                    <span>{inv.total}</span>
                    <span className="text-emerald-400">{inv.status}</span>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>

    </div>
  );
}
