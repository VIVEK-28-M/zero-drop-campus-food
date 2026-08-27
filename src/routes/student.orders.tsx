import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/DashboardShell";
import { FakeQr } from "@/components/FakeQr";
import { RateOrderModal } from "@/components/RateOrderModal";
import { ItemCard } from "@/components/ItemCard";
import { itemById, vendorById } from "@/lib/data";
import { fmtDuration, inr } from "@/lib/pricing";
import { useApp } from "@/lib/store";
import { useNow } from "@/hooks/use-now";

export const Route = createFileRoute("/student/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — ZeroDrop" },
      {
        name: "description",
        content:
          "Track your ZeroDrop rescues: live pickup countdowns, QR passes, order history and saved favourites.",
      },
      { property: "og:title", content: "My Orders — ZeroDrop" },
      { property: "og:description", content: "Your QR passes, pickup countdowns and rescue history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentOrdersPage,
});

const NAV = [{ to: "/student/orders", label: "My Orders", icon: ShoppingBag }];

function StudentOrdersPage() {
  const now = useNow(1000) ?? 0;
  const { orders, favorites, customItems, cancelOrder, stockLeft, userName } = useApp();
  const [tab, setTab] = useState<"active" | "history" | "favorites">("active");

  const active = orders.filter((o) => o.status === "pending");
  const history = orders.filter((o) => o.status !== "pending");
  const favItems = favorites.map((f) => itemById(f, customItems)).filter(Boolean);

  const totalSaved = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.basePrice - o.pricePaid) * o.qty, 0);

  return (
    <DashboardShell
      title={`Hey, ${userName.split(" ")[0]}`}
      subtitle={`${active.length} active pickup${active.length === 1 ? "" : "s"} · ${inr(totalSaved)} saved so far`}
      nav={NAV}
    >
      <div className="mb-6 flex gap-2 rounded-xl border border-border/70 bg-card p-1.5">
        {(["active", "history", "favorites"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "active" && (
        <div className="space-y-4">
          {active.length === 0 && <Empty label="No active pickups right now." />}
          {active.map((o) => {
            const left = now ? o.pickupBy - now : 0;
            return (
              <div
                key={o.id}
                className="grid gap-6 rounded-2xl border border-border/70 bg-card p-6 sm:grid-cols-[auto_1fr]"
              >
                <FakeQr seed={o.code} size={140} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold">{o.itemName}</h2>
                    <Badge variant="secondary">{o.code}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {vendorById(o.vendorId)?.name} · {vendorById(o.vendorId)?.stall} · Qty {o.qty}
                  </p>
                  <p className="mt-4 text-sm">
                    Pickup closes in{" "}
                    <span className="font-display font-bold tabular-nums text-urgency">
                      {now ? fmtDuration(left) : "--:--:--"}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Paid {inr(o.pricePaid * o.qty)} ·{" "}
                    {o.method === "counter" ? "Pay at counter" : o.method.toUpperCase()}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/item/$id" params={{ id: o.itemId }}>
                        View listing
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => cancelOrder(o.id)}>
                      Cancel order
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {history.length === 0 && <Empty label="No past orders yet." />}
          {history.map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card px-6 py-5"
            >
              <div>
                <p className="font-medium">{o.itemName}</p>
                <p className="text-xs text-muted-foreground">
                  {o.code} · {vendorById(o.vendorId)?.name} · {inr(o.pricePaid * o.qty)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={o.status === "completed" ? "secondary" : "outline"}>{o.status}</Badge>
                {o.status === "completed" &&
                  (o.rating ? (
                    <span className="flex items-center gap-1 text-sm text-primary">
                      <Star className="size-4 fill-current" /> {o.rating}
                    </span>
                  ) : (
                    <RateOrderModal order={o}>
                      <Button size="sm" variant="outline">
                        Rate order
                      </Button>
                    </RateOrderModal>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "favorites" && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favItems.length === 0 && <Empty label="No favourites saved yet." />}
          {favItems.map((it) =>
            it ? <ItemCard key={it.id} item={it} stock={stockLeft[it.id] ?? it.quantity} /> : null
          )}
        </div>
      )}
    </DashboardShell>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <Heart className="mx-auto size-6 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <Button asChild className="mt-5">
        <Link to="/marketplace">Browse marketplace</Link>
      </Button>
    </div>
  );
}
