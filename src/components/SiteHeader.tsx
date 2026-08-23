import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut, Menu, ShoppingBag, Store, UserRound } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/help", label: "Help & Calculator" },
] as const;

export function SiteHeader() {
  const { role, userName, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashLink =
    role === "vendor"
      ? { to: "/vendor/dashboard", label: "Vendor Console", icon: Store }
      : { to: "/student/orders", label: "My Orders", icon: ShoppingBag };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Zero<span className="text-primary">Drop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              activeOptions={{ exact: false }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {role ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to={dashLink.to}>
                  <dashLink.icon className="size-4" />
                  {dashLink.label}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">
                  <UserRound className="size-4" />
                  Sign in
                </Link>
              </Button>
              <Button asChild size="sm" className="glow-primary">
                <Link to="/marketplace">Rescue Food</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-card">
            <div className="mt-8 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "bg-accent text-accent-foreground" }}
                  className="rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  activeOptions={{ exact: false }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="my-3 border-t border-border" />
              {role ? (
                <>
                  <Link
                    to={dashLink.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-primary"
                  >
                    {dashLink.label}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate({ to: "/" });
                    }}
                    className="rounded-lg px-4 py-3 text-left text-base font-medium text-muted-foreground hover:bg-accent/60"
                  >
                    Sign out ({userName.split(" ")[0]})
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent/60"
                  >
                    Sign in
                  </Link>
                  <div className="px-4 pt-2">
                    <Button asChild className="w-full glow-primary">
                      <Link to="/marketplace" onClick={() => setOpen(false)}>
                        Rescue Food
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
