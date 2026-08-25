import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — ZeroDrop" },
      {
        name: "description",
        content: "Recover your ZeroDrop account with campus email OTP verification and set a new password.",
      },
      { property: "og:title", content: "Reset Password — ZeroDrop" },
      { property: "og:description", content: "OTP-based account recovery for ZeroDrop students and vendors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [resend, setResend] = useState(0);

  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);

  const sendOtp = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid campus email");
      return;
    }
    setStep(2);
    setResend(30);
    toast.success("OTP sent", { description: "Demo code: 481902" });
  };

  const verify = () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setStep(3);
    toast.success("Code verified");
  };

  const reset = () => {
    if (pw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password updated", { description: "Sign in with your new password." });
    navigate({ to: "/login" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-primary">
          {step === 1 ? <KeyRound className="size-6" /> : step === 2 ? <MailCheck className="size-6" /> : <ShieldCheck className="size-6" />}
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">
          {step === 1 ? "Reset your password" : step === 2 ? "Verify the code" : "Set a new password"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === 1
            ? "We'll send a 6-digit OTP to your campus email."
            : step === 2
              ? `Enter the code sent to ${email}`
              : "Choose a strong password you haven't used before."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`h-1.5 w-12 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      <div className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-card p-6">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fpemail">Campus email or roll number</Label>
              <Input
                id="fpemail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@campus.edu"
                maxLength={120}
              />
            </div>
            <Button onClick={sendOtp} className="w-full glow-primary">
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={verify} className="w-full glow-primary">
              Verify code
            </Button>
            <button
              disabled={resend > 0}
              onClick={() => {
                setResend(30);
                toast("OTP resent", { description: "Demo code: 481902" });
              }}
              className="w-full text-center text-sm text-muted-foreground disabled:opacity-50 hover:text-primary"
            >
              {resend > 0 ? `Resend code in ${resend}s` : "Resend code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="newpw">New password</Label>
              <Input
                id="newpw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="At least 6 characters"
                maxLength={64}
              />
            </div>
            <Button onClick={reset} className="w-full glow-primary">
              Update password
            </Button>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
