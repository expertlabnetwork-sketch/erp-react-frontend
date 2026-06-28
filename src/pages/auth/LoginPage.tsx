import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  tenant: z.string().min(1, 'Identifiant requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tenant: import.meta.env.VITE_TENANT_SLUG || '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.token, res.user, res.tenant, data.tenant);
      navigate('/');
    } catch (err: any) {
      if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNREFUSED') {
        toast.error('Serveur inaccessible — démarrez Laravel sur le port 8000');
      } else if (err?.response?.status === 422 || err?.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error('Erreur : ' + (err?.response?.data?.message ?? 'serveur inaccessible'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">ERP</span>
          </div>
          <span className="font-bold text-slate-800 text-lg">ERP SaaS</span>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-1">Connexion</h1>
        <p className="text-sm text-slate-500 mb-6">Entrez vos identifiants</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Identifiant société</label>
            <input {...register('tenant')} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="mon-entreprise" />
            {errors.tenant && <p className="text-red-500 text-xs mt-1">{errors.tenant.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input {...register('email')} type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@exemple.ma" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Mot de passe</label>
            <input {...register('password')} type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
