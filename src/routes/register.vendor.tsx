import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, Store, Upload } from "lucide-react";
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
import { ZONES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Field } from "./register.student";

export const Route = createFileRoute("/register/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Onboarding — ZeroDrop" },
      {
        name: "description",
        content: "Onboard your campus canteen to ZeroDrop: canteen name, block location, stall number and FSSAI license verification.",
      },
      { property: "og:title", content: "Vendor Onboarding — ZeroDrop" },
      { property: "og:description", content: "Turn daily surplus into recovered revenue. Onboard your canteen in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorRegisterPage,
});

const schema = z.object({
  canteen: z.string().trim().min(2, "Enter your canteen name").max(80),
  zone: z.string().min(1, "Select a campus zone"),
  stall: z.string().trim().min(1, "Enter your stall number").max(20),
  fssai: z.string().trim().regex(/^\d{14}$/, "FSSAI license must be 14 digits"),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  password: z.string().min(6, "Password must be at least 6 characters").max(64),
});

function VendorRegisterPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ canteen: "", zone: "", stall: "", fssai: "", phone: "", password: "" });
  const [uploaded, setUploaded] = useState(false);
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
    if (!uploaded) {
      toast.error("Upload your food license document to continue");
      return;
    }
    if (!agree) {
      toast.error("Accept the vendor hygiene commitment to continue");
      return;
    }
    setErrors({});
    login("vendor", form.canteen);
    toast.success("Canteen submitted for verification", {
      description: "Approved in demo mode — your console is live.",
    });
    navigate({ to: "/vendor/dashboard" });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-urgency text-urgency-foreground glow-urgency">
          <Store className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">Vendor onboarding</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Recover cost on surplus instead of binning it. Verification is same-day.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card p-6">
        <Field label="Canteen / stall name" error={errors["canteen"]}>
          <Input value={form.canteen} onChange={(e) => set("canteen", e.target.value)} placeholder="South Stories" maxLength={80} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Campus zone" error={errors["zone"]}>
            <Select value={form.zone} onValueChange={(v) => set("zone", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {ZONES.filter((z) => z !== "All Zones").map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Stall number" error={errors["stall"]}>
            <Input value={form.stall} onChange={(e) => set("stall", e.target.value)} placeholder="A-03" maxLength={20} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="FSSAI license number" error={errors["fssai"]}>
            <Input value={form.fssai} onChange={(e) => set("fssai", e.target.value)} placeholder="14-digit number" maxLength={14} inputMode="numeric" />
          </Field>
          <Field label="WhatsApp number" error={errors["phone"]}>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="9876543210" maxLength={10} inputMode="numeric" />
          </Field>
        </div>
        <Field label="Password" error={errors["password"]}>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 6 characters" maxLength={64} />
        </Field>

        <div>
          <Label className="mb-2 block">Food license document</Label>
          <button
            type="button"
            onClick={() => {
              setUploaded(true);
              toast.success("Document uploaded", { description: "fssai-license.pdf · pending review" });
            }}
            className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm transition-colors ${
              uploaded
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {uploaded ? <CheckCircle2 className="size-6" /> : <Upload className="size-6" />}
            {uploaded ? (
              <span className="font-medium">fssai-license.pdf uploaded · Pending review</span>
            ) : (
              <>
                <span className="font-medium">Upload FSSAI certificate</span>
                <span className="text-xs">PDF or JPG, up to 5 MB</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
          <Checkbox id="vagree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-0.5" />
          <Label htmlFor="vagree" className="text-xs font-normal leading-relaxed text-muted-foreground">
            I commit to listing only safe, freshly prepared surplus within its consumption window and
            to following FSSAI packaging and hygiene guidelines.
          </Label>
        </div>

        <Button type="submit" className="w-full bg-urgency text-urgency-foreground hover:bg-urgency/90 glow-urgency">
          <FileCheck2 className="size-4" /> Submit for verification
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already onboarded?{" "}
          <Link to="/login" className="font-medium text-urgency hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
