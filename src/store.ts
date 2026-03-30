import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN' | 'STAFF';
export type User = { id: string; username: string; passwordHash: string; role: Role };

export type Supplier = { id: string; name: string; contact: string; address: string };

export type RawMaterial = { id: string; name: string; unit: string; stock: number; minStock: number };
export type Product = { id: string; name: string; unit: string; stock: number; minStock: number };

export type PurchaseOrder = { id: string; date: string; supplierId: string; status: 'DRAFT' | 'COMPLETED'; items: { materialId: string; qty: number; price: number }[] };
export type GoodsReceipt = { id: string; date: string; purchaseOrderId: string; notes: string };

export type Production = { 
  id: string; 
  date: string; 
  productId: string; 
  qtyProduced: number; 
  status: 'PLANNED' | 'COMPLETED'; 
  materialsUsed: { materialId: string; qty: number }[];
  batchNumber?: string;
  startTime?: string;
  endTime?: string;
  environment?: {
    temperature: string;
    humidity: string;
  };
};

export type SalesOrder = { id: string; date: string; customer: string; status: 'DRAFT' | 'SHIPPED'; items: { productId: string; qty: number; price: number }[] };
export type Shipment = { id: string; date: string; salesOrderId: string; notes: string };

export type AppNotification = { id: string; message: string; date: string; read: boolean; type: 'LOW_STOCK' | 'SYSTEM' };

