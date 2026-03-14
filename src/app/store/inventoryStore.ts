import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "../components/ProductTable";

export interface Location {
  id: string;
  name: string;
  address: string;
  type: "warehouse" | "store" | "distribution";
}

export interface StockByLocation {
  productId: string;
  locationId: string;
  quantity: number;
}

export type StockMovementType =
  | "receipt"
  | "delivery"
  | "adjustment"
  | "transfer";

export interface StockLedgerEntry {
  id: string;
  date: string;
  productId: string;
  quantityChange: number;
  type: StockMovementType;
  reference: string;
  locationId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  performedBy?: string;
}

export interface Receipt {
  id: string;
  date: string;
  productId: string;
  locationId: string;
  quantity: number;
  supplier: string;
  reference: string;
  status: "pending" | "received" | "cancelled";
}

export interface DeliveryOrder {
  id: string;
  date: string;
  productId: string;
  locationId: string;
  quantity: number;
  customer: string;
  reference: string;
  status: "pending" | "delivered" | "cancelled";
}

export interface InventoryAdjustmentRecord {
  id: string;
  date: string;
  productId: string;
  locationId: string;
  quantityBefore: number;
  quantityAfter: number;
  reason: string;
  adjustedBy: string;
}

export interface MoveHistoryRecord {
  id: string;
  date: string;
  productId: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  movedBy: string;
  reference: string;
}

interface InventoryState {
  products: Product[];
  locations: Location[];
  stockByLocation: StockByLocation[];
  receipts: Receipt[];
  deliveryOrders: DeliveryOrder[];
  adjustments: InventoryAdjustmentRecord[];
  moveHistory: MoveHistoryRecord[];
  stockLedger: StockLedgerEntry[];

  // Product actions
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Location actions
  addLocation: (location: Omit<Location, "id">) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Stock actions
  /**
   * Adjust stock at a specific location by a delta (can be negative).
   * This keeps per-location quantities and overall product quantity in sync.
   */
  updateStockByLocation: (
    productId: string,
    locationId: string,
    quantityDelta: number
  ) => void;

  // Ledger actions
  addLedgerEntry: (entry: Omit<StockLedgerEntry, "id">) => void;

  // Receipt actions
  addReceipt: (receipt: Omit<Receipt, "id">) => void;
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void;

  // Delivery Order actions
  addDeliveryOrder: (order: Omit<DeliveryOrder, "id">) => void;
  updateDeliveryOrder: (id: string, order: Partial<DeliveryOrder>) => void;

  // Adjustment actions
  addAdjustment: (adjustment: Omit<InventoryAdjustmentRecord, "id">) => void;

  // Move History actions
  addMoveHistory: (move: Omit<MoveHistoryRecord, "id">) => void;
}

// Initial mock data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Keyboard",
    sku: "KB-2024-001",
    category: "electronics",
    quantity: 45,
    minStock: 10,
    price: 79.99,
    supplier: "TechSupply Co.",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    sku: "CH-2024-002",
    category: "furniture",
    quantity: 8,
    minStock: 15,
    price: 299.99,
    supplier: "FurniturePro",
  },
  {
    id: "3",
    name: "Gaming Mouse",
    sku: "MS-2024-003",
    category: "electronics",
    quantity: 120,
    minStock: 20,
    price: 49.99,
    supplier: "TechSupply Co.",
  },
  {
    id: "4",
    name: "Cotton T-Shirt",
    sku: "TS-2024-004",
    category: "clothing",
    quantity: 0,
    minStock: 30,
    price: 19.99,
    supplier: "ApparelHub",
  },
  {
    id: "5",
    name: "Standing Desk",
    sku: "DK-2024-005",
    category: "furniture",
    quantity: 12,
    minStock: 5,
    price: 599.99,
    supplier: "FurniturePro",
  },
  {
    id: "6",
    name: "Yoga Mat",
    sku: "YM-2024-006",
    category: "sports",
    quantity: 65,
    minStock: 25,
    price: 29.99,
    supplier: "SportGear Inc.",
  },
  {
    id: "7",
    name: "Protein Bar (Box of 12)",
    sku: "PB-2024-007",
    category: "food",
    quantity: 5,
    minStock: 20,
    price: 24.99,
    supplier: "HealthFoods Ltd.",
  },
  {
    id: "8",
    name: "Wireless Headphones",
    sku: "HP-2024-008",
    category: "electronics",
    quantity: 88,
    minStock: 15,
    price: 149.99,
    supplier: "TechSupply Co.",
  },
];

