import { useEffect, useRef, useState } from "react";
import { Package, DollarSign, AlertTriangle, PackageX } from "lucide-react";
import { Card } from "./ui/card";

interface InventoryStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
}

function useAnimatedNumber(value: number, duration = 400) {
  const [display, setDisplay] = useState(value);
  const startValue = useRef(value);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startValue.current = display;
    startTime.current = null;

    const step = (timestamp: number) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }
      const progress = Math.min(
        (timestamp - startTime.current) / duration,
        1
      );
      const next = startValue.current + (value - startValue.current) * progress;
      setDisplay(next);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return Math.round(display);
}

export function InventoryStats({
  totalProducts,
  totalValue,
  lowStock,
  outOfStock,
}: InventoryStatsProps) {
  const animatedTotalProducts = useAnimatedNumber(totalProducts);
  const animatedLowStock = useAnimatedNumber(lowStock);
  const animatedOutOfStock = useAnimatedNumber(outOfStock);

  const stats = [
    {
      title: "Total Products",
      value: animatedTotalProducts,
      subtitle: "Active SKUs in catalog",
      icon: Package,
      color: "bg-sky-50 text-sky-600",
    },
    {
      title: "Total Inventory Value",
      value: `$${totalValue.toLocaleString()}`,
      subtitle: "Based on current stock",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Low Stock Alerts",
      value: animatedLowStock,
      subtitle: "At or below min level",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Out of Stock",
      value: animatedOutOfStock,
      subtitle: "Needs immediate action",
      icon: PackageX,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isCurrency = stat.title.includes("Value");
        const displayValue = isCurrency
          ? stat.value
          : (stat.value as number).toLocaleString();

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-none bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-transparent to-indigo-100/60" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {displayValue}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {stat.subtitle}
                </p>
              </div>
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${stat.color} shadow-sm`}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
