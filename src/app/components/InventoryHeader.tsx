import { Package, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface InventoryHeaderProps {
  onAddProduct: () => void;
}

export function InventoryHeader({ onAddProduct }: InventoryHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600">
            <Package className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">CoreInventory</h1>
            <p className="text-sm text-gray-500">Manage your product inventory</p>
          </div>
        </div>
        <Button onClick={onAddProduct} className="gap-2">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
