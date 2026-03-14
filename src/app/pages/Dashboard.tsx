import { useMemo } from "react";
import { Link } from "react-router";
import { InventoryStats } from "../components/InventoryStats";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useInventoryStore } from "../store/inventoryStore";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export function Dashboard() {
  const products = useInventoryStore((state) => state.products);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const lowStock = products.filter(
      (p) => p.quantity > 0 && p.quantity <= p.minStock
    ).length;
    const outOfStock = products.filter((p) => p.quantity === 0).length;
    return { totalProducts, totalValue, lowStock, outOfStock };
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => p.quantity > 0 && p.quantity <= p.minStock)
      .slice(0, 5);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.quantity === 0).slice(0, 5);
  }, [products]);

  const categoryData = useMemo(() => {
    const byCategory: Record<
      string,
      { category: string; quantity: number; value: number }
    > = {};
    for (const p of products) {
      if (!byCategory[p.category]) {
        byCategory[p.category] = {
          category: p.category,
          quantity: 0,
          value: 0,
        };
      }
      byCategory[p.category].quantity += p.quantity;
      byCategory[p.category].value += p.quantity * p.price;
    }
    return Object.values(byCategory);
  }, [products]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Inventory Overview
          </h1>
          <p className="text-gray-500">
            Live snapshot of stock health and value
          </p>
        </div>
        <Link to="/receipts">
          <Button className="gap-2">
            <Activity className="size-4" />
            New Stock Movement
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <InventoryStats
          totalProducts={stats.totalProducts}
          totalValue={stats.totalValue}
          lowStock={stats.lowStock}
          outOfStock={stats.outOfStock}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Category chart */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Stock by Category
                </h3>
                <p className="text-sm text-gray-500">
                  Quantity and value distribution across categories
                </p>
              </div>
            </div>
            {categoryData.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">
                Add products to see category insights.
              </p>
            ) : (
              <ChartContainer
                className="mt-2"
                config={{
                  quantity: {
                    label: "Quantity",
                    color: "var(--color-chart-1)",
                  },
                  value: {
                    label: "Value",
                    color: "var(--color-chart-2)",
                  },
                }}
              >
                <BarChart data={categoryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        labelKey="category"
                      />
                    }
                  />
                  <ChartLegend
                    verticalAlign="bottom"
                    content={<ChartLegendContent />}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="var(--color-chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--color-chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </Card>

          {/* Low / out of stock */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50">
                    <AlertTriangle className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Low Stock Items
                    </h3>
                    <p className="text-xs text-gray-500">
                      Items near their minimum level
                    </p>
                  </div>
                </div>
                <Link to="/products">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {lowStockProducts.length === 0 ? (
                  <p className="py-6 text-center text-xs text-gray-500">
                    No low stock items. You’re in a good place.
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border bg-slate-50/60 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-amber-600">
                          {product.quantity} units
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50">
                    <Package className="size-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Out of Stock
                    </h3>
                    <p className="text-xs text-gray-500">
                      Items needing replenishment
                    </p>
                  </div>
                </div>
                <Link to="/products">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {outOfStockProducts.length === 0 ? (
                  <p className="py-6 text-center text-xs text-gray-500">
                    No items are completely out of stock.
                  </p>
                ) : (
                  outOfStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border bg-slate-50/60 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-rose-600">
                          0 units
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900">
            Quick Operations
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/receipts">
              <Button className="h-auto w-full flex-col gap-2 rounded-xl bg-sky-600 py-4 text-white hover:bg-sky-700">
                <Package className="size-8" />
                <span>Receive Stock</span>
              </Button>
            </Link>
            <Link to="/delivery-orders">
              <Button className="h-auto w-full flex-col gap-2 rounded-xl bg-emerald-600 py-4 text-white hover:bg-emerald-700">
                <TrendingUp className="size-8" />
                <span>Delivery Order</span>
              </Button>
            </Link>
            <Link to="/inventory-adjustment">
              <Button className="h-auto w-full flex-col gap-2 rounded-xl bg-amber-500 py-4 text-white hover:bg-amber-600">
                <AlertTriangle className="size-8" />
                <span>Adjust Inventory</span>
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                className="h-auto w-full flex-col gap-2 rounded-xl border-dashed py-4"
              >
                <Package className="size-8 text-purple-600" />
                <span>Manage Products</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
