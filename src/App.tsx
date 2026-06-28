import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import InvoiceListPage from './pages/invoices/InvoiceListPage';

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index element={<DashboardPage />} />
            <Route path="invoices" element={<InvoiceListPage />} />
            <Route path="crm" element={<div className="text-slate-500 p-8 text-center">Module CRM — en cours de migration</div>} />
            <Route path="products" element={<div className="text-slate-500 p-8 text-center">Produits — en cours de migration</div>} />
            <Route path="quotes" element={<div className="text-slate-500 p-8 text-center">Devis — en cours de migration</div>} />
            <Route path="orders" element={<div className="text-slate-500 p-8 text-center">Commandes — en cours de migration</div>} />
            <Route path="accounting" element={<div className="text-slate-500 p-8 text-center">Comptabilité — en cours de migration</div>} />
            <Route path="inventory" element={<div className="text-slate-500 p-8 text-center">Stock — en cours de migration</div>} />
            <Route path="hr" element={<div className="text-slate-500 p-8 text-center">RH — en cours de migration</div>} />
            <Route path="ged" element={<div className="text-slate-500 p-8 text-center">GED — en cours de migration</div>} />
            <Route path="bi" element={<div className="text-slate-500 p-8 text-center">BI — en cours de migration</div>} />
            <Route path="settings" element={<div className="text-slate-500 p-8 text-center">Paramètres — en cours de migration</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
