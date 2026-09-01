import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Coins,
  GraduationCap,
  HandHeart,
  Leaf,
  MapPin,
  QrCode,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Timer,
  TrendingDown,
  Trophy,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { ItemCard } from "@/components/ItemCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { CAMPUS_STATS, ITEMS, LEADERBOARD, VENDORS, ZONES } from "@/lib/data";
// import { inr, timeLeft } from "@/lib/pricing";
import { currentPrice, inr, timeLeft } from "@/lib/pricing";

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

const BENEFITS = [
  {
    icon: TrendingDown,
    title: "Live decay pricing",
    body: "Every plate re-prices itself on a timer. Refresh and the number is lower — no coupon codes, no haggling.",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI-verified stalls",
    body: "Only licensed campus canteens can list. Each stall shows its licence number, zone and live rating.",
  },
  {
    icon: QrCode,
    title: "One-scan pickup",
    body: "Your order becomes a QR pass with a 6-character code. Show it, collect it, done in under 20 seconds.",
  },
  {
    icon: Wallet,
    title: "Pay how you want",
    body: "UPI, campus wallet, card, or pay at the counter. Refunds land back the same way within a day.",
  },
  {
    icon: Bell,
    title: "Drop alerts",
    body: "Favourite a stall and get pinged the moment it posts a clearance batch near your block.",
  },
  {
    icon: HandHeart,
    title: "Nothing hits the bin",
    body: "Unsold plates at closing time are routed to the campus donation desk instead of the waste stream.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya S.",
    role: "B.Tech CSE · H2 Nilgiri",
    text: "I eat dinner for ₹30 most nights now. The dosa is still crisp when I pick it up — it's surplus, not leftovers.",
    rating: 5,
  },
  {
    name: "Kabir R.",
    role: "Owner · Spice Route",
    text: "We used to throw away nine kilos of biryani a week. ZeroDrop clears it before closing and settles by UPI daily.",
    rating: 5,
  },
  {
    name: "Meera J.",
    role: "M.Sc · Day Scholar",
    text: "The Jain thali is packed separately and the pass system means no queue. I've saved ₹3,400 this semester.",
    rating: 4,
  },
];

const FAQ_PREVIEW = [
  {
    q: "Is this leftover food?",
    a: "No. Listings are surplus prepared during the same service window that did not sell. Every listing carries a hard pickup deadline, and stalls cannot relist an expired batch.",
  },
  {
    q: "How low does the price actually go?",
    a: "Each item has a floor price set by the vendor — usually around 70% of the base clearance price. Standard listings step down every 30 minutes, aggressive ones every 10.",
  },
  {
    q: "What if I miss my pickup window?",
    a: "The pass expires and the plate is released back to the marketplace or the donation desk. First missed pickup in a month is refunded to your campus wallet.",
  },
  {
    q: "Does it cost vendors anything to join?",
    a: "Onboarding is free. ZeroDrop keeps a small flat fee per cleared plate, deducted before the daily payout.",
  },
];

