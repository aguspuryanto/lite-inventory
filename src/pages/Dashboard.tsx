import { useStore } from '../store';
import { Package, Droplet, ShoppingCart, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { rawMaterials, products, purchaseOrders, salesOrders } = useStore();

  const stats = [
    { name: 'Total Bahan Baku', value: rawMaterials.length, icon: Package, color: 'bg-blue-500' },
    { name: 'Total Produk', value: products.length, icon: Droplet, color: 'bg-emerald-500' },
    { name: 'Order Pembelian', value: purchaseOrders.length, icon: ShoppingCart, color: 'bg-amber-500' },
    { name: 'Order Penjualan', value: salesOrders.length, icon: Truck, color: 'bg-purple-500' },
  ];

  const stockData = [
    ...rawMaterials.map(rm => ({ name: rm.name, stock: rm.stock, type: 'Bahan Baku' })),
    ...products.map(p => ({ name: p.name, stock: p.stock, type: 'Produk' }))
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-card border border-border overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">{item.name}</dt>
                    <dd className="text-lg font-medium text-foreground">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Grafik Stok</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#10b981" name="Jumlah Stok" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
