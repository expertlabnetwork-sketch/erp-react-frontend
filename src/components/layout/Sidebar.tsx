import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, FileText, ShoppingCart,
  Receipt, Landmark, Warehouse, Briefcase, FolderOpen,
  BarChart3, Settings, ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const nav = [
  { label: 'Dashboard',    href: '/',            icon: LayoutDashboard },
  { section: 'Commercial' },
  { label: 'CRM',          href: '/crm',          icon: Users },
  { label: 'Produits',     href: '/products',     icon: Package },
  { label: 'Devis',        href: '/quotes',       icon: FileText },
  { label: 'Commandes',    href: '/orders',       icon: ShoppingCart },
  { label: 'Factures',     href: '/invoices',     icon: Receipt },
  { section: 'Finance' },
  { label: 'Comptabilité', href: '/accounting',   icon: Landmark },
  { section: 'Opérations' },
  { label: 'Stock',        href: '/inventory',    icon: Warehouse },
  { section: 'Ressources' },
  { label: 'RH',           href: '/hr',           icon: Briefcase },
  { label: 'GED',          href: '/ged',          icon: FolderOpen },
  { section: 'Analytics' },
  { label: 'BI',           href: '/bi',           icon: BarChart3 },
  { section: 'Admin' },
  { label: 'Paramètres',   href: '/settings',     icon: Settings },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export default function Sidebar({ collapsed, onToggle }: Props) {
  const tenant = useAuthStore((s) => s.tenant);

  return (
    <aside className={`fixed top-14 left-0 bottom-0 bg-[#0D2B5C] flex flex-col transition-all duration-300 z-20 overflow-hidden ${collapsed ? 'w-16' : 'w-60'}`}>
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10">
        {nav.map((item, i) => {
          if ('section' in item) {
            return !collapsed ? (
              <div key={i} className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-4 pt-4 pb-1">{item.section}</div>
            ) : <div key={i} className="border-t border-white/10 my-2 mx-3" />;
          }
          const Icon = item.icon!;
          return (
            <NavLink key={item.href} to={item.href!} end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative
                ${isActive ? 'bg-blue-600 text-white before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:bg-blue-300' : 'text-white/75 hover:bg-white/10 hover:text-white'}`
              }>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-white/10 text-xs text-white/40 truncate">
          {tenant?.name ?? 'ERP SaaS'}
        </div>
      )}

      <button onClick={onToggle} className="absolute -right-3 top-6 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white shadow">
        <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}
