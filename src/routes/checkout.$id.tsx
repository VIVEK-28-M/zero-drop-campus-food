import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, ShieldCheck, Smartphone, Wallet, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { itemById, vendorById, type Order } from "@/lib/data";
import { currentPrice, fmtDuration, inr, timeLeft } from "@/lib/pricing";
import { useApp } from "@/lib/store";
import { useNow } from "@/hooks/use-now";

export const Route = createFileRoute("/checkout/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    qty: Math.max(1, Number(search.qty ?? 1) || 1),
  }),
  head: () => ({
    meta: [
      { title: "Secure Checkout — ZeroDrop" },
      {
        name: "description",
        content:
          "Lock in your decayed price, pick a pickup slot and pay by UPI, campus wallet, card or at the counter.",
      },
      { property: "og:title", content: "Secure Checkout — ZeroDrop" },
      { property: "og:description", content: "Lock your rescue price and reserve your pickup window." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const METHODS = [
  { id: "upi", label: "UPI / QR scan", desc: "Pay instantly from any UPI app", icon: Smartphone },
  { id: "wallet", label: "Campus wallet", desc: "Balance ₹1,240", icon: Wallet },
  { id: "card", label: "Saved card", desc: "•••• 4421 · HDFC", icon: CreditCard },
  { id: "counter", label: "Pay at counter", desc: "Cash on pickup", icon: Store },
] as const;

function CheckoutPage() {
  const { id } = Route.useParams();
  const { qty } = Route.useSearch();
  const navigate = useNavigate();
  const tick = useNow(1000);
  const { customItems, placeOrder } = useApp();
  const [method, setMethod] = useState<Order["method"]>("upi");
  const [slot, setSlot] = useState("Next 15 min");

  const item = itemById(id, customItems);
  const now = tick ?? item?.listedAt ?? 0;

  if (!item) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Listing unavailable</h1>
        <p className="mt-2 text-muted-foreground">This clearance drop has ended.</p>
        <Button asChild className="mt-6">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    );
  }

  const vendor = vendorById(item.vendorId);
  const price = currentPrice(item, now);
  const total = price * qty;
  const saved = (item.basePrice - price) * qty;

  const confirm = () => {
    const order = placeOrder(item, qty, method, slot);
    toast.success("Order confirmed!", { description: `Pass ${order.code} · show it at ${vendor?.stall}` });
    navigate({ to: "/student/orders" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        to="/item/$id"
        params={{ id: item.id }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to listing
      </Link>

      <h1 className="mt-4 font-display text-3xl font-extrabold">Secure checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-display text-lg font-bold">Pickup slot</h2>
            <RadioGroup value={slot} onValueChange={setSlot} className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Next 15 min", "15–30 min", "30–45 min"].map((s) => (
                <Label
                  key={s}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 p-4 text-sm font-medium hover:bg-accent/50"
                >
                  <RadioGroupItem value={s} />
                  {s}
                </Label>
              ))}
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">
              Clearance closes in {fmtDuration(timeLeft(item, now))} at {vendor?.block}.
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-display text-lg font-bold">Payment method</h2>
            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as Order["method"])}
              className="mt-4 grid gap-3"
            >
              {METHODS.map((m) => (
                <Label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-border/70 p-4 hover:bg-accent/50"
                >
                  <RadioGroupItem value={m.id} />
                  <m.icon className="size-5 text-primary" />
                  <span>
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.desc}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border/70 surface-gradient p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <div className="mt-4 flex gap-3">
            <img src={item.image} alt={item.name} className="size-16 rounded-xl object-cover" loading="lazy" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {vendor?.name} · Qty {qty}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Original price</dt>
              <dd className="line-through">{inr(item.basePrice * qty)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Decay discount</dt>
              <dd className="text-primary">−{inr(saved)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-bold">
              <dt>Total</dt>
              <dd>{inr(total)}</dd>
            </div>
          </dl>
          <Button size="lg" className="mt-6 w-full glow-primary" onClick={confirm}>
            Confirm order
          </Button>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            Price locked at {inr(price)} per portion. Free cancellation within 5 minutes.
          </p>
        </aside>
      </div>
    </div>
  );
}
