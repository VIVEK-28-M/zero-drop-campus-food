import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  Flame,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { DietDot } from "@/components/ItemCard";
import { PriceDecayChart } from "@/components/PriceDecayChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNow } from "@/hooks/use-now";
import { ITEMS, REVIEWS, vendorById } from "@/lib/data";
import {
  currentPrice,
  discountPct,
  fmtClock,
  fmtDuration,
  inr,
  nextDropIn,
  stepAmount,
  timeLeft,
  windowProgress,
} from "@/lib/pricing";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/item/$id")({
  head: ({ params }) => {
    const item = ITEMS.find((i) => i.id === params.id);
    const title = item ? `${item.name} — ZeroDrop` : "Item — ZeroDrop";
    const desc = item
      ? `${item.description} Live decaying price from ${inr(item.basePrice)}.`
      : "Surplus food listing with live decaying price on ZeroDrop.";
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 158) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ItemPage,
  notFoundComponent: ItemNotFound,
});

function ItemNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Listing not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This drop may have cleared already. Check the marketplace for live listings.
      </p>
      <Button asChild className="mt-6 glow-primary">
        <Link to="/marketplace">Back to marketplace</Link>
      </Button>
    </div>
  );
}

function StarRow({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(size, s <= Math.round(rating) ? "fill-urgency text-urgency" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}

function ItemPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const now = useNow();
  const { customItems, favorites, toggleFavorite, stockLeft, extraReviews, priceOverride } = useApp();

  const item = [...customItems, ...ITEMS].find((i) => i.id === id);
  if (!item) throw notFound();

  const vendor = vendorById(item.vendorId);
  const t = now ?? item.listedAt;
  const price = priceOverride[item.id] ?? currentPrice(item, t);
  const left = stockLeft[item.id] ?? item.quantity;
  const expired = now ? timeLeft(item, t) <= 0 : false;
  const soldOut = left <= 0;
  const [qty, setQty] = useState(1);
  const fav = favorites.includes(item.id);

  const reviews = [...(extraReviews[item.id] ?? []), ...(REVIEWS[item.id] ?? [])];
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : vendor?.rating ?? 4.5;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/marketplace" className="hover:text-primary">
          Marketplace
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{item.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT */}
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/70">
            <img
              src={item.image}
              alt={item.name}
              width={1024}
              height={768}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              {item.tags.map((tag) => (
                <DietDot key={tag} tag={tag} />
              ))}
            </div>
            <button
              onClick={() => toggleFavorite(item.id)}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur transition-colors hover:border-primary"
            >
              <Heart className={cn("size-5", fav ? "fill-destructive text-destructive" : "text-foreground")} />
            </button>
          </div>

          {/* DECAY CHART */}
          <section className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <TrendingDown className="size-5 text-urgency" />
                  Price decay curve
                </h2>
                <p className="text-xs text-muted-foreground">
                  Drops {inr(stepAmount(item))} every {Math.round(item.stepMs / 60000)} min until{" "}
                  {fmtClock(item.closesAt)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "border-0 font-semibold",
                  item.preset === "aggressive" ? "bg-urgency/15 text-urgency" : "bg-primary/15 text-primary"
                )}
              >
                {item.preset === "aggressive" ? "Aggressive · 10-min drops" : "Standard · 30-min drops"}
              </Badge>
            </div>
            <PriceDecayChart item={item} />
          </section>

          {/* REVIEWS */}
          <section className="rounded-3xl border border-border/70 bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold">Ratings & reviews</h2>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-bold">{avg.toFixed(1)}</span>
                <div>
                  <StarRow rating={avg} />
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {reviews.length || vendor?.ratingCount} ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Fresh", "Hot", "Good value", "Hygienic", "Generous portion"].map((tag) => (
                <Badge key={tag} variant="outline" className="border-border/80 text-xs">
                  {tag} · {Math.floor(Math.random() * 30) + 12}
                </Badge>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No written reviews yet — be the first after your pickup.
                </p>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <StarRow rating={r.rating} size="size-3.5" />
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  {r.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.tags.map((tg) => (
                        <span key={tg} className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT — buy panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6 rounded-3xl border border-border/70 bg-card p-6">
            <div>
              <h1 className="font-display text-3xl font-bold">{item.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>

            {vendor && (
              <Link
                to="/marketplace"
                className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4 transition-colors hover:bg-muted/70"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <MapPin className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{vendor.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {vendor.block} · Stall {vendor.stall}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-urgency">
                  <Star className="size-4 fill-urgency" />
                  {vendor.rating}
                </span>
              </Link>
            )}

            {/* Price block */}
            <div className="rounded-2xl border border-urgency/30 bg-urgency/5 p-5">
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl font-extrabold text-primary">{inr(price)}</span>
                <span className="pb-1 text-lg text-muted-foreground line-through">{inr(item.basePrice)}</span>
                <span className="ml-auto rounded-full bg-urgency px-3 py-1 text-sm font-bold text-urgency-foreground">
                  −{now ? discountPct(item, t) : 0}%
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <Progress value={now ? windowProgress(item, t) * 100 : 0} className="h-2" />
                <div className="flex flex-wrap justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    Closes in{" "}
                    <span className="font-bold tabular-nums text-foreground">
                      {now ? fmtDuration(timeLeft(item, t)) : "—"}
                    </span>
                  </span>
                  {!expired && (
                    <span className="font-medium text-urgency tabular-nums">
                      Next drop in {now ? fmtDuration(nextDropIn(item, t)).slice(3) : "—"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
              <span className="flex items-center gap-2 text-sm">
                <Flame className="size-4 text-urgency" />
                Remaining stock
              </span>
              <span className={cn("font-display text-lg font-bold tabular-nums", left <= 3 ? "text-destructive" : "text-primary")}>
                {left} / {item.quantity}
              </span>
            </div>

            {/* Qty */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-3 rounded-xl border border-border p-1">
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center font-display font-bold tabular-nums">{qty}</span>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setQty((q) => Math.min(left, q + 1))} aria-label="Increase quantity">
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold">{inr(price * qty)}</span>
            </div>

            <Button
              size="lg"
              disabled={soldOut || expired}
              className="w-full glow-primary"
              onClick={() => navigate({ to: "/checkout/$id", params: { id: item.id }, search: { qty } })}
            >
              {soldOut ? "Sold out" : expired ? "Clearance ended" : "Reserve & checkout"}
              {!soldOut && !expired && <ArrowRight className="size-4" />}
            </Button>

            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              FSSAI-licensed vendor ({vendor?.fssai}). Price locks at checkout even if it drops further.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
