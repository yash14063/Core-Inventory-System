import { useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { Button } from "../components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import { Card } from "../components/ui/card";
import { AdjustmentDialog } from "../components/AdjustmentDialog";
import { toast } from "sonner";
import { format } from "date-fns";

export function InventoryAdjustment() {
  const adjustments = useInventoryStore((state) => state.adjustments);
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);

  const [dialogOpen, setDialogOpen] = useState(false);

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Unknown";
  };

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || "Unknown";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Inventory Adjustment</h1>
          <p className="text-gray-500">Adjust stock levels manually</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          New Adjustment
        </Button>
      </div>

      {adjustments.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50">
              <ClipboardList className="size-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No adjustments yet</h3>
            <p className="mb-4 text-gray-500">
              Create your first inventory adjustment
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Create Adjustment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {adjustments.map((adjustment) => {
            const difference = adjustment.quantityAfter - adjustment.quantityBefore;
            const isIncrease = difference > 0;

            return (
              <Card key={adjustment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {getProductName(adjustment.productId)}
                      </h3>
                      <span
                        className={`text-sm font-medium ${
                          isIncrease ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncrease ? "+" : ""}
                        {difference} units
                      </span>
                    </div>
                    <div className="grid gap-2 text-sm md:grid-cols-3">
                      <div>
                        <span className="text-gray-500">Before:</span>
                        <span className="ml-2 font-medium">
                          {adjustment.quantityBefore} units
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">After:</span>
                        <span className="ml-2 font-medium">
                          {adjustment.quantityAfter} units
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium">
                          {getLocationName(adjustment.locationId)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Reason:</span>
                      <span className="ml-2">{adjustment.reason}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Adjusted by {adjustment.adjustedBy} on{" "}
                      {format(new Date(adjustment.date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AdjustmentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}