const initialLocations: Location[] = [
  {
    id: "1",
    name: "Main Warehouse",
    address: "123 Industrial Blvd, City, ST 12345",
    type: "warehouse",
  },
  {
    id: "2",
    name: "Downtown Store",
    address: "456 Main St, City, ST 12345",
    type: "store",
  },
  {
    id: "3",
    name: "Distribution Center",
    address: "789 Logistics Ave, City, ST 12345",
    type: "distribution",
  },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: initialProducts,
      locations: initialLocations,
      stockByLocation: [],
      receipts: [],
      deliveryOrders: [],
      adjustments: [],
      moveHistory: [],
      stockLedger: [],

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: Date.now().toString() },
          ],
        })),

      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          stockByLocation: state.stockByLocation.filter(
            (s) => s.productId !== id
          ),
          receipts: state.receipts.filter((r) => r.productId !== id),
          deliveryOrders: state.deliveryOrders.filter(
            (o) => o.productId !== id
          ),
          adjustments: state.adjustments.filter(
            (a) => a.productId !== id
          ),
          moveHistory: state.moveHistory.filter(
            (m) => m.productId !== id
          ),
          stockLedger: state.stockLedger.filter(
            (l) => l.productId !== id
          ),
        })),

      addLocation: (location) =>
        set((state) => ({
          locations: [
            ...state.locations,
            { ...location, id: Date.now().toString() },
          ],
        })),

      updateLocation: (id, location) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...location } : l
          ),
        })),

      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
          stockByLocation: state.stockByLocation.filter(
            (s) => s.locationId !== id
          ),
          receipts: state.receipts.filter((r) => r.locationId !== id),
          deliveryOrders: state.deliveryOrders.filter(
            (o) => o.locationId !== id
          ),
          adjustments: state.adjustments.filter(
            (a) => a.locationId !== id
          ),
          moveHistory: state.moveHistory.filter(
            (m) =>
              m.fromLocationId !== id && m.toLocationId !== id
          ),
          stockLedger: state.stockLedger.filter(
            (l) =>
              l.locationId !== id &&
              l.fromLocationId !== id &&
              l.toLocationId !== id
          ),
        })),

      updateStockByLocation: (productId, locationId, quantityDelta) =>
        set((state) => {
          const existing = state.stockByLocation.find(
            (s) => s.productId === productId && s.locationId === locationId
          );

          const nextStockByLocation = existing
            ? state.stockByLocation.map((s) =>
                s.productId === productId && s.locationId === locationId
                  ? {
                      ...s,
                      quantity: Math.max(0, s.quantity + quantityDelta),
                    }
                  : s
              )
            : [
                ...state.stockByLocation,
                {
                  productId,
                  locationId,
                  quantity: Math.max(0, quantityDelta),
                },
              ];

          const product = state.products.find((p) => p.id === productId);
          const nextProducts = product
            ? state.products.map((p) =>
                p.id === productId
                  ? {
                      ...p,
                      quantity: Math.max(0, p.quantity + quantityDelta),
                    }
                  : p
              )
            : state.products;

          return {
            stockByLocation: nextStockByLocation,
            products: nextProducts,
          };
        }),

      addLedgerEntry: (entry) =>
        set((state) => ({
          stockLedger: [
            ...state.stockLedger,
            { ...entry, id: Date.now().toString() },
          ],
        })),

      addReceipt: (receipt) =>
        set((state) => ({
          receipts: [
            ...state.receipts,
            { ...receipt, id: Date.now().toString() },
          ],
        })),

      updateReceipt: (id, receipt) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === id ? { ...r, ...receipt } : r
          ),
        })),

      addDeliveryOrder: (order) =>
        set((state) => ({
          deliveryOrders: [
            ...state.deliveryOrders,
            { ...order, id: Date.now().toString() },
          ],
        })),

      updateDeliveryOrder: (id, order) =>
        set((state) => ({
          deliveryOrders: state.deliveryOrders.map((o) =>
            o.id === id ? { ...o, ...order } : o
          ),
        })),

      addAdjustment: (adjustment) =>
        set((state) => ({
          adjustments: [
            ...state.adjustments,
            { ...adjustment, id: Date.now().toString() },
          ],
        })),

      addMoveHistory: (move) =>
        set((state) => ({
          moveHistory: [
            ...state.moveHistory,
            { ...move, id: Date.now().toString() },
          ],
        })),
    }),
    {
      name: "core-inventory-state",
      storage: createJSONStorage(() => localStorage),
      // By default persist everything; adjust here if needed
    }
  )
);
