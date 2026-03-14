import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useInventoryStore } from "../store/inventoryStore";
import { toast } from "sonner";

interface AdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AdjustmentDialog({ open, onClose }: AdjustmentDialogProps) {
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);
  const stockByLocation = useInventoryStore(
    (state) => state.stockByLocation
  );
  const addAdjustment = useInventoryStore((state) => state.addAdjustment);
  const updateStockByLocation = useInventoryStore(
    (state) => state.updateStockByLocation
  );
  const addLedgerEntry = useInventoryStore(
    (state) => state.addLedgerEntry
  );

  const [formData, setFormData] = useState({
    productId: "",
    locationId: "",
    newQuantity: 0,
    reason: "",
    adjustedBy: "Admin User",
  });

  const selectedProduct = products.find((p) => p.id === formData.productId);
  const locationQuantity =
    stockByLocation.find(
      (s) =>
        s.productId === formData.productId &&
        s.locationId === formData.locationId
    )?.quantity ?? selectedProduct?.quantity ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.locationId) {
      toast.error("Please select a product and location");
      return;
    }

    if (!selectedProduct) return;

    const quantityBefore = locationQuantity;
    const quantityAfter = formData.newQuantity;
    const delta = quantityAfter - quantityBefore;

    addAdjustment({
      productId: formData.productId,
      locationId: formData.locationId,
      quantityBefore,
      quantityAfter,
      reason: formData.reason,
      adjustedBy: formData.adjustedBy,
      date: new Date().toISOString(),
    });

    updateStockByLocation(
      formData.productId,
      formData.locationId,
      delta
    );

    addLedgerEntry({
      date: new Date().toISOString(),
      productId: formData.productId,
      quantityChange: delta,
      type: "adjustment",
      reference: formData.reason || "Adjustment",
      locationId: formData.locationId,
      performedBy: formData.adjustedBy,
    });

    toast.success("Inventory adjusted successfully");
    onClose();
    
    setFormData({
      productId: "",
      locationId: "",
      newQuantity: 0,
      reason: "",
      adjustedBy: "Admin User",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adjust Inventory</DialogTitle>
          <DialogDescription>
            Manually adjust stock levels
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => {
                  const product = products.find((p) => p.id === value);
                  setFormData({ 
                    ...formData, 
                    productId: value,
                    newQuantity: product?.quantity || 0
                  });
                }}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku}) - Current: {product.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && formData.locationId && (
              <div className="rounded-lg border bg-gray-50 p-3">
                <p className="text-sm text-gray-700">
                  Current Quantity:{" "}
                  <span className="font-semibold">
                    {locationQuantity}
                  </span>
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="newQuantity">New Quantity</Label>
              <Input
                id="newQuantity"
                type="number"
                value={formData.newQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, newQuantity: parseInt(e.target.value) || 0 })
                }
                min="0"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Damaged goods, Count correction, etc."
                required
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Adjust Inventory</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
