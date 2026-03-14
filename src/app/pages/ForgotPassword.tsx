import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, RefreshCw } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function ForgotPassword() {
  const navigate = useNavigate();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset
  );
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const updatePassword = useAuthStore((state) => state.updatePassword);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const generated = requestPasswordReset(email);

    // In a real app, call your email provider API here with API keys
    // using generated as the OTP code. For this demo, we just log it:
    console.log("OTP sent to email:", email, "code:", generated);
    toast.info("OTP sent to your email (demo). Check console for code.");

    setStep("otp");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!verifyOtp(otp)) {
      toast.error("Invalid OTP code");
      setSubmitting(false);
      return;
    }

    updatePassword(newPassword);
    toast.success("Password updated. You can now log in.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Forgot password
          </h1>
          <p className="text-sm text-slate-500">
            We’ll send a one-time code to your email so you can set a new
            password.
          </p>
        </div>

        {step === "email" ? (
          <form
            onSubmit={handleSendOtp}
            className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              Send OTP
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-slate-500"
              onClick={() => navigate("/login")}
            >
              Back to login
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">OTP code</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update password"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-1 flex w-full items-center justify-center gap-2 text-xs text-slate-500"
              onClick={() => setStep("email")}
            >
              <RefreshCw className="size-3" />
              Resend code
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

