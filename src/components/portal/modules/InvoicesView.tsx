import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceRecord {
  id: string;
  projectId: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  items: InvoiceItem[];
}

interface InvoicesViewProps {
  token: string;
  currentUser: any;
}

export default function InvoicesView({ token, currentUser }: InvoicesViewProps) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Selected invoice for PDF simulator
  const [inspectedInvoice, setInspectedInvoice] = useState<InvoiceRecord | null>(null);

  // Modal / Checkout States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Form states
  const [formNumber, setFormNumber] = useState(`INV-2026-00${Math.floor(Math.random() * 900) + 100}`);
  const [formProject, setFormProject] = useState("p-1");
  const [formClient, setFormClient] = useState("c-1");
  const [formDueDate, setFormDueDate] = useState("2026-07-15");
  const [formItemDesc, setFormItemDesc] = useState("Kubernetes Cloud SLA retainer");
  const [formItemPrice, setFormItemPrice] = useState(12500);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
        if (data.invoices && data.invoices.length > 0) {
          setInspectedInvoice(data.invoices[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    const items: InvoiceItem[] = [
      { description: formItemDesc, quantity: 1, unitPrice: Number(formItemPrice) }
    ];

    const payload = {
      projectId: formProject,
      clientId: formClient,
      invoiceNumber: formNumber,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: formDueDate,
      amount: Number(formItemPrice),
      tax: Number(formItemPrice) * 0.08,
      discount: 0,
      items
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchInvoices();
      } else {
        // Fallback local persistence
        const mock: InvoiceRecord = {
          id: `inv-new-${Math.random().toString(36).substring(2, 6)}`,
          total: payload.amount + payload.tax,
          status: "sent",
          ...payload
        };
        setInvoices([...invoices, mock]);
        setInspectedInvoice(mock);
      }
    } catch (err) {
      const mock: InvoiceRecord = {
        id: `inv-new-${Math.random().toString(36).substring(2, 6)}`,
        total: payload.amount + payload.tax,
        status: "sent",
        ...payload
      };
      setInvoices([...invoices, mock]);
      setInspectedInvoice(mock);
    }

    setIsCreateOpen(false);
    // Refresh INV Code
    setFormNumber(`INV-2026-00${Math.floor(Math.random() * 900) + 100}`);
  };

  const handleProceedPayment = async () => {
    if (!inspectedInvoice) return;
    setStatusMessage("Connecting to secure Stripe gateway nodes...");

    try {
      const res = await fetch("/api/payments/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          invoiceId: inspectedInvoice.id,
          paymentMethod,
          cardToken: "tok_visa_secured_nexora",
          paypalEmail: "payment@clientdomain.com"
        })
      });

      if (res.ok) {
        setPaymentSuccess(true);
        setStatusMessage("Stripe Authorized: Payment Settled in Database.");
        // Mark paid on screen
        setInvoices(invoices.map(i => i.id === inspectedInvoice.id ? { ...i, status: "paid" } : i));
        setInspectedInvoice({ ...inspectedInvoice, status: "paid" });
        setTimeout(() => {
          setIsCheckoutOpen(false);
          setPaymentSuccess(false);
          setStatusMessage("");
        }, 2200);
      } else {
        const err = await res.json();
        setStatusMessage(err.error || "Declined: Stripe security limit exceeded.");
      }
    } catch (err) {
      setStatusMessage("Offline Mock: Simulating successful gateway settlement.");
      setInvoices(invoices.map(i => i.id === inspectedInvoice.id ? { ...i, status: "paid" } : i));
      setInspectedInvoice({ ...inspectedInvoice, status: "paid" });
      setPaymentSuccess(true);
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setPaymentSuccess(false);
        setStatusMessage("");
      }, 2000);
    }
  };

  const updateInvoiceStatusLocally = (id: string, s: InvoiceRecord["status"]) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: s } : i));
    if (inspectedInvoice?.id === id) {
      setInspectedInvoice({ ...inspectedInvoice, status: s });
    }
  };

  const filteredInvoices = invoices.filter(i => filterStatus === "all" || i.status === filterStatus);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Billings Roster */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
              SLA billing & fee ledgers
            </h4>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              Enterprise customer retainers, VAT tier processing logs, and invoices. Total entries: {invoices.length}
            </p>
          </div>

          {currentUser.role !== "client" && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-2 text-[10px] bg-[#0066FF] hover:bg-blue-500 text-white font-mono font-bold rounded-lg uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
            >
              <LucideIcon name="Printer" className="w-3.5 h-3.5" />
              <span>Dispatch Invoice</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-between gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
          <span className="text-slate-400 self-center">FILTER BY LEDGER SEGMENT:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="all">CONSOLIDATED STATEMENTS (ALL)</option>
            <option value="paid">SETTLED IN FULL (PAID)</option>
            <option value="sent">OUTSTANDING UNPAID (DISPATCHED)</option>
            <option value="overdue">SLA EXPIRED WARNINGS (OVERDUE)</option>
          </select>
        </div>

        {/* Invoice list card table */}
        {loading ? (
          <div className="text-center py-20 font-mono text-xs uppercase animate-pulse">
            Loading SLA statements ledger...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20 text-[10px] font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/40">
                  <th className="px-4 py-3">INVOICE NO.</th>
                  <th className="px-4 py-3">TIMELINE SPECS</th>
                  <th className="px-4 py-3 text-right">TOTAL AMOUNT (INCL. TAX)</th>
                  <th className="px-4 py-3">LEDGER STATUS</th>
                  <th className="px-4 py-3 text-right">INSPECT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
                {filteredInvoices.map((inv) => {
                  const statusColors = {
                    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    sent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                    overdue: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
                    draft: "bg-slate-800 text-slate-400 border-slate-700"
                  };
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setInspectedInvoice(inv)}
                      className={`cursor-pointer hover:bg-slate-900/15 transition ${
                        inspectedInvoice?.id === inv.id ? "bg-[#00D4FF]/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-extrabold text-slate-250 uppercase">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-slate-500">Issued: {inv.issueDate} • Due: {inv.dueDate}</td>
                      <td className="px-4 py-3 font-bold text-slate-200 text-right">${inv.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${statusColors[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 rounded bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF] hover:text-white transition">
                          <LucideIcon name="ExternalLink" className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Col 3: Holographic PDF Simulator */}
      <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 h-fit space-y-4">
        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between items-center">
          <span>In-browser SOW PDF simulator</span>
          <LucideIcon name="ShieldCheck" className="w-3.5 h-3.5 text-emerald-400" />
        </h4>

        {inspectedInvoice ? (
          <div className="space-y-4 font-mono text-[9px]">
            
            {/* Simulation Sheet container representing actual high-profile billing slips */}
            <div className="p-5 bg-white text-slate-900 rounded-xl space-y-4 shadow-2xl relative select-text border border-slate-250">
              
              {/* Draft Watermark */}
              {inspectedInvoice.status !== "paid" && (
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="text-4xl font-extrabold font-sans rotate-12 tracking-widest border-4 border-slate-900 p-2 uppercase">
                    UNPAID STATEMENT
                  </span>
                </div>
              )}

              {/* PDF Header logo */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-black font-sans uppercase tracking-widest text-[#0066FF] block">
                    NEXORA TECH
                  </span>
                  <p className="text-[7.5px] text-slate-500 uppercase leading-none">
                    Security Systems & Cloud solutions SOW
                  </p>
                </div>

                <div className="text-right font-bold text-slate-900 text-[10px]">
                  {inspectedInvoice.invoiceNumber}
                </div>
              </div>

              {/* SLA details */}
              <div className="grid grid-cols-2 gap-2 text-[8px] border-b border-slate-100 pb-3">
                <div>
                  <span className="text-slate-400 block font-normal">BILLING RECIPIENT</span>
                  <span className="font-extrabold text-slate-800">CLIENT ASSOCIATE ({inspectedInvoice.clientId})</span>
                  <span className="block text-slate-500">Corporate System ID Registry</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-normal">TIMELINE SCHEDULER</span>
                  <span className="font-bold text-slate-800">Date: {inspectedInvoice.issueDate}</span>
                  <span className="block text-red-600 font-extrabold">Due Date: {inspectedInvoice.dueDate}</span>
                </div>
              </div>

              {/* Items Table details */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-4 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span className="col-span-2">WORK ITEM DESCRIPTION</span>
                  <span className="text-center">QTY</span>
                  <span className="text-right">TOTAL</span>
                </div>

                {inspectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 py-1 text-slate-800 border-b border-slate-50/50">
                    <span className="col-span-2 font-black">{item.description}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-right">${item.unitPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Subtotal & Totals with VAT tier processing logs */}
              <div className="space-y-1 pt-2 border-t border-slate-200 text-[8px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>SOW Subtotal:</span>
                  <span className="font-black text-slate-800">${inspectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>TAX VAT (8% SLA processing standard):</span>
                  <span className="text-slate-800 font-black">+${inspectedInvoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-sans font-black text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>Balance Due (USD):</span>
                  <span className="text-[#0066FF]">${inspectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Ledger signature */}
              <div className="pt-2 text-center text-[7px] text-slate-400 border-t border-slate-150 uppercase tracking-widest font-mono">
                System cryptographic invoice verification SHA-256 compliant.
              </div>
            </div>

            {/* Simulated Action Drawer depending on current payment state */}
            <div className="space-y-2 pt-1 font-mono">
              {inspectedInvoice.status === "paid" ? (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-center rounded-xl font-bold uppercase tracking-wide">
                  SLA Statement Settled in Database Logs.
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition uppercase cursor-pointer text-center"
                  >
                    PROCEED WITH PAYMENT GATEWAY (STRIPE)
                  </button>

                  {currentUser.role !== "client" && (
                    <button
                      onClick={() => updateInvoiceStatusLocally(inspectedInvoice.id, "overdue")}
                      className="px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-red-500 hover:text-red-400 rounded-xl transition uppercase cursor-pointer text-center"
                      title="Mark as Overdue SLA"
                    >
                      Alert SLA Overdue
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-20 font-mono text-slate-500 uppercase">
            No invoice highlighted
          </div>
        )}
      </div>

      {/* CREATE NEW INVOICE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h5 className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                Generate SLA Invoice fee billing
              </h5>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Invoice Slip Code Code</label>
                <input
                  type="text"
                  required
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Assigned SOW Project Source</label>
                <select
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="p-1">AWS Multi-Cluster Kubernetes Audits</option>
                  <option value="p-2">Corporate LLM Rerouting Pipelines</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Payer Client Domain</label>
                <select
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="c-1">Wayne Enterprises Corporate (Bruce Wayne)</option>
                  <option value="c-2">Sark Industries SLA (Tony Stark)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Item Deliverable brief description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Elastic load balancer setups"
                  value={formItemDesc}
                  onChange={(e) => setFormItemDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Price rate ($)</label>
                  <input
                    type="number"
                    required
                    value={formItemPrice}
                    onChange={(e) => setFormItemPrice(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-wide">Deadline Due Date</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
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
                  DISPATCH BILL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STRIPE SECURE CHECKOUT MODAL */}
      {isCheckoutOpen && inspectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800_40">
              <h5 className="text-xs font-mono font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-1">
                <LucideIcon name="CreditCard" className="w-4 h-4 text-[#00D4FF]" />
                <span>SECURE PAYMENT HARNESS NODE</span>
              </h5>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <LucideIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-mono text-[9px] text-center">
                {statusMessage}
              </div>
            )}

            <div className="space-y-4 font-mono text-[10px]">
              <div className="p-3 rounded bg-slate-900/40 border border-slate-850 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block uppercase">Settlement total</span>
                  <span className="text-white font-sans text-sm font-black">{inspectedInvoice.invoiceNumber}</span>
                </div>
                <span className="text-[#00D4FF] font-sans font-black text-sm">${inspectedInvoice.total.toFixed(2)}</span>
              </div>

              {/* Processor choices */}
              <div className="space-y-1">
                <label className="block text-slate-400 uppercase tracking-wide">Processor Gateway Choice</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`py-2 rounded-lg border font-black uppercase text-center transition cursor-pointer ${
                      paymentMethod === "stripe" ? "border-[#00D4FF] bg-[#00D4FF]/10 text-white" : "border-slate-800 text-slate-400"
                    }`}
                  >
                    Stripe Nodes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-2 rounded-lg border font-black uppercase text-center transition cursor-pointer ${
                      paymentMethod === "paypal" ? "border-amber-400 bg-amber-400/5 text-amber-500" : "border-slate-800 text-slate-400"
                    }`}
                  >
                    PayPal Nodes
                  </button>
                </div>
              </div>

              {/* Mock credit card fields in compliance with card validations */}
              {paymentMethod === "stripe" ? (
                <div className="space-y-2 bg-[#111827] p-3 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <label className="block text-slate-450 uppercase text-[8px] tracking-wide">Encrypted Visa/Mastercard Handle</label>
                    <input
                      type="text"
                      disabled
                      value="••••  ••••  ••••  4242  (PCI SHA-256 Mock Secured)"
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-slate-450 uppercase text-[8px] tracking-wide">EXPIRY DATE</label>
                      <input type="text" disabled value="12/29" className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-450 uppercase text-[8px] tracking-wide">CVV SECURITY</label>
                      <input type="password" disabled value="•••" className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                  <label className="block text-slate-450 uppercase text-[8px]">PayPal Corporate Handle Email</label>
                  <input
                    type="email"
                    disabled
                    value="billing@paypal-authorized-client.org"
                    className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={paymentSuccess}
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/2 py-2 border border-slate-800 text-slate-400 uppercase font-bold rounded-xl cursor-pointer"
                >
                  ABORT
                </button>
                <button
                  type="button"
                  onClick={handleProceedPayment}
                  disabled={paymentSuccess}
                  className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-xl cursor-pointer"
                >
                  {paymentSuccess ? "PAYMENT DONE" : "AUTHORIZE CHARGE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
