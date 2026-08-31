import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNow } from "@/hooks/use-now";
import { DIET_FILTERS, ITEMS, VENDORS, ZONES, vendorById, type DietTag } from "@/lib/data";
import { currentPrice, timeLeft } from "@/lib/pricing";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Live Marketplace — ZeroDrop" },
      {
        name: "description",
        content:
          "Browse live surplus food drops across campus canteens. Filter by zone, canteen, dietary tag and price while watching prices decay in real time.",
      },
      { property: "og:title", content: "Live Marketplace — ZeroDrop" },
      { property: "og:description", content: "Live decaying prices on surplus campus meals. Filter, grab, rescue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketplacePage,
});

type SortKey = "ending" | "price-asc" | "discount" | "rating";

function MarketplacePage() {
  const now = useNow();
  const { customItems, stockLeft } = useApp();
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("All Zones");
  const [vendor, setVendor] = useState("all");
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [maxPrice, setMaxPrice] = useState(150);
  const [sort, setSort] = useState<SortKey>("ending");
  const [showFilters, setShowFilters] = useState(false);

  const all = useMemo(() => [...customItems, ...ITEMS], [customItems]);

  const results = useMemo(() => {
    const t = now ?? Date.now();
    let list = all.filter((item) => {
      const v = vendorById(item.vendorId);
      const price = currentPrice(item, t);
      if (q && !`${item.name} ${item.description} ${v?.name ?? ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (zone !== "All Zones" && v?.zone !== zone) return false;
      if (vendor !== "all" && item.vendorId !== vendor) return false;
      if (diets.length && !diets.some((d) => item.tags.includes(d))) return false;
      if (price > maxPrice) return false;
      return true;
    });
    list = list.sort((a, b) => {
      if (sort === "price-asc") return currentPrice(a, t) - currentPrice(b, t);
      if (sort === "discount")
        return currentPrice(a, t) / a.basePrice - currentPrice(b, t) / b.basePrice;
      if (sort === "rating") return (vendorById(b.vendorId)?.rating ?? 0) - (vendorById(a.vendorId)?.rating ?? 0);
      return timeLeft(a, t) - timeLeft(b, t);
    });
    return list;
  }, [all, q, zone, vendor, diets, maxPrice, sort, now]);

  const activeFilters =
    (zone !== "All Zones" ? 1 : 0) + (vendor !== "all" ? 1 : 0) + diets.length + (maxPrice < 150 ? 1 : 0);

  const reset = () => {
    setZone("All Zones");
    setVendor("all");
    setDiets([]);
    setMaxPrice(150);
    setQ("");
  };

  const filterPanel = (
    <div className="space-y-6 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold">Filters</h2>
        {activeFilters > 0 && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <X className="size-3" /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        <Label>Campus zone</Label>
        <Select value={zone} onValueChange={setZone}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ZONES.map((z) => (
              <SelectItem key={z} value={z}>
                {z}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Canteen</Label>
        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All canteens</SelectItem>
            {VENDORS.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Dietary tags</Label>
        <div className="flex flex-wrap gap-2">
          {DIET_FILTERS.map((d) => (
            <button
              key={d}
              onClick={() =>
                setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                diets.includes(d)
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Max price</Label>
          <span className="font-display text-sm font-bold text-primary">₹{maxPrice}</span>
        </div>
        <Slider value={[maxPrice]} min={10} max={150} step={5} onValueChange={([v]) => setMaxPrice(v ?? maxPrice)} />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Live marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {results.length} surplus {results.length === 1 ? "listing" : "listings"} clearing across
            campus right now — prices tick down live.
          </p>
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ending">Ending soon</SelectItem>
            <SelectItem value="price-asc">Lowest price</SelectItem>
            <SelectItem value="discount">Biggest discount</SelectItem>
            <SelectItem value="rating">Top rated canteen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes, canteens…"
            maxLength={80}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilters > 0 && (
            <Badge className="ml-1 size-5 justify-center p-0">{activeFilters}</Badge>
          )}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className={cn("lg:block", showFilters ? "block" : "hidden")}>
          <div className="lg:sticky lg:top-24">{filterPanel}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="font-display text-lg font-semibold">No drops match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try widening the price range or clearing dietary tags.
              </p>
              <Button variant="outline" className="mt-5" onClick={reset}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <ItemCard key={item.id} item={item} stock={stockLeft[item.id] ?? item.quantity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
