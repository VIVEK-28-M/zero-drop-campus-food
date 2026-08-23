import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNow } from "@/hooks/use-now";
import type { Item } from "@/lib/data";
import { currentPrice, fmtClock, stepAmount } from "@/lib/pricing";

export function PriceDecayChart({ item }: { item: Item }) {
  const [mounted, setMounted] = useState(false);
  const now = useNow(5000);
  useEffect(() => setMounted(true), []);
  if (!mounted || !now) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted/40" />;
  }

  const steps: { t: number; label: string; price: number }[] = [];
  const step = stepAmount(item);
  let p = item.basePrice;
  for (let t = item.listedAt; t <= item.closesAt + item.stepMs; t += item.stepMs) {
    steps.push({
      t,
      label: fmtClock(t),
      price: Math.max(item.floorPrice, Math.round(p)),
    });
    p -= step;
  }

  const nowPrice = currentPrice(item, now);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={steps} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="decay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.015 215)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
            domain={[0, "dataMax + 10"]}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.2 0.016 215)",
              border: "1px solid oklch(0.3 0.015 215)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "oklch(0.68 0.02 200)" }}
            formatter={(v) => [`₹${v}`, "Price"]}
          />
          <Area
            type="stepAfter"
            dataKey="price"
            stroke="oklch(0.78 0.16 75)"
            strokeWidth={2.5}
            fill="url(#decay)"
          />
          <ReferenceDot
            x={fmtClock(item.listedAt + Math.floor((now - item.listedAt) / item.stepMs) * item.stepMs)}
            y={nowPrice}
            r={6}
            fill="oklch(0.72 0.17 162)"
            stroke="oklch(0.145 0.012 220)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
