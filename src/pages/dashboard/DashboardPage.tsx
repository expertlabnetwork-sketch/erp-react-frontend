import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Receipt, Package } from 'lucide-react';
import client from '../../api/client';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { user, tenant } = useAuthStore();
  const currency = tenant?.currency ?? 'MAD';

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => { const { data } = await client.get('/dashboard/stats'); return data; },
  });

  const fmt = (n: number = 0) => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(n);

  const kpis = [
    { label: 'CA du mois',       value: `${fmt(stats?.revenue_month ?? 0)} ${currency}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-700' },
    { label: 'Factures en cours', value: stats?.invoices_pending ?? '—',                icon: Receipt,    color: 'bg-orange-50 text-orange-700' },
    { label: 'Contacts CRM',      value: stats?.contacts_count ?? '—',                 icon: Users,      color: 'bg-green-50 text-green-700' },
    { label: 'Produits actifs',   value: stats?.products_count ?? '—',                 icon: Package,    color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Bonjour, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-slate-500">{tenant?.name} — Tableau de bord</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{k.value}</p>
            <p className="text-xs text-slate-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-700 mb-1">Activité récente</h2>
        <p className="text-sm text-slate-400">Les dernières actions apparaîtront ici.</p>
      </div>
    </div>
  );
}
