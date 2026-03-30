import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function PurchaseOrders() {
  const { purchaseOrders, rawMaterials, suppliers, addPurchaseOrder, deletePurchaseOrder } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', supplierId: '' });
  const [items, setItems] = useState<{ materialId: string; qty: number; price: number }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Tambahkan minimal 1 item');
    if (!formData.supplierId) return alert('Pilih supplier');
    
    addPurchaseOrder({
      date: formData.date,
      supplierId: formData.supplierId,
      status: 'DRAFT',
      items
    });
    
    setFormData({ date: '', supplierId: '' });
    setItems([]);
    setShowForm(false);
  };

  const addItem = () => {
    if (rawMaterials.length === 0) return alert('Bahan baku kosong. Tambahkan bahan baku dulu.');
    setItems([...items, { materialId: rawMaterials[0].id, qty: 1, price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Pemesanan Bahan Baku</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]"
        >
          <Plus className="w-4 h-4 mr-2" /> Buat Pesanan
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Supplier</label>
                <select
                  required
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-foreground">Item Pesanan</h3>
                <button type="button" onClick={addItem} className="text-sm text-primary hover:text-primary/80">
                  + Tambah Item
                </button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end mb-2">
                  <div className="flex-1">
                    <select
                      value={item.materialId}
                      onChange={(e) => updateItem(index, 'materialId', e.target.value)}
                      className="block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    >
                      {rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.name} ({rm.unit})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                      className="block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      min="0"
                      required
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                      className="block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                      placeholder="Harga Satuan"
                    />
                  </div>
                  <button type="button" onClick={() => removeItem(index)} className="p-2 text-destructive hover:text-destructive/80">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent h-[38px]">
                Batal
              </button>
              <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Item</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {purchaseOrders.map((po) => {
              const supplier = suppliers.find(s => s.id === po.supplierId);
              return (
              <tr key={po.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{po.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{supplier?.name || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${po.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{po.items.length} item</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deletePurchaseOrder(po.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )})}
            {purchaseOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada data pesanan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
