import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, LineChart, Recycle, Sprout } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CAMPUS_STATS } from "@/lib/data";
import { inr } from "@/lib/pricing";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Mission — ZeroDrop" },
      {
        name: "description",
        content:
          "ZeroDrop's mission: a zero-waste campus. See the impact model, our story, and how dynamic pricing prevents food waste.",
      },
      { property: "og:title", content: "Our Mission — ZeroDrop" },
      { property: "og:description", content: "Building the zero-waste campus, one rescued plate at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [canteens, setCanteens] = useState(14);
  const [participation, setParticipation] = useState(62);

  const dailySurplusKg = canteens * 9.5;
  const rescuedKg = (dailySurplusKg * participation) / 100;
  const yearlyKg = rescuedKg * 260;
  const co2 = yearlyKg * 2.5;
  const savings = yearlyKg * 105;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-3xl">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sprout className="size-4" /> Our mission
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-balance sm:text-5xl">
          A campus where no meal is wasted.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Every evening, campus canteens throw away perfectly good food because supply outlasts
          footfall. ZeroDrop turns that surplus into opportunity: vendors list extra portions,
          prices decay as closing time approaches, and students rescue great food for less.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Recycle, v: `${(CAMPUS_STATS.kgSaved / 1000).toFixed(1)} t`, l: "food waste prevented this year" },
          { icon: Leaf, v: `${CAMPUS_STATS.co2Offset} t`, l: "CO₂ emissions offset" },
          { icon: LineChart, v: `${CAMPUS_STATS.mealsRescued.toLocaleString("en-IN")}`, l: "meals rescued & counting" },
          { icon: Sprout, v: inr(CAMPUS_STATS.moneySaved), l: "back in student pockets" },
        ].map((s) => (
          <div key={s.l} className="surface-gradient rounded-2xl border border-border/70 p-6">
            <s.icon className="size-6 text-primary" />
            <p className="mt-3 font-display text-3xl font-bold">{s.v}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Impact modeler */}
      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-8">
          <h2 className="font-display text-2xl font-bold">Campus impact modeler</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Drag the sliders to model what ZeroDrop could do at your campus scale.
          </p>
          <div className="mt-8 space-y-8">
            <div>
              <div className="mb-3 flex justify-between text-sm">
                <span className="font-medium">Participating canteens</span>
                <span className="font-display font-bold text-primary">{canteens}</span>
              </div>
              <Slider value={[canteens]} min={2} max={40} onValueChange={([v]) => setCanteens(v ?? canteens)} />
            </div>
            <div>
              <div className="mb-3 flex justify-between text-sm">
                <span className="font-medium">Student participation rate</span>
                <span className="font-display font-bold text-primary">{participation}%</span>
              </div>
              <Slider value={[participation]} min={10} max={100} onValueChange={([v]) => setParticipation(v ?? participation)} />
            </div>
          </div>
        </div>
        <div className="grid content-start gap-4">
          {[
            [`${Math.round(rescuedKg)} kg`, "surplus rescued per day", "primary"],
            [`${(yearlyKg / 1000).toFixed(1)} tonnes`, "kept out of landfills per academic year", "primary"],
            [`${(co2 / 1000).toFixed(1)} t CO₂`, "emissions offset per year", "urgency"],
            [inr(savings), "collective student savings per year", "urgency"],
          ].map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between rounded-2xl border border-border/70 bg-card px-6 py-5">
              <span className="font-display text-2xl font-bold text-primary">{v}</span>
              <span className="max-w-[55%] text-right text-sm text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <h2 className="font-display text-3xl font-bold">Born in a mess hall queue.</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            ZeroDrop was created in 2026 with a simple goal: to make sure good food
            doesn't go to waste just because the day is ending. We wanted to create
            an easy way for campus canteens to sell surplus food while giving students
            access to affordable meals before closing time.
          </p>
          <p>
            The fix seemed obvious: a price that falls as the clock runs out, a QR pass instead of a
            queue, and a WhatsApp ping when your favourite canteen lists a drop. Today,
            {` ${CAMPUS_STATS.canteens} canteens`} clear their surplus through ZeroDrop every single
            day.
          </p>
          <p>
            Our goal for 2026: bring the model to every campus in the country — and make
            "canteen closing time" mean <em className="text-foreground">sold out</em>, never
            <em className="text-foreground"> thrown out</em>.
          </p>
          <Button asChild className="mt-2 glow-primary">
            <Link to="/marketplace">Join the rescue</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
