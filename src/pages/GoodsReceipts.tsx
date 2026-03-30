import React, { useState } from 'react';
import { useStore } from '../store';
import { Truck, CheckCircle } from 'lucide-react';

export default function GoodsReceipts() {
  const { purchaseOrders, goodsReceipts, suppliers, receivePurchaseOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', purchaseOrderId: '', notes: '' });

  const pendingOrders = purchaseOrders.filter(po => po.status === 'DRAFT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.purchaseOrderId) return alert('Pilih pesanan');
    
    receivePurchaseOrder(formData.purchaseOrderId, formData.date, formData.notes);
    
    setFormData({ date: '', purchaseOrderId: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Pemasukan Barang ke Gudang</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]"
        >
          <Truck className="w-4 h-4 mr-2" /> Terima Barang
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Tanggal Terima</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Pilih Pesanan (PO)</label>
                <select
                  required
                  value={formData.purchaseOrderId}
                  onChange={(e) => setFormData({ ...formData, purchaseOrderId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                >
                  <option value="">-- Pilih PO --</option>
                  {pendingOrders.map(po => {
                    const supplier = suppliers.find(s => s.id === po.supplierId);
                    return (
                      <option key={po.id} value={po.id}>{po.date} - {supplier?.name || 'Unknown'}</option>
                    );
                  })}
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
                Simpan & Update Stok
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Terima</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID PO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {goodsReceipts.map((gr) => {
              const po = purchaseOrders.find(p => p.id === gr.purchaseOrderId);
              const supplier = po ? suppliers.find(s => s.id === po.supplierId) : null;
              return (
                <tr key={gr.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{gr.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {po ? `${po.date} - ${supplier?.name || 'Unknown'}` : gr.purchaseOrderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{gr.notes}</td>
                </tr>
              );
            })}
            {goodsReceipts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada riwayat penerimaan barang</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
