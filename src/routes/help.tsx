import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, LifeBuoy, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { inr } from "@/lib/pricing";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center & Waste Calculator — ZeroDrop" },
      {
        name: "description",
        content:
          "Get instant answers from the ZeroDrop assistant and estimate your canteen's food waste, CO₂ and revenue recovery with the calculator.",
      },
      { property: "og:title", content: "Help Center & Waste Calculator — ZeroDrop" },
      { property: "og:description", content: "Instant answers plus a campus food-waste calculator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const CANNED: { match: string[]; reply: string }[] = [
  { match: ["refund", "cancel"], reply: "Free cancellation within 5 minutes of ordering. After that, cancelling before the pickup window refunds 50%. Quality issues reported within 6 hours with a photo get a 100% refund." },
  { match: ["pickup", "late", "window"], reply: "Your pickup window is 30–45 minutes and is shown on your QR pass with a live countdown. Miss it and the vendor may release the portion; prepaid unclaimed orders refund at 50%." },
  { match: ["price", "decay", "discount"], reply: "Prices decay in steps from the base price toward the floor price as closing time nears — every 30 minutes for standard listings, every 10 for aggressive ones. Your price locks at checkout." },
  { match: ["safe", "quality", "hygiene", "fssai"], reply: "Every partner canteen holds a valid FSSAI license. Listings are surplus prepared food within their safe consumption window, never plate leftovers." },
  { match: ["vendor", "register", "sell"], reply: "Canteens can join from the vendor sign-up page — verification is same-day once your FSSAI license is uploaded." },
];

function answer(q: string) {
  const t = q.toLowerCase();
  const hit = CANNED.find((c) => c.match.some((m) => t.includes(m)));
  return (
    hit?.reply ??
    "I can help with pickups, refunds, decay pricing, food safety and vendor onboarding. Try asking about one of those, or check the FAQ page."
  );
}

function HelpPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm the ZeroDrop assistant. Ask me about pickups, refunds or decay pricing." },
  ]);
  const [input, setInput] = useState("");

  const [meals, setMeals] = useState(600);
  const [wastePct, setWastePct] = useState(12);
  const [price, setPrice] = useState(60);

  const wastedMeals = Math.round((meals * wastePct) / 100);
  const wastedKg = wastedMeals * 0.35;
  const co2 = wastedKg * 2.5;
  const lostRevenue = wastedMeals * price;
  const recoverable = Math.round(lostRevenue * 0.55);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }, { from: "bot", text: answer(q) }]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <LifeBuoy className="size-4" /> Help center
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
          Answers, and the numbers behind them.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ask the assistant anything, or model exactly how much your canteen loses to waste each day.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="flex h-[30rem] flex-col rounded-3xl border border-border/70 bg-card p-6">
          <h2 className="font-display text-xl font-bold">ZeroDrop assistant</h2>
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.from === "bot"
                    ? "bg-muted/60 text-foreground"
                    : "ml-auto bg-primary text-primary-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How do refunds work?"
              maxLength={200}
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-border/70 surface-gradient p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Calculator className="size-5 text-primary" /> Campus waste calculator
          </h2>
          <div className="mt-6 space-y-7">
            <Row label="Meals prepared per day" value={String(meals)}>
              <Slider value={[meals]} min={100} max={2000} step={50} onValueChange={([v]) => setMeals(v ?? meals)} />
            </Row>
            <Row label="Typical surplus rate" value={`${wastePct}%`}>
              <Slider value={[wastePct]} min={2} max={35} onValueChange={([v]) => setWastePct(v ?? wastePct)} />
            </Row>
            <Row label="Average meal price" value={inr(price)}>
              <Slider value={[price]} min={20} max={250} step={5} onValueChange={([v]) => setPrice(v ?? price)} />
            </Row>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Metric v={`${wastedMeals}`} l="meals wasted per day" />
            <Metric v={`${wastedKg.toFixed(0)} kg`} l="food binned per day" />
            <Metric v={`${(co2 / 1000).toFixed(2)} t`} l="CO₂ per day" />
            <Metric v={inr(recoverable)} l="recoverable daily with ZeroDrop" />
          </div>

          <Button asChild className="mt-6 w-full glow-primary">
            <Link to="/register/vendor">List your surplus</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-display font-bold text-primary">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Metric({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-4">
      <p className="font-display text-2xl font-bold text-primary">{v}</p>
      <p className="mt-1 text-xs text-muted-foreground">{l}</p>
    </div>
  );
}
