import React, { useState, useEffect } from "react";
import LucideIcon from "../../LucideIcon";

interface PaymentRecord {
  id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  paymentMethod: string;
  paymentIntentId: string;
  status: string;
  paidAt: string;
}

interface PaymentsViewProps {
  token: string;
}

export default function PaymentsView({ token }: PaymentsViewProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => methodFilter === "all" || p.paymentMethod.toLowerCase() === methodFilter);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-black font-sans uppercase tracking-widest text-[#00D4FF]">
          Financial Transactions & ledger receipts
        </h4>
        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
          Corporate ledger records collected from Stripe & PayPal API webhooks. Verified transaction instances: {payments.length}
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 text-[10px] font-mono">
        <span className="text-slate-400 self-center">GATEWAY CONTROLLER SEGMENTS:</span>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
        >
          <option value="all">ALL PAYMENT PROCESSING HOOKS</option>
          <option value="stripe">STRIPE SECURE GATEWAY (CREDIT CARD)</option>
          <option value="paypal">PAYPAL DIRECT LEDGER GATEWAY</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase animate-pulse text-slate-500">
          Syncing transaction database ledgers...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/40 bg-slate-950/20 text-[10px] font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-900/40">
                <th className="px-4 py-3">TRANSACTION ID</th>
                <th className="px-4 py-3">INVOICE SHEET REF</th>
                <th className="px-4 py-3">PAYER CLIENT ID</th>
                <th className="px-4 py-3 text-right">SETTLED VALUE</th>
                <th className="px-4 py-3">PROCESSING METHOD</th>
                <th className="px-4 py-3">TIMELINE SETTLED</th>
                <th className="px-4 py-3">STATUS FLAG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 dark:divide-slate-900">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500 uppercase">
                    No verified currency transactions recorded in ledger.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/15">
                    <td className="px-4 py-3 font-extrabold text-[#00D4FF] font-mono text-[9px] uppercase">{p.paymentIntentId}</td>
                    <td className="px-4 py-3 text-slate-400">{p.invoiceId || "INV-Liaison"}</td>
                    <td className="px-4 py-3 text-slate-500 uppercase">{p.clientId}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400 text-right">${p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="font-extrabold uppercase text-slate-350">{p.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(p.paidAt).toLocaleTimeString()} - {new Date(p.paidAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
