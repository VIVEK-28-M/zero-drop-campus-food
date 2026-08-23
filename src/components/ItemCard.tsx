import { Link } from "@tanstack/react-router";
import { Clock3, Flame, MapPin, Star } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { vendorById, type Item } from "@/lib/data";
import { currentPrice, discountPct, fmtDuration, inr, timeLeft, windowProgress } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function DietDot({ tag }: { tag: string }) {
  const color =
    tag === "Non-Veg"
      ? "bg-destructive"
      : tag === "Bakery" || tag === "Beverage"
        ? "bg-urgency"
        : "bg-primary";
  return (
    <Badge variant="outline" className="gap-1.5 border-border/80 text-[11px] font-medium">
      <span className={`size-1.5 rounded-full ${color}`} />
      {tag}
    </Badge>
  );
}

export function ItemCard({ item, stock }: { item: Item; stock?: number }) {
  const now = useNow();
  const vendor = vendorById(item.vendorId);
  const price = now ? currentPrice(item, now) : item.basePrice;
  const pct = now ? discountPct(item, now) : 0;
  const left = stock ?? item.quantity;
  const soldOut = left <= 0;
  const expired = now ? timeLeft(item, now) <= 0 : false;

  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <DietDot key={t} tag={t} />
          ))}
        </div>
        {pct > 0 && !soldOut && (
          <div className="absolute right-3 top-3 rounded-full bg-urgency px-2.5 py-1 text-xs font-bold text-urgency-foreground glow-urgency">
            −{pct}%
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <span className="rounded-full border border-destructive/50 bg-destructive/20 px-4 py-1.5 text-sm font-bold text-destructive-foreground">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display font-semibold leading-snug">{item.name}</h3>
          {vendor && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {vendor.name} · {vendor.block}
              <span className="ml-auto flex items-center gap-0.5 text-urgency">
                <Star className="size-3 fill-urgency" />
                {vendor.rating}
              </span>
            </p>
          )}
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-display text-xl font-bold text-primary">{inr(price)}</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {inr(item.basePrice)}
              </span>
            </div>
            {!soldOut && (
              <span className="flex items-center gap-1 text-xs font-medium text-urgency">
                <Flame className="size-3.5" />
                {left} left
              </span>
            )}
          </div>
          <div className="space-y-1">
            <Progress value={now ? windowProgress(item, now) * 100 : 0} className="h-1.5" />
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="size-3" />
              {expired ? (
                "Clearance ended"
              ) : (
                <>
                  Ends in{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {now ? fmtDuration(timeLeft(item, now)) : "—"}
                  </span>
                  {item.preset === "aggressive" && (
                    <span className="ml-1 rounded bg-urgency/15 px-1.5 py-0.5 text-[10px] font-bold text-urgency">
                      FAST DROP
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
