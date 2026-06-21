import React, { useState } from "react";
import LucideIcon from "../LucideIcon";

interface PortalTerminalProps {
  isDarkMode: boolean;
  token: string | null;
}

export default function PortalTerminal({ isDarkMode, token }: PortalTerminalProps) {
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [endpoint, setEndpoint] = useState("/api/health");
  const [requestBody, setRequestBody] = useState("");
  
  // Console outputs
  const [loading, setLoading] = useState(false);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const presetEndpoints = [
    { label: "Core Health Engine", method: "GET", url: "/api/health", defaultBody: "" },
    { label: "Check Authenticated Session", method: "GET", url: "/api/auth/session", defaultBody: "" },
    { label: "Aggregate Dashboard Analytics", method: "GET", url: "/api/analytics", defaultBody: "" },
    { label: "List System User Matrices", method: "GET", url: "/api/users", defaultBody: "" },
    { label: "List Active Projects Ledger", method: "GET", url: "/api/projects", defaultBody: "" },
    { label: "Create Project SOW", method: "POST", url: "/api/projects", defaultBody: JSON.stringify({ clientId: "c-1", name: "Dynamic API Expansion Node", description: "Inject secure Express endpoint schemas.", status: "Active", startDate: "2026-06-21", budget: 18000 }, null, 2) },
    { label: "List Invoices", method: "GET", url: "/api/invoices", defaultBody: "" },
    { label: "List Inward Payments", method: "GET", url: "/api/payments/history", defaultBody: "" },
    { label: "List Contact Messages", method: "GET", url: "/api/messages", defaultBody: "" },
    { label: "Submit Contact Form API", method: "POST", url: "/api/messages", defaultBody: JSON.stringify({ name: "Alan Turing", email: "alan@betchley.gov", message: "Do you specialize in Decoupled JWT setups?", inquiryType: "custom-software" }, null, 2) },
    { label: "List Sprinter Backlog Tasks", method: "GET", url: "/api/tasks", defaultBody: "" },
    { label: "Read Centralized Audit Logs", method: "GET", url: "/api/audit-logs", defaultBody: "" },
    { label: "Database Core SQL Logs", method: "GET", url: "/api/database/query-logs", defaultBody: "" }
  ];

  const handleApplyPreset = (preset: typeof presetEndpoints[0]) => {
    setMethod(preset.method as any);
    setEndpoint(preset.url);
    setRequestBody(preset.defaultBody);
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    setHttpStatus(null);
    setStatusText("");
    setHeaders({});
    setResponsePayload(null);
    setLatency(null);

    const startTime = Date.now();
    try {
      const headersInit: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) {
        headersInit["Authorization"] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers: headersInit
      };

      if (method !== "GET" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(endpoint, { ...options });
      const duration = Date.now() - startTime;
      
      setHttpStatus(res.status);
      setStatusText(res.statusText);
      setLatency(duration);

      // Extract headers
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });
      setHeaders(resHeaders);

      // Attempt parsing JSON
      let payload;
      try {
        payload = await res.json();
      } catch (err) {
        payload = { text: "No JSON response" };
      }
      setResponsePayload(payload);
    } catch (err: any) {
      setHttpStatus(0);
      setStatusText("Network Timeout / Broken Tunnel");
      setResponsePayload({ 
        error: "Route execution aborted.", 
        message: err.message || "Express server was not reachable." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration column */}
      <div className="lg:col-span-5 space-y-4">
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <h4 className="text-xs font-mono font-bold tracking-wider text-[#00D4FF] uppercase mb-4 flex items-center gap-2">
            <LucideIcon name="Settings" className="w-4 h-4 text-blue-400" />
            Config API Request
          </h4>

          {/* Preset templates dropdown */}
          <div className="mb-4">
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Route Presets</label>
            <div className="max-h-56 overflow-y-auto border dark:border-slate-800 rounded-lg divide-y dark:divide-slate-800 text-[10px] font-mono">
              {presetEndpoints.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className={`w-full text-left px-3 py-2 transition-colors flex justify-between items-center cursor-pointer ${
                    endpoint === preset.url && method === preset.method 
                      ? "bg-[#00D4FF]/10 text-[#00D4FF]" 
                      : "hover:bg-slate-800/10 dark:hover:bg-slate-800/40 text-slate-400"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    preset.method === "GET" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {preset.method}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {/* Action Bar */}
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className={`text-[10px] font-mono px-2 py-2 rounded-lg border focus:outline-none ${
                  isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/route"
                className={`flex-grow text-[10px] font-mono px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:border-[#00D4FF]" 
                    : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"
                }`}
              />
            </div>

            {/* Request JWT Status banner */}
            <div className={`p-2.5 rounded-lg border text-[9px] font-mono flex justify-between items-center ${
              token 
                ? "bg-blue-950/20 border-blue-900/30 text-blue-400" 
                : "bg-amber-950/20 border-amber-900/30 text-amber-500"
            }`}>
              <span className="flex items-center gap-1">
                <LucideIcon name="Fingerprint" className="w-3.5 h-3.5 animate-pulse" />
                JWT CREDENTIAL STATE:
              </span>
              <span className="font-bold">
                {token ? "AUTH_BEARER_INJECTED" : "ANONYMOUS_PUBLIC_PROSTURE"}
              </span>
            </div>

            {/* Payload editor if POST/PUT */}
            {method !== "GET" && (
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wilder mb-1">Payload JSON Body</label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{ "param": "value" }'
                  className={`w-full text-[10px] font-mono p-3 rounded-lg border focus:outline-none ${
                    isDarkMode 
                      ? "bg-slate-950 border-slate-800 text-emerald-400 focus:border-[#00D4FF]" 
                      : "bg-white border-slate-200 text-slate-800 focus:border-blue-500"
                  }`}
                />
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleExecuteRequest}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-[10px] font-mono font-bold tracking-widest text-white transition-all bg-gradient-to-r from-blue-600 to-[#00D4FF] hover:from-blue-500 hover:to-cyan-400 uppercase cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LucideIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span>EXECUTING ENDPOINT ROUTINE...</span>
                </>
              ) : (
                <>
                  <LucideIcon name="Play" className="w-4 h-4" />
                  <span>TRANSMIT API PAYLOAD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal View column */}
      <div className="lg:col-span-7 flex flex-col h-full min-h-[400px]">
        <div className="flex-grow flex flex-col rounded-2xl border bg-slate-950 border-slate-800 overflow-hidden font-mono shadow-2xl relative">
          
          {/* Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 font-bold text-slate-200">NEXORA_API_EXPLORER.SH</span>
            </div>
            {latency !== null && (
              <span className="text-indigo-400">
                LATENCY: <span className="font-bold">{latency}ms</span>
              </span>
            )}
          </div>

          {/* Core Code Terminal */}
          <div className="p-5 flex-grow overflow-auto text-[10px] space-y-4 text-slate-300 max-h-[500px]">
            {/* Request display */}
            <div>
              <p className="text-slate-500">// OUTGOING REQUEST INTERCEPTOR</p>
              <p className="text-blue-400 mt-1">
                <span className="text-purple-400">{method}</span> {window.location.origin}{endpoint}
              </p>
              <p className="text-teal-400 text-[9px] mt-0.5">
                Host: <span className="text-slate-400">{window.location.host}</span>
                <br />
                Content-Type: <span className="text-slate-400">application/json</span>
                {token && (
                  <>
                    <br />
                    Authorization: <span className="text-slate-400">Bearer token_hash_0987ax...</span>
                  </>
                )}
              </p>
            </div>

            {/* Loading state or console returns */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <LucideIcon name="Cpu" className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                <p className="text-slate-400 text-xs tracking-wider uppercase animate-pulse">
                  awaiting secure response packets...
                </p>
                <p className="text-[9px] text-slate-600 mt-1">
                  Parsing JWT token & resolving database parameters.
                </p>
              </div>
            ) : httpStatus !== null ? (
              <div className="space-y-4">
                {/* Meta block */}
                <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">// RESPONSE RECEIPTS</span>
                  <span className={`px-2 py-0.5 rounded font-black ${
                    httpStatus >= 200 && httpStatus < 300 
                      ? "bg-emerald-950 text-emerald-400" 
                      : "bg-red-950 text-red-400"
                  }`}>
                    HTTP {httpStatus} {statusText}
                  </span>
                </div>

                {/* Headers block */}
                <div>
                  <p className="text-slate-500 mb-1">// RESPONSE HEADERS</p>
                  <pre className="text-[9px] text-slate-400 border border-slate-900 p-2 rounded bg-slate-950/60 overflow-x-auto max-h-24">
                    {Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join("\n")}
                  </pre>
                </div>

                {/* Body block */}
                <div className="space-y-1">
                  <p className="text-slate-500">// JSON RESPONSE BODY Payload</p>
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-900 overflow-x-auto text-emerald-400 max-h-48">
                    {JSON.stringify(responsePayload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <LucideIcon name="Binary" className="w-10 h-10 mb-3" />
                <p className="text-slate-500 tracking-wider">
                  TERMINAL SYSTEM STANDBY
                </p>
                <p className="text-[9px] mt-1 text-slate-700 uppercase">
                  Select a route preset and click transmit packet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
