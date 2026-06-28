import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, TrendingUp } from 'lucide-react';
import { invoicesApi } from '../../api/invoices';
import { useAuthStore } from '../../store/authStore';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Brouillon',   color: 'bg-slate-100 text-slate-600' },
  sent:      { label: 'Envoyée',     color: 'bg-blue-100 text-blue-700' },
  paid:      { label: 'Payée',       color: 'bg-green-100 text-green-700' },
  partial:   { label: 'Partiel',     color: 'bg-orange-100 text-orange-700' },
  overdue:   { label: 'En retard',   color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Annulée',     color: 'bg-gray-100 text-gray-500' },
};

export default function InvoiceListPage() {
  const tenant = useAuthStore((s) => s.tenant);
  const currency = tenant?.currency ?? 'MAD';
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', { search, status, page }],
    queryFn: () => invoicesApi.list({ search, status, page }),
  });

  const fmt = (n: number) => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(n);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Factures</h1>
          <p className="text-sm text-slate-500">Gestion de la facturation</p>
        </div>
        <Link to="/invoices/new" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Nouvelle facture
        </Link>
      </div>

      {/* KPI */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total facturé', value: fmt(data.total_sum ?? 0), icon: FileText, color: 'text-blue-600' },
            { label: 'Total encaissé', value: fmt(data.paid_sum ?? 0), icon: TrendingUp, color: 'text-green-600' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
              <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value} <span className="text-xs font-normal text-slate-400">{currency}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher..." className="text-sm flex-1 outline-none" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Numéro</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Client</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Échéance</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Total TTC</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Chargement...</td></tr>
            )}
            {!isLoading && data?.data?.map((inv: any) => (
              <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => window.location.href=`/invoices/${inv.id}`}>
                <td className="px-4 py-3 font-mono text-blue-700 font-medium">{inv.number}</td>
                <td className="px-4 py-3 text-slate-700">{inv.contact?.company || `${inv.contact?.last_name} ${inv.contact?.first_name ?? ''}`}</td>
                <td className="px-4 py-3 text-slate-500">{inv.date}</td>
                <td className="px-4 py-3 text-slate-500">{inv.due_date ?? '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-800">{fmt(inv.total)} {currency}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[inv.status]?.color ?? ''}`}>
                    {STATUS_LABELS[inv.status]?.label ?? inv.status}
                  </span>
                </td>
              </tr>
            ))}
            {!isLoading && !data?.data?.length && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Aucune facture</td></tr>
            )}
          </tbody>
        </table>
        {data?.last_page > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
