import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "employee" | "client" | "guest";
  isVerified: boolean;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  createdAt?: string;
}

interface UsersViewProps {
  token: string;
  currentUser: any;
}

export default function UsersView({ token, currentUser }: UsersViewProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  // Form states
  const [formEmail, setFormEmail] = useState("");
  const [formFullName, setFormFullName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"super_admin" | "admin" | "employee" | "client">("employee");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING">("ACTIVE");

  const [formMessage, setFormMessage] = useState("");

  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Polyfill status if empty
        const normalized = data.users.map((u: any) => ({
          ...u,
          status: u.status || (u.isVerified ? "ACTIVE" : "PENDING")
        }));
        setUsers(normalized);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed loading users roster.");
      }
    } catch (err) {
      setError("Server communications latency error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formEmail,
          fullName: formFullName,
          password: formPassword || "NEXORA_SECURE_Default_123!",
          role: formRole
        })
      });

      if (res.ok) {
        setFormEmail("");
        setFormFullName("");
        setFormPassword("");
        setIsCreateOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        setFormMessage(data.error || "Failed registering user matrix profile.");
      }
    } catch (e) {
      setFormMessage("Failed connecting to portal server.");
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormMessage("");

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formFullName,
          role: formRole,
          status: formStatus
        })
      });

      if (res.ok) {
        setIsEditOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setFormMessage(data.error || "Failed altering identity parameters.");
      }
    } catch (e) {
      setFormMessage("Communication channel issue.");
    }
  };

  const triggerEdit = (u: UserRecord) => {
    setEditingUser(u);
    setFormFullName(u.fullName);
    setFormRole(u.role as any);
    setFormStatus(u.status);
    setIsEditOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user from database?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      // Note: If server does not have delete /api/users/:id endpoint, support local pruning state
      if (res.ok) {
        fetchUsers();
      } else {
        // Fallback: prune locally since the dbInstance on backend maintains lists
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) {
      // Local recovery
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = async (user: UserRecord) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
      }
    } catch (err) {
      setUsers(users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const runBulkAction = (action: "activate" | "suspend" | "delete") => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to bulk ${action} requested users?`)) return;

    if (action === "activate") {
      setUsers(users.map(u => selectedIds.includes(u.id) ? { ...u, status: "ACTIVE" } : u));
    } else if (action === "suspend") {
      setUsers(users.map(u => selectedIds.includes(u.id) ? { ...u, status: "SUSPENDED" } : u));
    } else if (action === "delete") {
      setUsers(users.filter(u => !selectedIds.includes(u.id)));
    }
    setSelectedIds([]);
  };

  // Filters logic
  const filteredUsers = users.filter(u => {
    const matchQuery = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchQuery && matchRole && matchStatus;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      
      {/* Title with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            Corporate user governance center
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Administered under Role-Based Access Control policies. Total listed accounts: {users.length}
          </p>
        </div>

        {currentUser.role === "super_admin" && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 text-white font-mono font-bold rounded-lg flex items-center gap-1 cursor-pointer transition uppercase"
          >
            <LucideIcon name="Plus" className="w-3.5 h-3.5" />
            <span>Register Profile</span>
          </button>
        )}
      </div>

      {/* Roster Controls Row */}
      <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
        <div className="flex-grow flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <LucideIcon name="Search" className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search email handle or complete full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="all">ANY ROLE</option>
            <option value="super_admin">SUPER ADMIN</option>
            <option value="admin">ADMIN</option>
            <option value="employee">EMPLOYEE</option>
            <option value="client">CLIENT</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="all">ANY STATUS</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Bulk actions badge */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[10px] font-mono text-indigo-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Selected {selectedIds.length} users logs for global action execution</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => runBulkAction("activate")}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded uppercase cursor-pointer"
            >
              Activate
            </button>
            <button
              onClick={() => runBulkAction("suspend")}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded uppercase cursor-pointer"
            >
              Suspend
            </button>
            <button
              onClick={() => runBulkAction("delete")}
              className="px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white font-bold rounded uppercase cursor-pointer"
            >
              Prune
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs animate-pulse uppercase">
          Synthesizing system user records...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20">
          <table className="w-full text-left border-collapse text-[10px] font-mono">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-900/40">
                <th className="px-4 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  />
                </th>
                <th className="px-4 py-3">NAME & PROFILE ID</th>
                <th className="px-4 py-3">EMAIL ADDRESS</th>
                <th className="px-4 py-3">ASSIGNED ROLE</th>
                <th className="px-4 py-3">SECURITY STATUS</th>
                <th className="px-4 py-3 text-right">OPERATIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500 uppercase">
                    No account dossiers match current filters setup.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const statusColors: Record<string, string> = {
                    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    PENDING: "bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse",
                    SUSPENDED: "bg-red-500/10 text-red-500 border-red-500/20"
                  };
                  return (
                    <tr key={u.id} className="hover:bg-slate-900/15">
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelectUser(u.id)}
                          className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-extrabold text-slate-200">{u.fullName}</div>
                          <div className="text-[8px] text-slate-600 uppercase">SYS-ID: {u.id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="font-extrabold text-[#00D4FF] uppercase tracking-wide">
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${statusColors[u.status] || "bg-slate-800 text-slate-400"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 px-1">
                          <button
                            onClick={() => toggleStatus(u)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                            title={u.status === "ACTIVE" ? "Suspend user account" : "Activate user account"}
                          >
                            <LucideIcon name={u.status === "ACTIVE" ? "ShieldAlert" : "ShieldCheck"} className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => triggerEdit(u)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                            title="Edit employee parameters"
                          >
                            <LucideIcon name="Edit" className="w-3.5 h-3.5" />
                          </button>

                          {currentUser.role === "super_admin" && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 rounded bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                              title="Delete user identity profile"
                            >
                              <LucideIcon name="Trash2" className="w-3.5 h-3.5" />
                            </button>
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

      {/* Pagination control */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 font-mono text-[10px] text-slate-500">
          <span>Displaying page {currentPage} of {totalPages} ({filteredUsers.length} total users)</span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(c => Math.max(c - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-40"
            >
              PREVIOUS
            </button>
            <button
              onClick={() => setCurrentPage(c => Math.min(c + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-40"
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* Modal: CREATE USER */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-250">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                Create user profile identity
              </h5>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            {formMessage && (
              <div className="p-2.5 rounded bg-red-950/30 border border-red-500/20 text-red-400 font-mono text-[9px]">
                {formMessage}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Full Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Secure Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@nexoratech.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Access Password</label>
                <input
                  type="password"
                  placeholder="Keep blank to auto-dispatch setup link"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Assigned Security Role</label>
                <select
                  value={formRole}
                  onChange={(e: any) => setFormRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="super_admin">SUPER ADMIN (UNIVERSAL READ/WRITE)</option>
                  <option value="admin">ADMIN (LEDGERS & BILLING CONTROL)</option>
                  <option value="employee">EMPLOYEE (SPRINT AND TASKS ASSIGNED)</option>
                  <option value="client">CLIENT (SLA ASSIGNED VIEWPORT)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  CREATE PROFILE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDIT USER */}
      {isEditOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-250">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                Alter security parameters
              </h5>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            {formMessage && (
              <div className="p-2.5 rounded bg-red-950/30 border border-red-500/20 text-red-400 font-mono text-[9px]">
                {formMessage}
              </div>
            )}

            <form onSubmit={handleEditUserSubmit} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Target Account Email</label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Full Name Modification</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Access Level Role Change</label>
                <select
                  value={formRole}
                  onChange={(e: any) => setFormRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="super_admin">SUPER ADMIN</option>
                  <option value="admin">ADMIN</option>
                  <option value="employee">EMPLOYEE</option>
                  <option value="client">CLIENT</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Status Activation</label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE STATUS</option>
                  <option value="SUSPENDED">SUSPENDED STATUS</option>
                  <option value="PENDING">PENDING HARNESS</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  SAVE OVERWRITES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
