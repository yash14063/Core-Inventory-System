import { useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { Button } from "../components/ui/button";
import { Plus, PackagePlus } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ReceiptDialog } from "../components/ReceiptDialog";
import { toast } from "sonner";
import { format } from "date-fns";

export function Receipts() {
  const receipts = useInventoryStore((state) => state.receipts);
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);
  const updateReceipt = useInventoryStore((state) => state.updateReceipt);
  const updateStockByLocation = useInventoryStore(
    (state) => state.updateStockByLocation
  );
  const addLedgerEntry = useInventoryStore(
    (state) => state.addLedgerEntry
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Unknown";
  };

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.name || "Unknown";
  };

  const handleReceiveStock = (receiptId: string) => {
    const receipt = receipts.find((r) => r.id === receiptId);
    if (!receipt || receipt.status !== "pending") return;

    const product = products.find((p) => p.id === receipt.productId);
    if (!product) return;

    updateStockByLocation(
      receipt.productId,
      receipt.locationId,
      receipt.quantity
    );

    updateReceipt(receiptId, { status: "received" });

    addLedgerEntry({
      date: new Date().toISOString(),
      productId: receipt.productId,
      quantityChange: receipt.quantity,
      type: "receipt",
      reference: receipt.reference,
      locationId: receipt.locationId,
      performedBy: receipt.supplier || "System",
    });

    toast.success("Stock received successfully");
  };

  const handleCancelReceipt = (receiptId: string) => {
    updateReceipt(receiptId, { status: "cancelled" });
    toast.success("Receipt cancelled");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-green-500 hover:bg-green-600">Received</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Receipts</h1>
          <p className="text-gray-500">Manage incoming stock</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          New Receipt
        </Button>
      </div>

      {receipts.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50">
              <PackagePlus className="size-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No receipts yet</h3>
            <p className="mb-4 text-gray-500">
              Create your first receipt to start receiving stock
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Create Receipt
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <Card key={receipt.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {getProductName(receipt.productId)}
                    </h3>
                    {getStatusBadge(receipt.status)}
                  </div>
                  <div className="grid gap-2 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-500">Reference:</span>
                      <span className="ml-2 font-medium">{receipt.reference}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium">{receipt.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium">
                        {getLocationName(receipt.locationId)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(receipt.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Supplier:</span>
                    <span className="ml-2 font-medium">{receipt.supplier}</span>
                  </div>
                </div>
                {receipt.status === "pending" && (
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReceiveStock(receipt.id)}
                    >
                      Receive Stock
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelReceipt(receipt.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ReceiptDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}