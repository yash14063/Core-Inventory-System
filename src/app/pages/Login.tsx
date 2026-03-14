import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, Package } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const ok = login(username, password);
    if (!ok) {
      setError("Invalid credentials. Try admin / admin123.");
      setSubmitting(false);
      return;
    }

    toast.success("Welcome back");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Package className="size-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              CoreInventory
            </p>
            <p className="text-xs text-slate-500">
              Sign in to manage your stock
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Use the demo credentials to explore the dashboard.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-1 font-mono text-[11px]">
                admin / admin123
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="mt-2 w-full gap-2"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

