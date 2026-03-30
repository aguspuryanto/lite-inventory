import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentId) {
      updateSupplier(currentId, formData);
    } else {
      addSupplier(formData);
    }
    setFormData({ name: '', contact: '', address: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (s: any) => {
    setFormData({ name: s.name, contact: s.contact, address: s.address });
    setCurrentId(s.id);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Supplier</h1>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isEditing ? 'Edit Supplier' : 'Tambah Supplier'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Nama Supplier</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Kontak</label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-muted-foreground">Alamat</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                setFormData({ name: '', contact: '', address: '' });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kontak</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Alamat</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{s.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{s.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(s)} className="text-primary hover:text-primary/80 mr-4">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteSupplier(s.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">Belum ada data supplier</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
