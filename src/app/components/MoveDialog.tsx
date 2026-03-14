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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useInventoryStore } from "../store/inventoryStore";
import { toast } from "sonner";

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MoveDialog({ open, onClose }: MoveDialogProps) {
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);
  const stockByLocation = useInventoryStore(
    (state) => state.stockByLocation
  );
  const addMoveHistory = useInventoryStore((state) => state.addMoveHistory);
  const updateStockByLocation = useInventoryStore(
    (state) => state.updateStockByLocation
  );
  const addLedgerEntry = useInventoryStore(
    (state) => state.addLedgerEntry
  );

  const [formData, setFormData] = useState({
    productId: "",
    fromLocationId: "",
    toLocationId: "",
    quantity: 0,
    reference: "",
    movedBy: "Admin User",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.fromLocationId || !formData.toLocationId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.fromLocationId === formData.toLocationId) {
      toast.error("Source and destination locations must be different");
      return;
    }

    const currentFromQuantity =
      stockByLocation.find(
        (s) =>
          s.productId === formData.productId &&
          s.locationId === formData.fromLocationId
      )?.quantity ?? 0;

    if (currentFromQuantity < formData.quantity) {
      toast.error("Insufficient stock at source location");
      return;
    }

    updateStockByLocation(
      formData.productId,
      formData.fromLocationId,
      -formData.quantity
    );
    updateStockByLocation(
      formData.productId,
      formData.toLocationId,
      formData.quantity
    );

    addMoveHistory({
      productId: formData.productId,
      fromLocationId: formData.fromLocationId,
      toLocationId: formData.toLocationId,
      quantity: formData.quantity,
      reference: formData.reference,
      movedBy: formData.movedBy,
      date: new Date().toISOString(),
    });

    addLedgerEntry({
      date: new Date().toISOString(),
      productId: formData.productId,
      quantityChange: formData.quantity,
      type: "transfer",
      reference: formData.reference || "Transfer",
      fromLocationId: formData.fromLocationId,
      toLocationId: formData.toLocationId,
      performedBy: formData.movedBy,
    });

    toast.success("Stock movement recorded successfully");
    onClose();
    
    setFormData({
      productId: "",
      fromLocationId: "",
      toLocationId: "",
      quantity: 0,
      reference: "",
      movedBy: "Admin User",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Internal Transfer</DialogTitle>
          <DialogDescription>
            Move stock between locations or warehouses. Overall stock quantity
            stays the same, only the location changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fromLocation">From Location</Label>
              <Select
                value={formData.fromLocationId}
                onValueChange={(value) => setFormData({ ...formData, fromLocationId: value })}
              >
                <SelectTrigger id="fromLocation">
                  <SelectValue placeholder="Select source location" />
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

            <div className="grid gap-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Select
                value={formData.toLocationId}
                onValueChange={(value) => setFormData({ ...formData, toLocationId: value })}
              >
                <SelectTrigger id="toLocation">
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter((loc) => loc.id !== formData.fromLocationId)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                }
                min="1"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="e.g., MOVE-2024-001"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Movement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
