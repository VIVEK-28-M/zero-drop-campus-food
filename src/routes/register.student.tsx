import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOSTEL_BLOCKS } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register/student")({
  head: () => ({
    meta: [
      { title: "Student Sign-up — ZeroDrop" },
      {
        name: "description",
        content: "Create a ZeroDrop student account with campus verification, roll number and hostel block to start rescuing surplus meals.",
      },
      { property: "og:title", content: "Student Sign-up — ZeroDrop" },
      { property: "og:description", content: "Verify your campus identity and start rescuing surplus meals at decaying prices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentRegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  roll: z.string().trim().min(4, "Enter a valid roll number").max(20),
  email: z.string().trim().email("Enter a valid campus email").max(120),
  block: z.string().min(1, "Select your hostel block"),
  password: z.string().min(6, "Password must be at least 6 characters").max(64),
});

function StudentRegisterPage() {
  const { login, setHostelBlock } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", roll: "", email: "", block: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      for (const i of res.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    if (!agree) {
      toast.error("Accept the campus food safety terms to continue");
      return;
    }
    setErrors({});
    setHostelBlock(form.block);
    login("student", form.name);
    toast.success("Campus identity verified!", { description: `${form.roll} · ${form.block}` });
    navigate({ to: "/marketplace" });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-primary">
          <GraduationCap className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">Student sign-up</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Campus-verified accounts only. Takes about 40 seconds.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card p-6">
        <Field label="Full name" error={errors["name"]}>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aarav Verma" maxLength={80} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Roll number" error={errors["roll"]}>
            <Input value={form.roll} onChange={(e) => set("roll", e.target.value)} placeholder="22BCS1041" maxLength={20} />
          </Field>
          <Field label="Hostel / dorm block" error={errors["block"]}>
            <Select value={form.block} onValueChange={(v) => set("block", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {HOSTEL_BLOCKS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Campus email" error={errors["email"]}>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="aarav@campus.edu" maxLength={120} />
        </Field>
        <Field label="Password" error={errors["password"]}>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 6 characters" maxLength={64} />
        </Field>

        <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
          <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-0.5" />
          <Label htmlFor="agree" className="text-xs font-normal leading-relaxed text-muted-foreground">
            I understand ZeroDrop lists surplus prepared food, agree to collect orders within my pickup
            window, and accept the campus food safety terms.
          </Label>
        </div>

        <Button type="submit" className="w-full glow-primary">
          <BadgeCheck className="size-4" /> Verify & create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
