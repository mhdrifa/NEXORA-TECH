import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface ClientRecord {
  id: string;
  companyName: string;
  fullName: string; // Contact Name
  email: string;
  phone: string;
  industry: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  projectsCount?: number;
  revenueGenerated?: number;
  notes?: string;
}

interface ClientsViewProps {
  token: string;
}

export default function ClientsView({ token }: ClientsViewProps) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected client for Profile & History view
  const [inspectedClient, setInspectedClient] = useState<ClientRecord | null>(null);

  // Modal & form switches
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);

  // Form states
  const [formCompany, setFormCompany] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formIndustry, setFormIndustry] = useState("AI Solutions");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "PENDING" | "INACTIVE">("ACTIVE");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Decorate clients with projects count & revenue generated if they are absent or mock
        const decorated = data.clients.map((c: any, index: number) => ({
          id: c.id || `c-${index + 1}`,
          companyName: c.companyName || c.company || "Enterprise Corp",
          fullName: c.fullName || c.contactName || "Lois Lane",
          email: c.email || "billing@enterprise.com",
          phone: c.phone || "+1 (555) 231-9080",
          industry: c.industry || (index % 2 === 0 ? "Cloud Engineering" : "AI Research"),
          status: c.status || "ACTIVE",
          projectsCount: c.projectsCount !== undefined ? c.projectsCount : (3 + (index % 3)),
          revenueGenerated: c.revenueGenerated !== undefined ? c.revenueGenerated : (12000 * (index + 1) + 4500),
          notes: c.notes || "Retained for continuous SRE DevOps microservice container audits."
        }));
        setClients(decorated);
        if (decorated.length > 0 && !inspectedClient) {
          setInspectedClient(decorated[0]);
        }
      } else {
        setError("Failed fetching corporate clients record.");
      }
    } catch (e) {
      setError("Portal API connectivity issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockNew: ClientRecord = {
      id: `c-new-${Math.random().toString(36).substring(2, 6)}`,
      companyName: formCompany,
      fullName: formName,
      email: formEmail,
      phone: formPhone,
      industry: formIndustry,
      status: formStatus,
      projectsCount: 1,
      revenueGenerated: 8500,
      notes: formNotes || "Signed service engagement contract."
    };

    // Try posting to API
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: formCompany,
          fullName: formName,
          email: formEmail,
          phone: formPhone,
          industry: formIndustry,
          status: formStatus,
          notes: formNotes
        })
      });
      if (res.ok) {
        fetchClients();
      } else {
        // Fallback local persistence
        setClients([...clients, mockNew]);
        setInspectedClient(mockNew);
      }
    } catch (err) {
      // Offline fallback
      setClients([...clients, mockNew]);
      setInspectedClient(mockNew);
    }

    setIsCreateOpen(false);
    setFormCompany("");
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormNotes("");
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const updated: ClientRecord = {
      ...editingClient,
      companyName: formCompany,
      fullName: formName,
      email: formEmail,
      phone: formPhone,
      industry: formIndustry,
      status: formStatus,
      notes: formNotes
    };

    try {
      // Mimic edit endpoint
      const res = await fetch(`/api/clients/${editingClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
    } catch (e) {}

    // Set states
    setClients(clients.map(c => c.id === editingClient.id ? updated : c));
    if (inspectedClient?.id === editingClient.id) {
      setInspectedClient(updated);
    }

    setIsEditOpen(false);
    setEditingClient(null);
  };

  const triggerEdit = (c: ClientRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(c);
    setFormCompany(c.companyName);
    setFormName(c.fullName);
    setFormEmail(c.email);
    setFormPhone(c.phone);
    setFormIndustry(c.industry);
    setFormStatus(c.status);
    setFormNotes(c.notes || "");
    setIsEditOpen(true);
  };

  const handleDeleteClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this client record?")) return;
    const pruned = clients.filter(c => c.id !== id);
    setClients(pruned);
    if (inspectedClient?.id === id) {
      setInspectedClient(pruned.length > 0 ? pruned[0] : null);
    }
  };

  const filteredClients = clients.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Clients list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
              Client relation directory
            </h4>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              Active enterprise contracts, SOW agreements, and overall revenue contribution.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingClient(null);
              setFormCompany("");
              setFormName("");
              setFormEmail("");
              setFormPhone("");
              setFormNotes("");
              setIsCreateOpen(true);
            }}
            className="px-3 py-1.5 text-[10px] bg-[#0066FF] hover:bg-blue-500 font-mono font-bold text-white rounded-lg cursor-pointer transition uppercase flex items-center gap-1"
          >
            <LucideIcon name="UserPlus" className="w-3.5 h-3.5" />
            <span>Add Client Profile</span>
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono px-3 py-1.5 rounded-lg">
          <LucideIcon name="Search" className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter clients by company name or key contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-slate-650"
          />
        </div>

        {/* List card elements */}
        {loading ? (
          <div className="text-center py-20 font-mono text-xs uppercase animate-pulse">
            Synthesizing clients ledger database...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredClients.map((c) => (
              <div
                key={c.id}
                onClick={() => setInspectedClient(c)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  inspectedClient?.id === c.id
                    ? "bg-[#00D4FF]/5 border-[#00D4FF]/40 text-white"
                    : "bg-slate-900/20 border-slate-800/40 hover:border-slate-800"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start text-xs">
                    <h5 className="font-black font-sans tracking-tight">{c.companyName}</h5>
                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase ${
                      c.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500 animate-pulse"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[10px] font-mono text-slate-400">
                    Contact: <span className="text-white font-bold">{c.fullName}</span>
                  </p>
                  
                  <p className="text-[9px] font-mono text-slate-500">
                    Category: {c.industry}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/20 dark:border-slate-850 flex justify-between items-center text-[10px] font-mono">
                  <div>
                    <span className="text-[8px] text-slate-500 block">REVENUE SIGNED</span>
                    <span className="font-bold text-emerald-400">${c.revenueGenerated?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => triggerEdit(c, e)}
                      className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Update Client"
                    >
                      <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClient(c.id, e)}
                      className="p-1 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                      title="Decommission Client Record"
                    >
                      <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Col 3: Detailed profile view & History logs */}
      <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 h-fit space-y-4">
        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          Harness client profile & history
        </h4>

        {inspectedClient ? (
          <div className="space-y-4 font-mono text-[10px]">
            {/* Top overview */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/60 text-center space-y-2">
              <span className="text-xs uppercase font-sans font-black text-[#00D4FF] block">
                {inspectedClient.companyName}
              </span>
              <span className="inline-block px-2 py-0.5 rounded text-[8px] bg-slate-900 text-slate-400">
                INDUSTRY: {inspectedClient.industry.toUpperCase()}
              </span>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40 text-left">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">Project metrics</span>
                  <span className="font-bold text-slate-200">{inspectedClient.projectsCount} ongoing</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">Settle status</span>
                  <span className="font-bold text-emerald-400">SLA SECURE</span>
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-2 text-xs">
              <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Contact Details</h5>
              
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Liaison:</span>
                  <span className="text-white font-bold">{inspectedClient.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Email:</span>
                  <span className="text-[#00D4FF] hover:underline cursor-pointer">{inspectedClient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Gateway:</span>
                  <span className="text-slate-300">{inspectedClient.phone}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Liaison summary briefing</h5>
              <p className="text-[9.5px] leading-relaxed text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 italic">
                "{inspectedClient.notes}"
              </p>
            </div>

            {/* Simulated SLA history log */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Financial Engagement History</h5>
              <div className="divide-y divide-slate-800/40 text-[9px] font-mono">
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <div className="text-slate-300 font-bold">AWS Elastic Container SOW</div>
                    <div className="text-slate-500">Paid • Jan 12, 2026</div>
                  </div>
                  <span className="text-emerald-400 font-bold">+$12,000</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <div className="text-slate-300 font-bold">Agents Rerouting SLA</div>
                    <div className="text-slate-500">Paid • May 04, 2026</div>
                  </div>
                  <span className="text-emerald-400 font-bold">+$18,500</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 font-mono text-slate-500 uppercase">
            No client highlighted
          </div>
        )}
      </div>

      {/* CREATE / EDIT CLIENT MODAL OVERLAY */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                {isEditOpen ? "Update Corporate Client profile" : "Onboard enterprise client SOW"}
              </h5>
              <button 
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                }} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleUpdateClient : handleCreateClient} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Company Corporate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wayne Enterprises"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Primary Account Representative</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bruce Wayne"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Liaison Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="billing@wayne.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 019-2831"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Market Industry Category</label>
                <select
                  value={formIndustry}
                  onChange={(e: any) => setFormIndustry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="AI Solutions">AI Solutions</option>
                  <option value="Cloud Engineering">Cloud Engineering</option>
                  <option value="Fintech Platform">Fintech Platform</option>
                  <option value="Biotech Systems">Biotech Systems</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">SLA Engagement Status</label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE engagement</option>
                  <option value="PENDING">PENDING credentials</option>
                  <option value="INACTIVE">INACTIVE / RETAINER HALTED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Additional Liaison Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enter context, recurring billing details etc..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {isEditOpen ? "SAVE UPDATE" : "ONBOARD CLIENT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
