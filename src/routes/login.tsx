import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Leaf, Lock, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ZeroDrop" },
      {
        name: "description",
        content: "Sign in to ZeroDrop as a student with your roll number or as a canteen vendor with your canteen ID.",
      },
      { property: "og:title", content: "Sign In — ZeroDrop" },
      { property: "og:description", content: "Student and vendor sign-in for the ZeroDrop campus food rescue marketplace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("22BCS1041");
  const [vendorId, setVendorId] = useState("CANTEEN-A03");
  const [password, setPassword] = useState("");

  const submit = (role: "student" | "vendor") => (e: React.FormEvent) => {
    e.preventDefault();
    const id = role === "student" ? studentId.trim() : vendorId.trim();
    if (!id) {
      toast.error(role === "student" ? "Enter your roll number or email" : "Enter your canteen ID");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    login(role, role === "student" ? "Aarav Verma" : "South Stories");
    navigate({ to: role === "student" ? "/marketplace" : "/vendor/dashboard" });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-primary">
          <Leaf className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to rescue food or clear your surplus.
        </p>
      </div>

      <Tabs defaultValue="student" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student" className="gap-2">
            <GraduationCap className="size-4" /> Student
          </TabsTrigger>
          <TabsTrigger value="vendor" className="gap-2">
            <Store className="size-4" /> Vendor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <form
            onSubmit={submit("student")}
            className="space-y-4 rounded-2xl border border-border/70 bg-card p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="roll">Roll number or campus email</Label>
              <Input
                id="roll"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="22BCS1041 or you@campus.edu"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw1">Password</Label>
              <Input
                id="pw1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                maxLength={64}
              />
            </div>
            <Button type="submit" className="w-full glow-primary">
              <Lock className="size-4" /> Sign in as student
            </Button>
            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
              <Link to="/register/student" className="font-medium text-primary hover:underline">
                Create account
              </Link>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="vendor">
          <form
            onSubmit={submit("vendor")}
            className="space-y-4 rounded-2xl border border-border/70 bg-card p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="cid">Canteen ID</Label>
              <Input
                id="cid"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="CANTEEN-A03"
                maxLength={60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw2">Password</Label>
              <Input
                id="pw2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                maxLength={64}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-urgency text-urgency-foreground hover:bg-urgency/90 glow-urgency"
            >
              <Lock className="size-4" /> Sign in as vendor
            </Button>
            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
              <Link to="/register/vendor" className="font-medium text-urgency hover:underline">
                Onboard canteen
              </Link>
            </div>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Demo mode — any password of 4+ characters signs you in.
      </p>
    </div>
  );
}
