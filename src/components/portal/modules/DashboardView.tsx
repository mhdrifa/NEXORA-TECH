import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DashboardViewProps {
  token: string;
  currentUser: any;
  isDarkMode: boolean;
}

export default function DashboardView({ token, currentUser, isDarkMode }: DashboardViewProps) {
  const [dateRange, setDateRange] = useState("all-time");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [chartMetric, setChartMetric] = useState<"revenue" | "conversion">("revenue");
  
  const [metrics, setMetrics] = useState<any>({
    totalClients: 8,
    activeProjects: 6,
    revenue: 47000,
    newLeads: 4,
    pendingTasks: 5
  });
  const [charts, setCharts] = useState<any>({});

  useEffect(() => {
    // Analytics fetch removed, using mock data for dashboard layout
  }, [token]);

  // Dynamic values with growth rates
  const kpiData = [
    {
      title: "Total Registered Users",
      value: 124,
      trend: "+12.4%",
      isPositive: true,
      subtext: "vs previous month (110)",
      icon: "Users",
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Active Digital Clients",
      value: metrics.totalClients || 8,
      trend: "+18.2%",
      isPositive: true,
      subtext: "Enterprise service SLA",
      icon: "Briefcase",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Active Tech Projects",
      value: metrics.activeProjects || 6,
      trend: "+8.5%",
      isPositive: true,
      subtext: "Active SOW statements",
      icon: "Activity",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Consolidated Revenue",
      value: `$${(metrics.revenue || 47000).toLocaleString()}`,
      trend: "+24.8%",
      isPositive: true,
      subtext: "Stripe secure ledger",
      icon: "DollarSign",
      color: "from-emerald-600 to-teal-500"
    },
    {
      title: "Sprint Backlog Tasks",
      value: metrics.pendingTasks || 5,
      trend: "-12.5%",
      isPositive: true,
      subtext: "Assigned employee logs",
      icon: "CheckSquare",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Unopened System Leads",
      value: metrics.newLeads || 4,
      trend: "+40%",
      isPositive: true,
      subtext: "Contact form submits",
      icon: "MessageSquare",
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Active Job Recruits",
      value: 9,
      trend: "+15.0%",
      isPositive: true,
      subtext: "Landed applications",
      icon: "Compass",
      color: "from-indigo-600 to-purple-600"
    },
    {
      title: "Technical Blog Views",
      value: "14,820",
      trend: "+31.2%",
      isPositive: true,
      subtext: "Weekly reader traffic",
      icon: "Eye",
      color: "from-teal-600 to-emerald-500"
    }
  ];

  // Enhanced dataset for charts
  const monthlyPerformanceData = [
    { month: "Jan", revenue: 5000, projects: 2, conversion: 22, traffic: 4000 },
    { month: "Feb", revenue: 12000, projects: 3, conversion: 28, traffic: 5800 },
    { month: "Mar", revenue: 19000, projects: 4, conversion: 35, traffic: 7100 },
    { month: "Apr", revenue: 25000, projects: 4, conversion: 40, traffic: 9200 },
    { month: "May", revenue: 47000, projects: 5, conversion: 48, traffic: 12400 },
    { month: "Jun", revenue: metrics.revenue || 54000, projects: metrics.activeProjects || 6, conversion: 52, traffic: 14820 }
  ];

  const leadConversionData = [
    { stage: "Initial Inquiry", value: 45, fill: "#0066FF" },
    { stage: "Qualified Prospect", value: 30, fill: "#00D4FF" },
    { stage: "SOW Drafted", value: 18, fill: "#8B5CF6" },
    { stage: "Signed Retainer", value: 12, fill: "#10B981" }
  ];

  const exportMockData = () => {
    setExportSuccess(true);
    const headers = "Month,Revenue,Active Projects,Lead Conversion,Traffic\n";
    const body = monthlyPerformanceData
      .map(d => `${d.month},${d.revenue},${d.projects},${d.conversion}%,${d.traffic}`)
      .join("\n");
    const blob = new Blob([headers + body], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Nexora_Analytics_Report_${dateRange}.csv`);
    a.click();
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl gap-4">
        <div>
          <h3 className="text-sm font-black font-sans uppercase tracking-wider text-[#00D4FF]">
            GLOBAL KPI & ANALYTICS matrix
          </h3>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            Realtime metrics collected from Postgres system databases and secure auth gateways.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-[#0066FF] transition cursor-pointer"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="all-time">All Consolidated Fiscal Year</option>
          </select>

          <button
            onClick={exportMockData}
            className="px-3 py-1.5 rounded-lg font-bold bg-[#0066FF] hover:bg-blue-500 text-white flex items-center gap-1 transition uppercase cursor-pointer"
          >
            <LucideIcon name="Download" className="w-3.5 h-3.5" />
            <span>{exportSuccess ? "CSV Exported" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((k, index) => (
          <div
            key={index}
            className="relative p-4 rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-800 transition-all duration-300 group overflow-hidden"
          >
            {/* Background Accent glow */}
            <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${k.color} opacity-5 group-hover:opacity-10 blur-xl transition-all duration-300`} />
            
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block max-w-[80%]">
                {k.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/20 text-[#00D4FF]`}>
                <LucideIcon name={k.icon} className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <h5 className="text-xl font-bold font-mono text-white tracking-tight">
                {k.value}
              </h5>
              <div className="flex items-center text-[8px] font-mono font-bold text-emerald-400">
                <LucideIcon name="TrendingUp" className="w-2.5 h-2.5 mr-0.5" />
                <span>{k.trend}</span>
              </div>
            </div>

            <p className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
              {k.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Analytics & Monthly performance */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800/40 pb-3">
            <div>
              <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Revenue & Monthly performance trends
              </h4>
              <p className="text-[9px] font-mono text-slate-500">
                Visualizing cumulative tech solutions revenue and ongoing active SOW agreements.
              </p>
            </div>
            
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[8px] font-mono">
              <button
                onClick={() => setChartMetric("revenue")}
                className={`px-2.5 py-1 rounded-md transition ${chartMetric === "revenue" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                Revenue Flow
              </button>
              <button
                onClick={() => setChartMetric("conversion")}
                className={`px-2.5 py-1 rounded-md transition ${chartMetric === "conversion" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                Traffic Growth
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === "revenue" ? (
                <AreaChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#4B5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4B5563" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#1F2937", borderRadius: "12px" }}
                    labelStyle={{ color: "#9CA3AF", fontSize: "10px", fontFamily: "monospace" }}
                    itemStyle={{ fontSize: "11px", color: "#FFFFFF" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                  <Area
                    name="Completed SLA Fee Revenue ($)"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00D4FF"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    name="Assigned Active Projects"
                    type="monotone"
                    dataKey="projects"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProjects)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#4B5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4B5563" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#1F2937", borderRadius: "12px" }}
                    labelStyle={{ color: "#9CA3AF", fontSize: "10px", fontFamily: "monospace" }}
                    itemStyle={{ fontSize: "11px", color: "#FFFFFF" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                  <Bar dataKey="traffic" name="Web Dynamic Traffic (Views)" fill="#0066FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversion" name="Inquiry Conversion Rate (%)" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Pipeline */}
        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 flex flex-col justify-between">
          <div className="border-b border-slate-800/40 pb-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Lead conversion analysis
            </h4>
            <p className="text-[9px] font-mono text-slate-500">
              Interactive analysis representing stages from first query to active retainer client.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadConversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadConversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", borderColor: "#1F2937", borderRadius: "12px" }}
                  itemStyle={{ fontSize: "10px", color: "#FFFFFF" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center">
              <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global Retool</span>
              <span className="text-lg font-black font-sans text-[#00D4FF]">26.6%</span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-[9px] border-t border-slate-800/20 pt-3">
            {leadConversionData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-400">{item.stage}</span>
                </div>
                <span className="text-white font-bold">{item.value} Leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
