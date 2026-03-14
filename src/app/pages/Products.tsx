import { useState, useMemo, useEffect } from "react";
import { InventoryFilters } from "../components/InventoryFilters";
import { ProductTable, Product } from "../components/ProductTable";
import { ProductDialog } from "../components/ProductDialog";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useInventoryStore } from "../store/inventoryStore";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { StockByLocation } from "../components/StockByLocation";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

export function Products() {
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const updateProduct = useInventoryStore((state) => state.updateProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);

  const debouncedSearch = useDebouncedValue(searchQuery, 250);

  // Filtered products
  const filteredProducts = useMemo(() => {
    setIsFiltering(true);
    const next = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "instock" &&
          product.quantity > product.minStock) ||
        (stockFilter === "lowstock" &&
          product.quantity > 0 &&
          product.quantity <= product.minStock) ||
        (stockFilter === "outofstock" && product.quantity === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
    setIsFiltering(false);
    return next;
  }, [products, debouncedSearch, category, stockFilter]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast.success("Product deleted successfully");
  };

  const handleSaveProduct = (
    productData: Omit<Product, "id"> & { id?: string }
  ) => {
    if (productData.id) {
      updateProduct(productData.id, productData);
      toast.success("Product updated successfully");
    } else {
      addProduct(productData);
      toast.success("Product added successfully");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Products</h1>
          <p className="text-gray-500">
            Manage your catalog, stock levels, and locations
          </p>
        </div>
        <Button onClick={handleAddProduct} className="gap-2">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="location">Stock by Location</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <InventoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
          />

          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isLoading={isFiltering}
          />
        </TabsContent>

        <TabsContent value="location">
          <StockByLocation />
        </TabsContent>
      </Tabs>

      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}