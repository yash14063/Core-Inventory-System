import { useInventoryStore } from "../store/inventoryStore";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";

export function StockByLocation() {
  const products = useInventoryStore((state) => state.products);
  const locations = useInventoryStore((state) => state.locations);
  const stockByLocation = useInventoryStore((state) => state.stockByLocation);

  // Group stock by location
  const stockData = locations.map((location) => {
    const locationStock = products.map((product) => {
      const stock = stockByLocation.find(
        (s) => s.productId === product.id && s.locationId === location.id
      );
      return {
        product,
        quantity: stock?.quantity || 0,
      };
    });
    return {
      location,
      products: locationStock,
    };
  });

  return (
    <div className="space-y-6">
      {stockData.map(({ location, products }) => {
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
        return (
          <Card key={location.id} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50">
                  <MapPin className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.address}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-gray-900">
                  {totalItems}
                </div>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </div>

            <div className="rounded-lg border">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products
                    .filter((p) => p.quantity > 0)
                    .map(({ product, quantity }) => {
                      const getStatus = () => {
                        if (quantity === 0) return <Badge variant="destructive">Empty</Badge>;
                        if (quantity <= product.minStock)
                          return <Badge className="bg-yellow-500 hover:bg-yellow-600">Low</Badge>;
                        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
                      };

                      return (
                        <tr key={product.id}>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                          <td className="px-4 py-3 capitalize text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            {quantity}
                          </td>
                          <td className="px-4 py-3 text-right">{getStatus()}</td>
                        </tr>
                      );
                    })}
                  {products.filter((p) => p.quantity > 0).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No stock available at this location
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
