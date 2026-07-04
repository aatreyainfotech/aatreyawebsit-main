import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../AuthContext";
import { toast } from "sonner";
import { LogIn, Loader2, Phone, Lock } from "lucide-react";

function LoginForm() {
  const { login, user, loading } = useAuth();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-[#060A14] flex items-center justify-center text-[#A0AEC0]">Loading…</div>;
  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      toast.error("Please enter mobile number and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(mobile.trim(), password);
      toast.success("Welcome back.");
      navigate("/admin", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060A14] flex items-center justify-center px-6 py-10 relative overflow-hidden" data-testid="admin-login-page">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 radial-gold pointer-events-none" />
      <div className="absolute inset-0 radial-saffron pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm border border-[#D4AF37]/60 flex items-center justify-center font-display text-[#D4AF37] text-2xl">आ</div>
            <div className="text-left">
              <div className="font-display text-white text-2xl">Aatreya</div>
              <div className="label-eyebrow">CMS · Admin Panel</div>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass-strong p-8 space-y-5"
          data-testid="admin-login-form"
        >
          <div>
            <div className="label-eyebrow">Secure Admin Access</div>
            <h1 className="mt-2 font-display font-light text-white text-3xl">Sign in to your account</h1>
            <p className="mt-2 text-sm text-[#A0AEC0]">Use your registered mobile number and password.</p>
          </div>

          <div>
            <label className="label-eyebrow" htmlFor="mobile">Mobile Number*</label>
            <div className="mt-2 relative">
              <Phone size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#D4AF37]" />
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 8644297366"
                required
                autoFocus
                data-testid="admin-login-mobile"
                className="w-full bg-[#0A1128] border border-[#D4AF37]/20 focus:border-[#FF9933] pl-10 pr-4 py-3 text-[#F8F9FA] rounded-sm"
              />
            </div>
          </div>

          <div>
            <label className="label-eyebrow" htmlFor="password">Password*</label>
            <div className="mt-2 relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#D4AF37]" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                data-testid="admin-login-password"
                className="w-full bg-[#0A1128] border border-[#D4AF37]/20 focus:border-[#FF9933] pl-10 pr-4 py-3 text-[#F8F9FA] rounded-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="admin-login-submit"
            className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <LogIn size={16} /></>}
          </button>

          <p className="text-xs text-[#A0AEC0] text-center">
            Protected by JWT · session valid for 24 hours.
          </p>
        </form>

        <div className="mt-6 text-center text-xs text-[#A0AEC0]">
          <a href="/" className="hover:text-[#FF9933]" data-testid="admin-login-back-to-site">← Back to public website</a>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
