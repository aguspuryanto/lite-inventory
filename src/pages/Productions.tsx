import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

export default function Productions() {
  const { productions, rawMaterials, products, addProduction, deleteProduction, completeProduction } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [completeForm, setCompleteForm] = useState<{ id: string; startTime: string; endTime: string; temperature: string; humidity: string } | null>(null);
  const [formData, setFormData] = useState({ date: '', productId: '', qtyProduced: 1 });
  const [materials, setMaterials] = useState<{ materialId: string; qty: number }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (materials.length === 0) return alert('Tambahkan minimal 1 bahan baku');
    
    // Check stock
    for (const item of materials) {
      const rm = rawMaterials.find(m => m.id === item.materialId);
      if (rm && rm.stock < item.qty) {
        return alert(`Stok ${rm.name} tidak cukup. (Stok: ${rm.stock})`);
      }
    }

    addProduction({
      date: formData.date,
      productId: formData.productId,
      qtyProduced: formData.qtyProduced,
      status: 'PLANNED',
      materialsUsed: materials
    });
    
    setFormData({ date: '', productId: '', qtyProduced: 1 });
    setMaterials([]);
    setShowForm(false);
  };

  const addMaterial = () => {
    if (rawMaterials.length === 0) return alert('Bahan baku kosong.');
    setMaterials([...materials, { materialId: rawMaterials[0].id, qty: 1 }]);
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const newItems = [...materials];
    newItems[index] = { ...newItems[index], [field]: value };
    setMaterials(newItems);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (completeForm) {
      completeProduction(completeForm.id, {
        startTime: completeForm.startTime,
        endTime: completeForm.endTime,
        temperature: completeForm.temperature,
        humidity: completeForm.humidity
      });
      setCompleteForm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Proses Produksi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]"
        >
          <Plus className="w-4 h-4 mr-2" /> Rencana Produksi
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-muted-foreground">Produk Hasil</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Target Qty</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.qtyProduced}
                  onChange={(e) => setFormData({ ...formData, qtyProduced: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-foreground">Bahan Baku Digunakan</h3>
                <button type="button" onClick={addMaterial} className="text-sm text-primary hover:text-primary/80">
                  + Tambah Bahan
                </button>
              </div>
              {materials.map((item, index) => (
                <div key={index} className="flex gap-4 items-end mb-2">
                  <div className="flex-1">
                    <select
                      value={item.materialId}
                      onChange={(e) => updateMaterial(index, 'materialId', e.target.value)}
                      className="block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    >
                      {rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.name} (Stok: {rm.stock} {rm.unit})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      required
                      value={item.qty}
                      onChange={(e) => updateMaterial(index, 'qty', Number(e.target.value))}
                      className="block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                      placeholder="Qty"
                    />
                  </div>
                  <button type="button" onClick={() => removeMaterial(index)} className="p-2 text-destructive hover:text-destructive/80">
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

      {completeForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-foreground mb-4">Selesaikan Produksi</h2>
            <form onSubmit={handleComplete} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Waktu Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={completeForm.startTime}
                    onChange={(e) => setCompleteForm({ ...completeForm, startTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Waktu Selesai</label>
                  <input
                    type="datetime-local"
                    required
                    value={completeForm.endTime}
                    onChange={(e) => setCompleteForm({ ...completeForm, endTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Suhu (°C)</label>
                  <input
                    type="text"
                    required
                    value={completeForm.temperature}
                    onChange={(e) => setCompleteForm({ ...completeForm, temperature: e.target.value })}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    placeholder="Contoh: 80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Kelembaban (%)</label>
                  <input
                    type="text"
                    required
                    value={completeForm.humidity}
                    onChange={(e) => setCompleteForm({ ...completeForm, humidity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                    placeholder="Contoh: 45"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setCompleteForm(null)} className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent h-[38px]">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]">
                  Simpan & Selesaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Detail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {productions.map((prod) => {
              const p = products.find(x => x.id === prod.productId);
              return (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{prod.batchNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{prod.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{p?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{prod.qtyProduced} {p?.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                    {prod.status === 'COMPLETED' ? (
                      <div>
                        <div>Mulai: {new Date(prod.startTime || '').toLocaleString('id-ID')}</div>
                        <div>Selesai: {new Date(prod.endTime || '').toLocaleString('id-ID')}</div>
                        <div>Suhu: {prod.environment?.temperature}°C | Kelembaban: {prod.environment?.humidity}%</div>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {prod.status === 'PLANNED' && (
                      <button 
                        onClick={() => setCompleteForm({ id: prod.id, startTime: '', endTime: '', temperature: '', humidity: '' })} 
                        className="text-primary hover:text-primary/80 mr-4" 
                        title="Selesaikan Produksi"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button onClick={() => deleteProduction(prod.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {productions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada data produksi</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
