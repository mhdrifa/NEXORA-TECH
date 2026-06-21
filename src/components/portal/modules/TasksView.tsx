import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface TaskRecord {
  id: string;
  projectId?: string;
  title: string;
  description: string;
  assignedTo: string; // Employee Name
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
}

interface TasksViewProps {
  token: string;
}

export default function TasksView({ token }: TasksViewProps) {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Create & Edit states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null);

  // Form parameters
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formAssignee, setFormAssignee] = useState("");
  const [formStatus, setFormStatus] = useState<TaskRecord["status"]>("todo");
  const [formPriority, setFormPriority] = useState<TaskRecord["priority"]>("medium");
  const [formDate, setFormDate] = useState("2026-06-30");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formTitle,
      description: formDesc,
      assignedTo: formAssignee,
      status: formStatus,
      priority: formPriority,
      dueDate: formDate
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const mock: TaskRecord = {
          id: `task-new-${Math.random().toString(36).substring(2, 6)}`,
          ...payload
        };
        setTasks([...tasks, mock]);
      }
    } catch (err) {
      const mock: TaskRecord = {
        id: `task-new-${Math.random().toString(36).substring(2, 6)}`,
        ...payload
      };
      setTasks([...tasks, mock]);
    }

    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const payload = {
      ...editingTask,
      title: formTitle,
      description: formDesc,
      assignedTo: formAssignee,
      status: formStatus,
      priority: formPriority,
      dueDate: formDate
    };

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchTasks();
      } else {
        setTasks(tasks.map(t => t.id === editingTask.id ? payload : t));
      }
    } catch (e) {
      setTasks(tasks.map(t => t.id === editingTask.id ? payload : t));
    }

    setIsEditOpen(false);
    setEditingTask(null);
    resetForm();
  };

  const triggerEdit = (t: TaskRecord) => {
    setEditingTask(t);
    setFormTitle(t.title);
    setFormDesc(t.description);
    setFormAssignee(t.assignedTo);
    setFormStatus(t.status);
    setFormPriority(t.priority);
    setFormDate(t.dueDate);
    setIsEditOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agile sprint task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();
      } else {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (e) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = async (taskId: string, nextStatus: TaskRecord["status"]) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) {}

    // Instant local state update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormAssignee("");
    setFormDate("2026-06-30");
  };

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const columns: { label: string; status: TaskRecord["status"]; color: string }[] = [
    { label: "To Do", status: "todo", color: "border-t-slate-500 bg-slate-900/10 text-slate-400" },
    { label: "In Progress", status: "in_progress", color: "border-t-blue-500 bg-blue-950/10 text-blue-400" },
    { label: "In Review", status: "review", color: "border-t-purple-500 bg-purple-950/10 text-purple-400" },
    { label: "Completed", status: "done", color: "border-t-emerald-500 bg-emerald-950/10 text-emerald-400" }
  ];

  const getPriorityStyles = (p: TaskRecord["priority"]) => {
    switch (p) {
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse font-extrabold";
      case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/30 font-bold";
      case "medium": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "low": return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
            Agile task board & backlogs
          </h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Organise, assign, and transition engineering sprint nodes. Active task items: {tasks.length}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsCreateOpen(true);
          }}
          className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 font-mono font-bold text-white rounded-lg transition uppercase flex items-center gap-1 cursor-pointer"
        >
          <LucideIcon name="Plus" className="w-3.5 h-3.5" />
          <span>Allocate Task</span>
        </button>
      </div>

      {/* Control filters row */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
        <div className="flex-grow flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <LucideIcon name="Search" className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks by assignee name or title context..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none placeholder-slate-650"
          />
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="all">ANY PRIORITY LEVEL</option>
            <option value="critical">CRITICAL ALERTS</option>
            <option value="high">HIGH PRIORITY</option>
            <option value="medium">MEDIUM PRIORITY</option>
            <option value="low">LOW SEVERITY</option>
          </select>
        </div>
      </div>

      {/* DRAG-AND-DROP SIMULATED AGILE COLUMNS */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Reaching engineering sprint server...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="flex flex-col space-y-3">
                {/* Column category header */}
                <div className={`p-2 rounded-lg border-t-2 font-mono text-[9px] uppercase font-black flex justify-between items-center ${col.color}`}>
                  <span>{col.label} Backlog</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 font-bold">{colTasks.length}</span>
                </div>

                {/* Column tasks items */}
                <div className="rounded-xl bg-slate-900/10 dark:bg-slate-950/20 p-2 min-h-[350px] space-y-3 border border-slate-900/40">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-16 text-[8px] font-mono text-slate-600 uppercase">
                      Column vacant
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition-all duration-200 space-y-3 cursor-grab hover:scale-[1.01]"
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-1">
                            <h6 className="text-[11px] font-sans font-black text-slate-200 tracking-tight leading-tight">
                              {t.title}
                            </h6>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] border font-black uppercase ${getPriorityStyles(t.priority)}`}>
                              {t.priority}
                            </span>
                          </div>
                          
                          <p className="text-[9px] font-mono text-slate-400 leading-relaxed">
                            {t.description}
                          </p>
                        </div>

                        {/* Assignee & Deadline specs */}
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/40 text-[8px] font-mono">
                          <div>
                            <span className="text-slate-500 block uppercase">Assignee</span>
                            <span className="text-white font-bold">{t.assignedTo}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block uppercase">Deadline</span>
                            <span className="text-slate-300 font-bold">{t.dueDate}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="pt-2 flex justify-end gap-1 border-t border-slate-850">
                          <button
                            onClick={() => triggerEdit(t)}
                            className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                            title="Edit task parameters"
                          >
                            <LucideIcon name="Edit" className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 rounded bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white"
                            title="Delete Task"
                          >
                            <LucideIcon name="Trash2" className="w-3 h-3" />
                          </button>

                          <select
                            value={t.status}
                            onChange={(e: any) => handleStatusChange(t.id, e.target.value)}
                            className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-bold uppercase cursor-pointer"
                            style={{ fontSize: "7px" }}
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TASK FORM MODAL */}
      {(isCreateOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                {isEditOpen ? "Update Backlog Sprint Task" : "Allocate Agile Sprint Task"}
              </h5>
              <button 
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                  setEditingTask(null);
                  resetForm();
                }} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditOpen ? handleEditTask : handleCreateTask} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Agile Task Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrate Auth Token Dispatch Headers"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-650 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Task workflow description</label>
                <textarea
                  rows={2.5}
                  placeholder="Briefly detail milestones, variables, expected logs outputs..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Assignee Specialist Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bertram Gilfoyle"
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Task Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e: any) => setFormPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="low">Low Severity</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High priority</option>
                    <option value="critical">CRITICAL ALERT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Backlog Stage</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Completed (Done)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Target Deadline Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 hover:text-white uppercase font-bold rounded cursor-pointer transition"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#0066FF] hover:bg-blue-500 text-white font-bold uppercase rounded cursor-pointer transition"
                >
                  {isEditOpen ? "COMMIT ADJUSTMENT" : "LAUNCH TASK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
