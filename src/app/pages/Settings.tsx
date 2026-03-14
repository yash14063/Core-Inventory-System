import { useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { Button } from "../components/ui/button";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { WarehouseDialog } from "../components/WarehouseDialog";
import { toast } from "sonner";
import { Location } from "../store/inventoryStore";

export function Settings() {
  const locations = useInventoryStore((state) => state.locations);
  const deleteLocation = useInventoryStore((state) => state.deleteLocation);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleAddLocation = () => {
    setEditingLocation(null);
    setDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setDialogOpen(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    deleteLocation(locationId);
    toast.success("Location deleted successfully");
  };

  const getLocationTypeBadge = (type: string) => {
    switch (type) {
      case "warehouse":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Warehouse</Badge>;
      case "store":
        return <Badge className="bg-green-500 hover:bg-green-600">Store</Badge>;
      case "distribution":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Distribution</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your system configuration</p>
      </div>

      <Tabs defaultValue="warehouses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="warehouses">Warehouses & Locations</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
              <p className="text-sm text-gray-500">Manage warehouses, stores, and distribution centers</p>
            </div>
            <Button onClick={handleAddLocation} className="gap-2">
              <Plus className="size-4" />
              Add Location
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {locations.map((location) => (
              <Card key={location.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50">
                      <MapPin className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{location.name}</h3>
                        {getLocationTypeBadge(location.type)}
                      </div>
                      <p className="text-sm text-gray-500">{location.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  defaultValue="CoreInventory"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Currency</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Time Zone</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC-06:00 (Central Time)</option>
                  <option>UTC-07:00 (Mountain Time)</option>
                  <option>UTC-08:00 (Pacific Time)</option>
                </select>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <WarehouseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        location={editingLocation}
      />
    </div>
  );
}