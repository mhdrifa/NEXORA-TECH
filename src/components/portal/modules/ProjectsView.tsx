import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface ProjectRecord {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: "Pending" | "Active" | "Review" | "Completed" | "Cancelled";
  startDate: string;
  endDate: string;
  budget: number;
  assignedTeam: string[];
  documents?: string[];
  progressPercentage: number;
}

interface ProjectsViewProps {
  token: string;
  currentUser: any;
}

export default function ProjectsView({ token, currentUser }: ProjectsViewProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ProjectRecord | null>(null);

  // Form parameters
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<ProjectRecord["status"]>("Active");
  const [formBudget, setFormBudget] = useState(15000);
  const [formProgress, setFormProgress] = useState(50);
  const [formTeam, setFormTeam] = useState("Gilfoyle, Richard, Dinesh");
  const [formClient, setFormClient] = useState("c-1");
  const [formDate, setFormDate] = useState("2026-06-30");

  const [simulatedFileUploadMessage, setSimulatedFileUploadMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      clientId: formClient,
      name: formName,
      description: formDesc,
      status: formStatus,
      startDate: new Date().toISOString().split("T")[0],
      endDate: formDate,
      budget: Number(formBudget),
      assignedTeam: formTeam.split(",").map(t => t.trim()),
      progressPercentage: Number(formProgress),
      documents: ["sow_certified.pdf"]
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProjects();
      } else {
        // Local fallback
        const mock: ProjectRecord = {
          id: `p-new-${Math.random().toString(36).substring(2, 6)}`,
          ...payload
        };
        setProjects([...projects, mock]);
      }
    } catch (err) {
      const mock: ProjectRecord = {
        id: `p-new-${Math.random().toString(36).substring(2, 6)}`,
        ...payload
      };
      setProjects([...projects, mock]);
    }

    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;

    const payload = {
      ...editingProj,
      name: formName,
      description: formDesc,
      status: formStatus,
      budget: Number(formBudget),
      progressPercentage: Number(formProgress),
      assignedTeam: formTeam.split(",").map(t => t.trim())
    };

    try {
      const res = await fetch(`/api/projects/${editingProj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchProjects();
      } else {
        setProjects(projects.map(p => p.id === editingProj.id ? payload : p));
      }
    } catch (err) {
      setProjects(projects.map(p => p.id === editingProj.id ? payload : p));
    }

    setIsEditOpen(false);
    setEditingProj(null);
    resetForm();
  };

  const triggerEdit = (p: ProjectRecord) => {
    setEditingProj(p);
    setFormName(p.name);
    setFormDesc(p.description);
    setFormStatus(p.status);
    setFormBudget(p.budget);
    setFormProgress(p.progressPercentage);
    setFormTeam(p.assignedTeam.join(", "));
    setIsEditOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate and archival seal this SOW project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProjects();
      } else {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (e) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = async (projId: string, nextStatus: ProjectRecord["status"]) => {
    try {
      await fetch(`/api/projects/${projId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) {}

    // Instant local feedback
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, status: nextStatus } : p));
  };

  const triggerSimulatedUpload = () => {
    setSimulatedFileUploadMessage("Uploading SOW file parameters...");
    setTimeout(() => {
      setSimulatedFileUploadMessage("Verified Secure: SOW_signed_sha256.pdf mounted successfully.");
      setTimeout(() => setSimulatedFileUploadMessage(""), 3000);
    }, 1500);
  };

  const resetForm = () => {
    setFormName("");
    setFormDesc("");
    setFormBudget(15000);
    setFormProgress(50);
    setFormTeam("Gilfoyle, Richard, Dinesh");
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: { label: string; status: ProjectRecord["status"]; color: string }[] = [
    { label: "Pending", status: "Pending", color: "border-t-blue-500 bg-blue-950/20 text-blue-400" },
    { label: "Active", status: "Active", color: "border-t-purple-500 bg-purple-950/20 text-purple-400" },
    { label: "In Review", status: "Review", color: "border-t-amber-500 bg-amber-950/20 text-amber-400" },
    { label: "Settled", status: "Completed", color: "border-t-emerald-500 bg-emerald-950/20 text-emerald-400" },
    { label: "Cancelled", status: "Cancelled", color: "border-t-red-500 bg-red-950/20 text-red-500" }
  ];

  return (
    <div className="space-y-4">
      {/* Title + Switch layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            Statement of work & enterprise projects
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Manage corporate projects, upload contracts, assign DevOps staff, and transition statuses.
          </p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
              viewMode === "kanban" ? "bg-[#00D4FF] text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <LucideIcon name="Kanban" className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
              viewMode === "table" ? "bg-[#00D4FF] text-white font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <LucideIcon name="Table" className="w-3.5 h-3.5" />
            <span>Classic Roster</span>
          </button>
        </div>
      </div>

      {/* Control row */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
        <div className="flex-grow flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <LucideIcon name="Search" className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search SOW title or SOW milestones context description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-slate-650"
          />
        </div>

        <div className="flex gap-2">
          {viewMode === "table" && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
            >
              <option value="all">ANY PROJECT STATUS</option>
              <option value="Pending">PENDING Approval</option>
              <option value="Active">ACTIVE SOW</option>
              <option value="Review">REVIEW Milestone</option>
              <option value="Completed">COMPLETED Contract</option>
              <option value="Cancelled">CANCELLED Profile</option>
            </select>
          )}

          {currentUser.role !== "client" && (
            <button
              onClick={() => {
                setEditingProj(null);
                setIsCreateOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#0066FF] hover:bg-blue-500 text-white font-bold rounded-lg transition uppercase flex items-center gap-1"
            >
              <LucideIcon name="Plus" className="w-3.5 h-3.5" />
              <span>Draft SOW Contract</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-slate-500 uppercase animate-pulse text-xs">
          Verifying secure statements of work repositories...
        </div>
      ) : viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in duration-300">
          {columns.map((col) => {
            const colProjects = filteredProjects.filter(p => p.status === col.status);
            return (
              <div key={col.status} className="flex flex-col space-y-3">
                {/* Column header */}
                <div className={`p-2 rounded-lg border-t-2 font-mono text-[9px] uppercase font-black flex justify-between items-center ${col.color}`}>
                  <span>{col.label} Matrix</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 font-bold">{colProjects.length}</span>
                </div>

                {/* Column list draggable cards */}
                <div className="flex-grow rounded-xl bg-slate-900/10 dark:bg-slate-950/20 p-2 min-h-[350px] space-y-3 border border-dashed border-slate-800/20">
                  {colProjects.length === 0 ? (
                    <div className="text-center py-12 text-[8px] font-mono text-slate-600 uppercase">
                      No active files
                    </div>
                  ) : (
                    colProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition-all duration-200 space-y-3 cursor-grab hover:scale-[1.01]"
                      >
                        <div className="space-y-1">
                          <h6 className="text-[11px] font-sans font-black text-slate-200 tracking-tight leading-tight">
                            {p.name}
                          </h6>
                          <p className="text-[9px] font-mono text-slate-400 leading-relaxed max-h-12 overflow-hidden text-overflow-ellipsis">
                            {p.description}
                          </p>
                        </div>

                        {/* Budget progress indicators */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[8px] font-mono">
                            <span className="text-slate-500 font-bold">BUDGET: ${p.budget.toLocaleString()}</span>
                            <span className="text-[#00D4FF]">{p.progressPercentage}%</span>
                          </div>
                          <div className="w-full h-1 rounded bg-slate-800 overflow-hidden">
                            <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${p.progressPercentage}%` }} />
                          </div>
                        </div>

                        {/* Footer cards controls */}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/40 text-[8px] font-mono">
                          <span className="text-slate-600 truncate max-w-[60%]">
                            Staff: {p.assignedTeam.slice(0, 2).join(", ")}
                          </span>

                          <div className="flex gap-1 shrink-0">
                            {currentUser.role !== "client" && (
                              <>
                                <button
                                  onClick={() => triggerEdit(p)}
                                  className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                                  title="Edit Project"
                                >
                                  <LucideIcon name="Edit" className="w-3 h-3" />
                                </button>
                                
                                <select
                                  value={p.status}
                                  onChange={(e: any) => handleStatusChange(p.id, e.target.value)}
                                  className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-bold uppercase cursor-pointer"
                                  style={{ fontSize: "7px" }}
                                >
                                  <option value="Pending">Approval</option>
                                  <option value="Active">Active SOW</option>
                                  <option value="Review">Review</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancel</option>
                                </select>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20 text-[10px] font-mono animate-in fade-in duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-900/40">
                <th className="px-4 py-3">PROJECTS STATEMENT TITLE</th>
                <th className="px-4 py-3">BUDGET ALLOC.</th>
                <th className="px-4 py-3">TIMELINE SPECS</th>
                <th className="px-4 py-3">STAFF POOL</th>
                <th className="px-4 py-3">INTEGRITY PROGRESS</th>
                <th className="px-4 py-3">SLA STATUS</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500 uppercase">
                    No active statement files recorded matching filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const statusColors: Record<ProjectRecord["status"], string> = {
                    Pending: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    Active: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                    Review: "bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse",
                    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
                  };
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/15">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-extrabold text-slate-200">{p.name}</div>
                          <div className="text-[8px] text-slate-500 uppercase max-w-xs truncate">{p.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-300">${p.budget.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500">{p.startDate} to {p.endDate}</td>
                      <td className="px-4 py-3 text-slate-400">{p.assignedTeam.join(", ")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded bg-slate-850 overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${p.progressPercentage}%` }} />
                          </div>
                          <span>{p.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${statusColors[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {currentUser.role !== "client" && (
                            <>
                              <button
                                onClick={() => triggerEdit(p)}
                                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                                title="Edit SOW parameters"
                              >
                                <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white"
                                title="Decommission SOW completely"
                              >
                                <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DRAFT SOW CONTRACT FORM MODAL */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                {isEditOpen ? "Update Statement of Work Contract" : "Initialize SOW Contract Draft"}
              </h5>
              <button 
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                  setEditingProj(null);
                  resetForm();
                }} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleEditProject : handleCreateProject} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">SOW Project Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Multi-Cluster Kubernetes Audits"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-650 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Statement of Work brief description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe replication pathways, VM parameters, deployment targets..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Allocated SOW Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Integrity Progress (%)</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Target Deadline</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">SOW Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Pending">Pending Approval</option>
                    <option value="Active">Active SOW Phase</option>
                    <option value="Review">Review / Sandbox inspect</option>
                    <option value="Completed">Completed & Settled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Assign DevOps Specialists (Comma separated list)</label>
                <input
                  type="text"
                  value={formTeam}
                  onChange={(e) => setFormTeam(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              {/* Upload contract files simulator */}
              <div className="p-3.5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-2">
                <div className="text-[9px] text-slate-500 uppercase font-black">
                  Holographic contract archives (PDF, DOCX)
                </div>
                {simulatedFileUploadMessage ? (
                  <span className="text-[8px] text-emerald-400 animate-pulse font-mono block">
                    {simulatedFileUploadMessage}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={triggerSimulatedUpload}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[8px] text-[#00D4FF] font-black rounded uppercase cursor-pointer transition"
                  >
                    SELECT CONTRACT DOSSIER
                  </button>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                    setEditingProj(null);
                    resetForm();
                  }}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {isEditOpen ? "COMMIT REVISIONS" : "LAUNCH SOW"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
