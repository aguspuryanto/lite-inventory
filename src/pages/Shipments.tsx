import React, { useState } from 'react';
import { useStore } from '../store';
import { Truck } from 'lucide-react';

export default function Shipments() {
  const { salesOrders, shipments, products, shipSalesOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', salesOrderId: '', notes: '' });

  const pendingOrders = salesOrders.filter(so => so.status === 'DRAFT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.salesOrderId) return alert('Pilih pesanan');
    
    // Check stock
    const so = salesOrders.find(s => s.id === formData.salesOrderId);
    if (so) {
      for (const item of so.items) {
        const p = products.find(x => x.id === item.productId);
        if (p && p.stock < item.qty) {
          return alert(`Stok ${p.name} tidak cukup. (Stok: ${p.stock})`);
        }
      }
    }
    
    shipSalesOrder(formData.salesOrderId, formData.date, formData.notes);
    
    setFormData({ date: '', salesOrderId: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Pengeluaran Barang (Pengiriman)</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]"
        >
          <Truck className="w-4 h-4 mr-2" /> Kirim Barang
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Tanggal Kirim</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Pilih Order (SO)</label>
                <select
                  required
                  value={formData.salesOrderId}
                  onChange={(e) => setFormData({ ...formData, salesOrderId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                >
                  <option value="">-- Pilih SO --</option>
                  {pendingOrders.map(so => (
                    <option key={so.id} value={so.id}>{so.date} - {so.customer}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent h-[38px]">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]">
                Kirim & Update Stok
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Kirim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID SO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {shipments.map((sh) => {
              const so = salesOrders.find(p => p.id === sh.salesOrderId);
              return (
                <tr key={sh.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{sh.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {so ? `${so.date} - ${so.customer}` : sh.salesOrderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sh.notes}</td>
                </tr>
              );
            })}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada riwayat pengiriman</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
