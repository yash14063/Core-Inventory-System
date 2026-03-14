import { useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { Button } from "../components/ui/button";
import { Plus, History, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/card";
import { MoveDialog } from "../components/MoveDialog";
import { format } from "date-fns";

export function MoveHistory() {
  const moveHistory = useInventoryStore((state) => state.moveHistory);
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
          <h1 className="text-3xl font-semibold text-gray-900">
            Internal Transfers
          </h1>
          <p className="text-gray-500">
            Move stock between locations or warehouses. Global quantity stays
            the same, only the location changes.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          New Internal Transfer
        </Button>
      </div>

      {moveHistory.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50">
              <History className="size-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No internal transfers yet
            </h3>
            <p className="mb-4 text-gray-500">
              Create your first internal transfer between locations.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="size-4" />
              New Internal Transfer
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {moveHistory.map((move) => (
            <Card key={move.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {getProductName(move.productId)}
                    </h3>
                    <p className="text-sm text-gray-500">Ref: {move.reference}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">From:</span>
                      <span className="font-medium">
                        {getLocationName(move.fromLocationId)}
                      </span>
                    </div>
                    <ArrowRight className="size-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">To:</span>
                      <span className="font-medium">
                        {getLocationName(move.toLocationId)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium">{move.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Moved by:</span>
                      <span className="ml-2">{move.movedBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2">
                        {format(new Date(move.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <MoveDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}