function LandingPage() {
  const now = useNow();
  const meals = useCountUp(CAMPUS_STATS.mealsRescued);
  const kg = useCountUp(CAMPUS_STATS.kgSaved);
  const money = useCountUp(CAMPUS_STATS.moneySaved);

  const live = [...ITEMS]
    .filter((i) => (now ? timeLeft(i, now) > 0 : true))
    .sort((a, b) => (now ? timeLeft(a, now) - timeLeft(b, now) : 0));
  const liveDrops = live.slice(0, 4);
  const moreDrops = live.slice(4, 8);
  const tickerItems = [...live, ...live];

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
        {/* <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32"> */}
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <div className="max-w-2xl">
            {/* <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur"> */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-black/25 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <span className="size-2 rounded-full bg-primary animate-pulse-soft" />
              {now ? liveDrops.length * 3 + 7 : "—"} live clearance drops right now
            </div>
            {/* <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Good food shouldn't die at <span className="text-primary">closing time.</span>
            </h1> */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance text-white sm:text-6xl">
              Good food shouldn't die at{" "}
              <span className="text-[#D4E157]">closing time.</span>
            </h1>
            {/* <p className="mt-5 max-w-xl text-lg text-muted-foreground"> */}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
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
            {/* <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"> */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-primary" /> FSSAI-verified stalls
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4 text-primary" /> Avg. pickup in 18 min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 text-urgency" /> 4.6 average stall rating
              </span>
            </div>
          </div>

          {/* Live counters */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {
            [
  {
    icon: UtensilsCrossed,
    label: "Meals available now",
    value: "50+",
  },
  {
    icon: Leaf,
    label: "Potential waste reduction",
    value: "Up to 70%",
  },
  {
    icon: Coins,
    label: "Student savings",
    value: "₹12–₹32",
  },
  {
    icon: Timer,
    label: "Pricing",
    value: "Dynamic",
  },
]
            .map((s) => (
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

      {/* PRICE TICKER */}
      <div className="overflow-hidden border-y border-border/60 bg-card/50 py-3">
        <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
          {tickerItems.map((i, idx) => (
            <span key={`${i.id}-${idx}`} className="flex items-center gap-2 text-sm">
              <span className="size-1.5 rounded-full bg-urgency" />
              <span className="font-medium">{i.name}</span>
              <span className="text-muted-foreground line-through">{inr(i.basePrice)}</span>
              {/* <span className="font-display font-bold text-primary">down to {inr(i.floorPrice)}</span> */}
              <span className="font-display font-bold text-primary">
                → {inr(now ? currentPrice(i, now) : i.basePrice)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* LIVE DROPS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-urgency">
              <Timer className="size-4" />
              Dropping right now
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">Ending soon</h2>
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

        {moreDrops.length > 0 && (
          <>
            <h3 className="mb-6 mt-14 font-display text-2xl font-bold">
              Fresh on the board <span className="text-muted-foreground">· more time to decide</span>
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {moreDrops.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* WHY ZERODROP */}
      <section className="border-y border-border/60 bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="size-4" /> Why ZeroDrop
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-balance">
              Built for the last hour of the canteen day
            </h2>
            <p className="mt-3 text-muted-foreground">
              Not a delivery app, not a coupon site. A clearance layer that sits on top of the
              kitchens already on your campus.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
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
      <section className="border-y border-border/60 bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Standard decay", "−5% every 30 min, gentle glide to the floor price."],
                  ["Aggressive decay", "−5% every 10 min for batches closing soon."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="font-display font-bold">{t}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
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
        </div>
      </section>

      {/* ZONES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <MapPin className="size-4" /> Coverage
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">Live in four campus zones</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/marketplace">
              Filter by zone <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ZONES.filter((z) => z !== "All Zones").map((zone) => {
            const stalls = VENDORS.filter((v) => v.zone === zone);
            return (
              <div
                key={zone}
                className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
              >
                <MapPin className="size-5 text-primary" />
                <p className="mt-3 font-display text-lg font-bold">{zone}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stalls.length} partner {stalls.length === 1 ? "stall" : "stalls"}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {stalls.map((s) => s.name).join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="border-y border-border/60 bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-urgency">
                <Trophy className="size-4" /> Rescue leaderboard
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-balance">
                The canteens keeping the most food out of the bin
              </h2>
              <p className="mt-4 text-muted-foreground">
                Updated every night from cleared pickups. Stalls at the top get featured placement
                on the marketplace board the next day.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link to="/about">See campus impact</Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card">
              {LEADERBOARD.slice(0, 6).map((v, i) => (
                <div
                  key={v.name}
                  className="flex items-center gap-4 border-b border-border/50 px-5 py-4 last:border-0"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                      i === 0
                        ? "bg-urgency text-urgency-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.meals.toLocaleString("en-IN")} meals rescued
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-primary">{v.kg} kg</p>
                    <p className="text-xs text-muted-foreground">{inr(v.recovered)} recovered</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-balance">
            Students eat better. Vendors waste less.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Feedback from the first two semesters on campus.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl border border-border/60 bg-card p-6"
            >
              <Quote className="size-7 text-primary/60" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{t.text}”
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-urgency">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <figcaption className="mt-3 border-t border-border/50 pt-3">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="border-y border-border/60 bg-card/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold">Common questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ_PREVIEW.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/faq">
                Read the full FAQ <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="surface-gradient overflow-hidden rounded-3xl border border-border/70 px-6 py-14 text-center sm:px-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-primary">
            <Leaf className="size-7" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold text-balance sm:text-4xl">
            One plate rescued tonight is one less in the bin tomorrow.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join {CAMPUS_STATS.mealsRescued.toLocaleString("en-IN")} rescued meals across{" "}
            {CAMPUS_STATS.canteens} campus canteens.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <Link to="/register/student">
                Create a student account <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register/vendor">List your canteen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