type StoreState = {
  users: User[];
  currentUser: User | null;
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
  productions: Production[];
  salesOrders: SalesOrder[];
  shipments: Shipment[];
  notifications: AppNotification[];
  
  // Auth
  login: (username: string, passwordHash: string) => boolean;
  register: (username: string, passwordHash: string, role: Role) => boolean;
  logout: () => void;
  resetPassword: (username: string, newPasswordHash: string) => boolean;

  // Notifications
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  
  // Master Data
  addSupplier: (s: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, s: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  addRawMaterial: (rm: Omit<RawMaterial, 'id' | 'stock'>) => void;
  updateRawMaterial: (id: string, rm: Partial<RawMaterial>) => void;
  deleteRawMaterial: (id: string) => void;
  
  addProduct: (p: Omit<Product, 'id' | 'stock'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Transactions
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  receivePurchaseOrder: (poId: string, date: string, notes: string) => void;
  
  addProduction: (prod: Omit<Production, 'id'>) => void;
  updateProduction: (id: string, prod: Partial<Production>) => void;
  deleteProduction: (id: string) => void;
  completeProduction: (id: string, details: { startTime: string; endTime: string; temperature: string; humidity: string }) => void;
  
  addSalesOrder: (so: Omit<SalesOrder, 'id'>) => void;
  updateSalesOrder: (id: string, so: Partial<SalesOrder>) => void;
  deleteSalesOrder: (id: string) => void;
  shipSalesOrder: (soId: string, date: string, notes: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: [{ id: '1', username: 'admin', passwordHash: 'admin', role: 'ADMIN' }],
      currentUser: null,
      suppliers: [],
      rawMaterials: [],
      products: [],
      purchaseOrders: [],
      goodsReceipts: [],
      productions: [],
      salesOrders: [],
      shipments: [],
      notifications: [],
      
      login: (username, passwordHash) => {
        const user = get().users.find(u => u.username === username && u.passwordHash === passwordHash);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      register: (username, passwordHash, role) => {
        const exists = get().users.find(u => u.username === username);
        if (exists) return false;
        set(state => ({ users: [...state.users, { id: generateId(), username, passwordHash, role }] }));
        return true;
      },
      logout: () => set({ currentUser: null }),
      resetPassword: (username, newPasswordHash) => {
        const exists = get().users.find(u => u.username === username);
        if (!exists) return false;
        set(state => ({
          users: state.users.map(u => u.username === username ? { ...u, passwordHash: newPasswordHash } : u)
        }));
        return true;
      },

      addNotification: (notif) => set(state => ({
        notifications: [{ ...notif, id: generateId(), date: new Date().toISOString(), read: false }, ...state.notifications]
      })),
      markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      addSupplier: (s) => set((state) => ({ suppliers: [...state.suppliers, { ...s, id: generateId() }] })),
      updateSupplier: (id, s) => set((state) => ({ suppliers: state.suppliers.map(r => r.id === id ? { ...r, ...s } : r) })),
      deleteSupplier: (id) => set((state) => ({ suppliers: state.suppliers.filter(r => r.id !== id) })),

      addRawMaterial: (rm) => set((state) => ({ rawMaterials: [...state.rawMaterials, { ...rm, id: generateId(), stock: 0 }] })),
      updateRawMaterial: (id, rm) => set((state) => ({ rawMaterials: state.rawMaterials.map(r => r.id === id ? { ...r, ...rm } : r) })),
      deleteRawMaterial: (id) => set((state) => ({ rawMaterials: state.rawMaterials.filter(r => r.id !== id) })),
      
      addProduct: (p) => set((state) => ({ products: [...state.products, { ...p, id: generateId(), stock: 0 }] })),
      updateProduct: (id, p) => set((state) => ({ products: state.products.map(r => r.id === id ? { ...r, ...p } : r) })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(r => r.id !== id) })),
      
      addPurchaseOrder: (po) => set((state) => ({ purchaseOrders: [...state.purchaseOrders, { ...po, id: generateId() }] })),
      updatePurchaseOrder: (id, po) => set((state) => ({ purchaseOrders: state.purchaseOrders.map(r => r.id === id ? { ...r, ...po } : r) })),
      deletePurchaseOrder: (id) => set((state) => ({ purchaseOrders: state.purchaseOrders.filter(r => r.id !== id) })),
      
      receivePurchaseOrder: (poId, date, notes) => set((state) => {
        const po = state.purchaseOrders.find(p => p.id === poId);
        if (!po || po.status === 'COMPLETED') return state;
        
        const newReceipt: GoodsReceipt = { id: generateId(), date, purchaseOrderId: poId, notes };
        const updatedMaterials = [...state.rawMaterials];
        
        po.items.forEach(item => {
          const rm = updatedMaterials.find(m => m.id === item.materialId);
          if (rm) rm.stock += item.qty;
        });
        
        return {
          purchaseOrders: state.purchaseOrders.map(p => p.id === poId ? { ...p, status: 'COMPLETED' } : p),
          goodsReceipts: [...state.goodsReceipts, newReceipt],
          rawMaterials: updatedMaterials
        };
      }),
      
      addProduction: (prod) => set((state) => ({ 
        productions: [...state.productions, { ...prod, id: generateId(), batchNumber: `BATCH-${Date.now().toString().slice(-6)}` }] 
      })),
      updateProduction: (id, prod) => set((state) => ({ productions: state.productions.map(r => r.id === id ? { ...r, ...prod } : r) })),
      deleteProduction: (id) => set((state) => ({ productions: state.productions.filter(r => r.id !== id) })),
      
      completeProduction: (id, details) => set((state) => {
        const prod = state.productions.find(p => p.id === id);
        if (!prod || prod.status === 'COMPLETED') return state;
        
        const updatedMaterials = [...state.rawMaterials];
        const newNotifications = [...state.notifications];

        prod.materialsUsed.forEach(item => {
          const rm = updatedMaterials.find(m => m.id === item.materialId);
          if (rm) {
            rm.stock -= item.qty;
            if (rm.stock < (rm.minStock || 0)) {
              newNotifications.unshift({
                id: generateId(),
                message: `Stok Bahan Baku "${rm.name}" menipis! (Sisa: ${rm.stock} ${rm.unit})`,
                date: new Date().toISOString(),
                read: false,
                type: 'LOW_STOCK'
              });
            }
          }
        });
        
        const updatedProducts = [...state.products];
        const p = updatedProducts.find(x => x.id === prod.productId);
        if (p) p.stock += prod.qtyProduced;
        
        return {
          productions: state.productions.map(p => p.id === id ? { 
            ...p, 
            status: 'COMPLETED',
            startTime: details.startTime,
            endTime: details.endTime,
            environment: { temperature: details.temperature, humidity: details.humidity }
          } : p),
          rawMaterials: updatedMaterials,
          products: updatedProducts,
          notifications: newNotifications
        };
      }),
      
      addSalesOrder: (so) => set((state) => ({ salesOrders: [...state.salesOrders, { ...so, id: generateId() }] })),
      updateSalesOrder: (id, so) => set((state) => ({ salesOrders: state.salesOrders.map(r => r.id === id ? { ...r, ...so } : r) })),
      deleteSalesOrder: (id) => set((state) => ({ salesOrders: state.salesOrders.filter(r => r.id !== id) })),
      
      shipSalesOrder: (soId, date, notes) => set((state) => {
        const so = state.salesOrders.find(p => p.id === soId);
        if (!so || so.status === 'SHIPPED') return state;
        
        const newShipment: Shipment = { id: generateId(), date, salesOrderId: soId, notes };
        const updatedProducts = [...state.products];
        const newNotifications = [...state.notifications];
        
        so.items.forEach(item => {
          const p = updatedProducts.find(m => m.id === item.productId);
          if (p) {
            p.stock -= item.qty;
            if (p.stock < (p.minStock || 0)) {
              newNotifications.unshift({
                id: generateId(),
                message: `Stok Produk "${p.name}" menipis! (Sisa: ${p.stock} ${p.unit})`,
                date: new Date().toISOString(),
                read: false,
                type: 'LOW_STOCK'
              });
            }
          }
        });
        
        return {
          salesOrders: state.salesOrders.map(p => p.id === soId ? { ...p, status: 'SHIPPED' } : p),
          shipments: [...state.shipments, newShipment],
          products: updatedProducts,
          notifications: newNotifications
        };
      }),
    }),
    {
      name: 'essential-oil-inventory',
    }
  )
);
