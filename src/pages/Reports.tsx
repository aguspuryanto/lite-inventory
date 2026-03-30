import { useState } from 'react';
import { useStore } from '../store';
import { FileText, Search } from 'lucide-react';

export default function Reports() {
  const { rawMaterials, products, productions } = useStore();
  const [activeTab, setActiveTab] = useState<'stock' | 'traceability'>('stock');
  const [traceType, setTraceType] = useState<'product' | 'material'>('product');
  const [selectedId, setSelectedId] = useState('');

  const renderStockReport = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-muted border-b border-border">
          <h3 className="text-lg leading-6 font-medium text-foreground">Laporan Stok Bahan Baku</h3>
        </div>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Bahan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stok Saat Ini</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Satuan</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {rawMaterials.map((rm) => (
              <tr key={rm.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{rm.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rm.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{rm.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-muted border-b border-border">
          <h3 className="text-lg leading-6 font-medium text-foreground">Laporan Stok Produk</h3>
        </div>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stok Saat Ini</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Satuan</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{p.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTraceability = () => {
    let results: any[] = [];

    if (selectedId) {
      if (traceType === 'product') {
        // Find productions that made this product
        results = productions.filter(p => p.productId === selectedId && p.status === 'COMPLETED');
      } else {
        // Find productions that used this material
        results = productions.filter(p => p.materialsUsed.some(m => m.materialId === selectedId) && p.status === 'COMPLETED');
      }
    }

    return (
      <div className="bg-card border border-border shadow-sm rounded-lg p-6 space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground">Tipe Penelusuran</label>
            <select
              value={traceType}
              onChange={(e) => {
                setTraceType(e.target.value as 'product' | 'material');
                setSelectedId('');
              }}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            >
              <option value="product">Berdasarkan Produk (Lihat Bahan yang Dipakai)</option>
              <option value="material">Berdasarkan Bahan Baku (Lihat Produk yang Dihasilkan)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground">Pilih Item</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
            >
              <option value="">-- Pilih --</option>
              {traceType === 'product' 
                ? products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                : rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)
              }
            </select>
          </div>
        </div>

        {selectedId && (
          <div className="mt-6 border-t border-border pt-6">
            <h4 className="text-md font-medium text-foreground mb-4">Hasil Penelusuran (Riwayat Produksi)</h4>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((prod, idx) => {
                  const p = products.find(x => x.id === prod.productId);
                  return (
                    <div key={idx} className="bg-muted p-4 rounded-md border border-border">
                      <div className="font-medium text-primary mb-2">
                        Produksi: {prod.date} | Hasil: {prod.qtyProduced} {p?.unit} {p?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Bahan Baku Digunakan:</strong>
                        <ul className="list-disc pl-5 mt-1">
                          {prod.materialsUsed.map((m: any, i: number) => {
                            const rm = rawMaterials.find(x => x.id === m.materialId);
                            return (
                              <li key={i}>{rm?.name}: {m.qty} {rm?.unit}</li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada riwayat produksi ditemukan untuk item ini.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Laporan & Traceability</h1>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-foreground bg-background hover:bg-accent h-[38px]"
        >
          <FileText className="w-4 h-4 mr-2" /> Cetak Laporan
        </button>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stock')}
            className={`${
              activeTab === 'stock'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Laporan Stok
          </button>
          <button
            onClick={() => setActiveTab('traceability')}
            className={`${
              activeTab === 'traceability'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Traceability (Penelusuran)
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'stock' ? renderStockReport() : renderTraceability()}
      </div>
    </div>
  );
}
