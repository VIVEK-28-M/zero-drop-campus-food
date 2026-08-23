import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ZeroDrop" },
      {
        name: "description",
        content:
          "Answers on food quality, hygiene standards, pickup windows, refunds and cancellations on ZeroDrop.",
      },
      { property: "og:title", content: "FAQ — ZeroDrop" },
      { property: "og:description", content: "Food quality, hygiene, pickup windows and refund policies — answered." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

const SECTIONS = [
  {
    title: "Food quality & hygiene",
    items: [
      { q: "Is surplus food safe to eat?", a: "Yes. ZeroDrop listings are surplus — freshly prepared food that simply outlasted footfall, never leftovers from plates. Every vendor must hold a valid FSSAI license, and items can only be listed within their safe consumption window." },
      { q: "What hygiene standards do vendors follow?", a: "All partner canteens follow FSSAI handling guidelines: covered storage, food-grade packaging for pickups, and staff hygiene checks. Vendors with repeated quality complaints are suspended after review." },
      { q: "How do I know if the food is still fresh?", a: "Each listing shows when it was prepared/listed, and reviews from other students include freshness tags like Fresh, Hot or Crisp. Ratings below 3.5 trigger automatic vendor review." },
    ],
  },
  {
    title: "Pickup windows",
    items: [
      { q: "How long do I have to pick up my order?", a: "Every order has a pickup window (usually 30–45 minutes, shown at checkout and on your pass). The pass screen has a live countdown so you never lose track." },
      { q: "What happens if I miss my pickup window?", a: "The vendor may release your portion to walk-in buyers after the window closes. Prepaid orders that go unclaimed are refunded at 50% — the vendor still bore the holding cost." },
      { q: "Can someone else pick up my order?", a: "Yes — just share your order code or QR pass screenshot with a friend. Anyone presenting a valid code within the window can collect." },
    ],
  },
  {
    title: "Refunds & cancellations",
    items: [
      { q: "Can I cancel an order?", a: "Yes, free cancellation within 5 minutes of placing a prepaid order from My Orders. After that, cancellations before the pickup window get a 50% refund since the food was held for you." },
      { q: "What if the food is bad or the order is wrong?", a: "Report it from the order page within 6 hours with a photo. Verified quality issues get a 100% instant refund to your original payment method or campus wallet." },
      { q: "How do Pay-at-Counter refunds work?", a: "Since you pay on pickup, there's nothing to refund — just don't show up and the order auto-cancels. Repeated no-shows (3+) temporarily limit counter-payment privileges." },
    ],
  },
  {
    title: "Pricing & payments",
    items: [
      { q: "How does decay pricing work?", a: "Vendors set a base price, a floor price and a closing time. Standard listings drop every 30 minutes; aggressive ones every 10. The price you see at checkout is locked for your order even if it drops further." },
      { q: "Which payment methods are supported?", a: "UPI ID, QR scan, campus wallet, saved cards, and Pay at Counter (cash). Online payments settle to vendors daily." },
    ],
  },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything about quality, pickups, refunds and decay pricing.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-bold text-primary">{section.title}</h2>
            <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border/70 bg-card px-5">
              {section.items.map((item, i) => (
                <AccordionItem key={item.q} value={`${section.title}-${i}`}>
                  <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-border/70 surface-gradient p-8 text-center">
        <h2 className="font-display text-2xl font-bold">Still stuck?</h2>
        <p className="mt-2 text-muted-foreground">
          Try the help center chatbot or the campus waste calculator.
        </p>
        <Button asChild className="mt-5 glow-primary">
          <Link to="/help">Open Help Center</Link>
        </Button>
      </div>
    </div>
  );
}
