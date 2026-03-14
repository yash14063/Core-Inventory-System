import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useInventoryStore, Location } from "../store/inventoryStore";
import { toast } from "sonner";

interface WarehouseDialogProps {
  open: boolean;
  onClose: () => void;
  location?: Location | null;
}

export function WarehouseDialog({ open, onClose, location }: WarehouseDialogProps) {
  const addLocation = useInventoryStore((state) => state.addLocation);
  const updateLocation = useInventoryStore((state) => state.updateLocation);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "warehouse" as "warehouse" | "store" | "distribution",
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        address: location.address,
        type: location.type,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        type: "warehouse",
      });
    }
  }, [location, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (location) {
      updateLocation(location.id, formData);
      toast.success("Location updated successfully");
    } else {
      addLocation(formData);
      toast.success("Location added successfully");
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{location ? "Edit Location" : "Add New Location"}</DialogTitle>
          <DialogDescription>
            {location ? "Update the location details." : "Create a new warehouse, store, or distribution center."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Main Warehouse"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "warehouse" | "store" | "distribution") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="distribution">Distribution Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{location ? "Update" : "Add"} Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
