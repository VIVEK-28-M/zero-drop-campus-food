import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coins,
  GraduationCap,
  Leaf,
  QrCode,
  Store,
  Timer,
  TrendingDown,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { CAMPUS_STATS, ITEMS } from "@/lib/data";
import { inr, timeLeft } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroDrop — Campus Food Rescue Marketplace" },
      {
        name: "description",
        content:
          "Rescue surplus campus canteen food at live decaying prices. Students save up to 70%, vendors recover costs, the campus cuts food waste.",
      },
      { property: "og:title", content: "ZeroDrop — Campus Food Rescue Marketplace" },
      {
        property: "og:description",
        content: "Live dynamic pricing on surplus campus food. Rescue a meal, save money, cut waste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function useCountUp(target: number, durationMs = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

function LandingPage() {
  const now = useNow();
  const meals = useCountUp(CAMPUS_STATS.mealsRescued);
  const kg = useCountUp(CAMPUS_STATS.kgSaved);
  const money = useCountUp(CAMPUS_STATS.moneySaved);

  const liveDrops = [...ITEMS]
    .filter((i) => (now ? timeLeft(i, now) > 0 : true))
    .sort((a, b) => (now ? timeLeft(a, now) - timeLeft(b, now) : 0))
    .slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Campus canteen food counter with fresh surplus meals"
            width={1600}
            height={900}
            className="size-full object-cover"
          />
          <div className="hero-vignette absolute inset-0" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
              <span className="size-2 rounded-full bg-primary animate-pulse-soft" />
              {now ? liveDrops.length * 3 + 7 : "—"} live clearance drops right now
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Good food shouldn't die at <span className="text-primary">closing time.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              ZeroDrop is your campus marketplace where canteen surplus meets dynamic decay pricing
              — prices drop every few minutes until every plate is rescued.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow-primary">
                <Link to="/marketplace">
                  Browse live drops
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Live counters */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: UtensilsCrossed, label: "Meals rescued", value: meals.toLocaleString("en-IN") },
              { icon: Leaf, label: "Kg waste prevented", value: kg.toLocaleString("en-IN") },
              { icon: Coins, label: "Student savings", value: inr(money) },
              { icon: Store, label: "Partner canteens", value: String(CAMPUS_STATS.canteens) },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur"
              >
                <s.icon className="size-5 text-primary" />
                <p className="mt-2 font-display text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DROPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-urgency">
              <Timer className="size-4" />
              Dropping right now
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">Ending soonest</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/marketplace">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {liveDrops.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">Two sides, one zero-waste loop</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="surface-gradient rounded-3xl border border-border/70 p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-primary">
                <GraduationCap className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">For Students</h3>
              <ul className="mt-4 space-y-4">
                {[
                  ["Browse live drops", "Filter by zone, diet and price. Watch prices decay in real time."],
                  ["Pay & get a pass", "UPI, campus wallet, or pay-at-counter. Instant QR pickup pass."],
                  ["Scan & rescue", "Show your pass at the counter within the pickup window."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{t}</p>
                      <p className="text-sm text-muted-foreground">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6" variant="outline">
                <Link to="/register/student">Join as a student</Link>
              </Button>
            </div>

            <div className="surface-gradient rounded-3xl border border-border/70 p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-urgency text-urgency-foreground glow-urgency">
                <Store className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">For Vendors</h3>
              <ul className="mt-4 space-y-4">
                {[
                  ["List in 10 seconds", "Name, quantity, price, closing time. Pick a decay speed."],
                  ["Watch it clear", "Dynamic pricing finds buyers before closing time."],
                  ["Scan & settle", "Verify QR passes at the counter. Daily UPI payouts."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-urgency/15 font-display text-sm font-bold text-urgency">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{t}</p>
                      <p className="text-sm text-muted-foreground">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6" variant="outline">
                <Link to="/register/vendor">Onboard your canteen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DECAY EXPLAINER */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-urgency">
              <TrendingDown className="size-4" />
              Dynamic decay pricing
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-balance">
              The longer food sits, the less you pay.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every listing starts at a discounted base price and ticks down on a schedule —
              standard drops every 30 minutes, aggressive drops every 10. Wait for a better price,
              or grab it before someone else does. Either way, nothing hits the bin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="glow-primary">
                <Link to="/marketplace">See live prices</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/about">
                  <Leaf className="size-4" /> Our mission
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card p-8">
            <div className="flex items-center gap-4">
              <QrCode className="size-10 text-primary" />
              <div>
                <p className="font-display text-lg font-bold">Scan-to-pickup passes</p>
                <p className="text-sm text-muted-foreground">
                  Every order generates a unique verification code + QR. No queues, no confusion.
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                ["₹486K", "saved by students"],
                ["4.6 t", "food rescued"],
                ["11.6 t", "CO₂ offset"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-muted/50 p-4">
                  <p className="font-display text-xl font-bold text-primary">{v}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
