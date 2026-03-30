import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RawMaterials() {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', unit: '', minStock: 10 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      updateRawMaterial(currentId, formData);
    } else {
      addRawMaterial(formData);
    }
    setFormData({ name: '', unit: '', minStock: 10 });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (rm: any) => {
    setFormData({ name: rm.name, unit: rm.unit, minStock: rm.minStock || 0 });
    setCurrentId(rm.id);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Bahan Baku</h1>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isEditing ? 'Edit Bahan Baku' : 'Tambah Bahan Baku'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Nama Bahan</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Satuan</label>
            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
              placeholder="kg, liter, pcs"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Ambang Batas (Min Stok)</label>
            <input
              type="number"
              min="0"
              required
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 h-[38px]"
          >
            {isEditing ? 'Update' : <><Plus className="w-4 h-4 mr-2" /> Tambah</>}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({ name: '', unit: '', minStock: 10 });
              }}
              className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-accent h-[38px]"
            >
              Batal
            </button>
          )}
        </form>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Satuan</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {rawMaterials.map((rm) => (
              <tr key={rm.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{rm.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <span className={rm.stock < (rm.minStock || 0) ? 'text-destructive font-bold' : ''}>
                    {rm.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rm.minStock || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rm.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(rm)} className="text-primary hover:text-primary/80 mr-4">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRawMaterial(rm.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rawMaterials.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada data bahan baku</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
