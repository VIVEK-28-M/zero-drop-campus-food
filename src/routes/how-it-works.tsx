import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeIndianRupee,
  BellRing,
  ChefHat,
  ClipboardList,
  GraduationCap,
  QrCode,
  ScanLine,
  Store,
  Timer,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — ZeroDrop" },
      {
        name: "description",
        content:
          "Step-by-step guide to ZeroDrop: students rescue surplus food with QR pickup passes, vendors clear stock with dynamic decay pricing.",
      },
      { property: "og:title", content: "How It Works — ZeroDrop" },
      { property: "og:description", content: "Student self-pickup and vendor clearance, explained step by step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

const STUDENT_STEPS = [
  { icon: BellRing, title: "Get alerted", text: "Follow favourite canteens and toggle price-drop alerts. We ping you on WhatsApp the moment a listing hits your target price." },
  { icon: TrendingDown, title: "Watch the decay", text: "Every item's price curve is public. Standard listings drop every 30 min, aggressive ones every 10 min. Time your move." },
  { icon: Wallet, title: "Pay your way", text: "UPI, QR scan, campus wallet, card — or choose Pay at Counter and settle in cash when you pick up." },
  { icon: QrCode, title: "Get your pass", text: "Checkout instantly generates a unique order code and QR pass with a live pickup countdown." },
  { icon: ScanLine, title: "Scan & enjoy", text: "Show the pass at the counter inside your pickup window. The vendor scans it, marks it picked up, done." },
];

const VENDOR_STEPS = [
  { icon: ClipboardList, title: "Onboard in minutes", text: "Register with your canteen name, block location, stall number and FSSAI license. Verification is same-day." },
  { icon: ChefHat, title: "List surplus in 10 seconds", text: "Item name, quantity, prices, closing time. Pick Standard (30-min) or Aggressive (10-min) decay and go live." },
  { icon: Timer, title: "Let decay do the work", text: "Prices tick down automatically toward your floor price. Override manually or mark sold out anytime." },
  { icon: ScanLine, title: "Verify passes", text: "Scan student QR codes or punch in order codes at the verification portal. One tap marks an order picked up." },
  { icon: BadgeIndianRupee, title: "Get paid daily", text: "Online UPI/wallet revenue settles daily. Track every transaction in the payout log." },
];

function StepColumn({
  title,
  icon: Icon,
  steps,
  cta,
  tone,
}: {
  title: string;
  icon: typeof GraduationCap;
  steps: typeof STUDENT_STEPS;
  cta: { to: string; label: string };
  tone: "primary" | "urgency";
}) {
  const chip = tone === "primary" ? "bg-primary text-primary-foreground glow-primary" : "bg-urgency text-urgency-foreground glow-urgency";
  const num = tone === "primary" ? "bg-primary/15 text-primary" : "bg-urgency/15 text-urgency";
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-8">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-xl ${chip}`}>
          <Icon className="size-5" />
        </span>
        <h2 className="font-display text-xl font-bold">{title}</h2>
      </div>
      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${num}`}>
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="pb-2">
              <p className="flex items-center gap-2 font-semibold">
                <s.icon className="size-4 text-muted-foreground" />
                {s.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button asChild className={`mt-4 ${tone === "primary" ? "glow-primary" : "bg-urgency text-urgency-foreground hover:bg-urgency/90 glow-urgency"}`}>
        <Link to={cta.to}>{cta.label}</Link>
      </Button>
    </div>
  );
}

function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">How ZeroDrop works</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A five-step loop for students and vendors that ends with empty shelves and full stomachs.
        </p>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <StepColumn
          title="Student self-pickup"
          icon={GraduationCap}
          steps={STUDENT_STEPS}
          cta={{ to: "/register/student", label: "Sign up as a student" }}
          tone="primary"
        />
        <StepColumn
          title="Vendor clearance"
          icon={Store}
          steps={VENDOR_STEPS}
          cta={{ to: "/register/vendor", label: "Onboard your canteen" }}
          tone="urgency"
        />
      </div>
    </div>
  );
}
