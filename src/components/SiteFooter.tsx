import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

const COLS = [
  {
    title: "Platform",
    links: [
      { to: "/marketplace", label: "Marketplace" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/help", label: "Waste Calculator" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Students",
    links: [
      { to: "/register/student", label: "Student Sign-up" },
      { to: "/student/orders", label: "My Orders" },
      { to: "/student/impact", label: "My Impact" },
      { to: "/student/favorites", label: "Favorites" },
    ],
  },
  {
    title: "Vendors",
    links: [
      { to: "/register/vendor", label: "Vendor Onboarding" },
      { to: "/vendor/dashboard", label: "Vendor Console" },
      { to: "/vendor/add-item", label: "List Surplus" },
      { to: "/vendor/payouts", label: "Payouts" },
    ],
  },
  {
    title: "Campus",
    links: [
      { to: "/about", label: "Our Mission" },
      { to: "/admin/analytics", label: "Admin Analytics" },
      { to: "/help", label: "Help Center" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="size-5" />
              </span>
              <span className="font-display text-lg font-bold">
                Zero<span className="text-primary">Drop</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The hyper-local campus marketplace where surplus food meets dynamic pricing. Every
              meal rescued is money saved and waste prevented.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 ZeroDrop Campus Collective. Made for a zero-waste campus.</p>
          <p>Every plate counts. 🌱</p>
        </div>
      </div>
    </footer>
  );
}
