import { useState } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { Button } from "../components/ui/button";
import { Plus, TruckIcon } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { DeliveryOrderDialog } from "../components/DeliveryOrderDialog";
import { toast } from "sonner";
import { format } from "date-fns";

export function DeliveryOrders() {
  const deliveryOrders = useInventoryStore((state) => state.deliveryOrders);
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);
  const stockByLocation = useInventoryStore(
    (state) => state.stockByLocation
  );
  const updateDeliveryOrder = useInventoryStore(
    (state) => state.updateDeliveryOrder
  );
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

  const handleDeliverOrder = (orderId: string) => {
    const order = deliveryOrders.find((o) => o.id === orderId);
    if (!order || order.status !== "pending") return;

    const product = products.find((p) => p.id === order.productId);
    if (!product) return;

    const locationStock =
      stockByLocation.find(
        (s) =>
          s.productId === order.productId &&
          s.locationId === order.locationId
      )?.quantity ?? 0;

    if (locationStock < order.quantity) {
      toast.error("Insufficient stock at this location for delivery");
      return;
    }

    updateStockByLocation(
      order.productId,
      order.locationId,
      -order.quantity
    );

    updateDeliveryOrder(orderId, { status: "delivered" });

    addLedgerEntry({
      date: new Date().toISOString(),
      productId: order.productId,
      quantityChange: -order.quantity,
      type: "delivery",
      reference: order.reference,
      locationId: order.locationId,
      performedBy: order.customer || "System",
    });

    toast.success("Order delivered successfully");
  };

  const handleCancelOrder = (orderId: string) => {
    updateDeliveryOrder(orderId, { status: "cancelled" });
    toast.success("Order cancelled");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>;
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
          <h1 className="text-3xl font-semibold text-gray-900">Delivery Orders</h1>
          <p className="text-gray-500">Manage outgoing stock</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          New Order
        </Button>
      </div>

      {deliveryOrders.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50">
              <TruckIcon className="size-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No delivery orders yet</h3>
            <p className="mb-4 text-gray-500">
              Create your first delivery order
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Create Order
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveryOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {getProductName(order.productId)}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="grid gap-2 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-500">Reference:</span>
                      <span className="ml-2 font-medium">{order.reference}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium">{order.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium">
                        {getLocationName(order.locationId)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(order.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Customer:</span>
                    <span className="ml-2 font-medium">{order.customer}</span>
                  </div>
                </div>
                {order.status === "pending" && (
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDeliverOrder(order.id)}
                    >
                      Mark Delivered
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelOrder(order.id)}
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

      <DeliveryOrderDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}