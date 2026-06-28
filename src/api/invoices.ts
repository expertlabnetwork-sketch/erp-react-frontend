import client from './client';

export interface InvoiceLine {
  id?: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_rate: number;
  subtotal?: number;
  total_tax?: number;
  total?: number;
}

export interface Invoice {
  id: number;
  number: string;
  type: 'invoice' | 'credit';
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  date: string;
  due_date?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  paid_amount: number;
  currency: string;
  notes?: string;
  contact?: { id: number; last_name: string; first_name: string; company?: string };
  lines?: InvoiceLine[];
  payments?: Array<{ id: number; amount: number; payment_date: string; payment_method: string }>;
}

export interface InvoiceFilters {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export const invoicesApi = {
  list: async (filters: InvoiceFilters = {}) => {
    const { data } = await client.get('/invoices', { params: filters });
    return data;
  },
  get: async (id: number) => {
    const { data } = await client.get(`/invoices/${id}`);
    return data as Invoice;
  },
  addPayment: async (id: number, payload: { amount: number; payment_method: string; payment_date: string; reference?: string }) => {
    const { data } = await client.post(`/invoices/${id}/payments`, payload);
    return data;
  },
};
