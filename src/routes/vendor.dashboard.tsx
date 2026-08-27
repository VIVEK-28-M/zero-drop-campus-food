import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, QrCode, TrendingDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { ITEMS, vendorById } from "@/lib/data";
import { currentPrice, discountPct, fmtDuration, inr, timeLeft } from "@/lib/pricing";
import { useApp } from "@/lib/store";
import { useNow } from "@/hooks/use-now";

export const Route = createFileRoute("/vendor/dashboard")({
  head: () => ({
    meta: [
      { title: "Vendor Console — ZeroDrop" },
      {
        name: "description",
        content:
          "Manage surplus listings, watch live decay pricing, verify pickup codes and track recovered revenue in the ZeroDrop vendor console.",
      },
      { property: "og:title", content: "Vendor Console — ZeroDrop" },
      { property: "og:description", content: "Live clearance stats, decay control and pickup verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorDashboardPage,
});

const NAV = [{ to: "/vendor/dashboard", label: "Overview", icon: LayoutDashboard }];
const VENDOR_ID = "v1";

function VendorDashboardPage() {
  const tick = useNow(1000);
  const { customItems, stockLeft, markSoldOut, verifyOrder, orders } = useApp();
  const [code, setCode] = useState("");

  const now = tick ?? 0;
  const vendor = vendorById(VENDOR_ID);
  const listings = [...customItems, ...ITEMS].filter((i) => i.vendorId === VENDOR_ID);

  const recovered = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.pricePaid * o.qty, 0);
  const liveCount = listings.filter((i) => timeLeft(i, now) > 0).length;
  const portions = listings.reduce((s, i) => s + (stockLeft[i.id] ?? i.quantity), 0);

  return (
    <DashboardShell
      title={vendor?.name ?? "Vendor console"}
      subtitle={`${vendor?.block} · FSSAI ${vendor?.fssai}`}
      nav={NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingDown} label="Live clearance listings" value={String(liveCount)} />
        <StatCard icon={LayoutDashboard} label="Portions unsold" value={String(portions)} />
        <StatCard icon={TrendingDown} label="Revenue recovered" value={inr(recovered)} />
        <StatCard icon={QrCode} label="Pickups verified today" value={String(orders.filter((o) => o.status === "completed").length)} />
      </div>

      <section className="mt-8 rounded-2xl border border-border/70 bg-card p-6">
        <h2 className="font-display text-lg font-bold">Verify a pickup code</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the student's ZD code (or scan their QR pass) to hand over the order.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ZD-4F8K2M"
            maxLength={12}
            className="max-w-xs font-mono"
          />
          <Button
            onClick={() => {
              if (!code.trim()) {
                toast.error("Enter a pickup code");
                return;
              }
              if (verifyOrder(code.trim())) {
                toast.success("Pickup verified", { description: `${code.trim()} handed over.` });
                setCode("");
              } else {
                toast.error("Code not found", { description: "Check the code or ask for the QR pass." });
              }
            }}
          >
            <QrCode className="size-4" /> Verify
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">Live listings</h2>
        <div className="mt-4 space-y-3">
          {listings.map((i) => {
            const left = stockLeft[i.id] ?? i.quantity;
            const expired = timeLeft(i, now) <= 0;
            return (
              <div
                key={i.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-card p-4"
              >
                <img src={i.image} alt={i.name} className="size-14 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-40 flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {left} left · closes in {fmtDuration(timeLeft(i, now))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-primary">{inr(currentPrice(i, now))}</p>
                  <p className="text-xs text-muted-foreground line-through">{inr(i.basePrice)}</p>
                </div>
                <Badge variant={expired ? "outline" : "secondary"}>
                  {expired ? "Closed" : `−${discountPct(i, now)}%`}
                </Badge>
                <Button size="sm" variant="outline" disabled={left === 0} onClick={() => markSoldOut(i.id)}>
                  Mark sold out
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}
