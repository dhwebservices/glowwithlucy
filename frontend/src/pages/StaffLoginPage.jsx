import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAdminAuth } from "../context/AdminAuthContext";

export function StaffLoginPage() {
  const { authenticated, login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authenticated) {
    return <Navigate to="/staff" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5EEE4] pt-20">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:flex flex-col justify-between bg-[#2E2922] p-12 text-[#F7F2EB]">
          <div>
            <p className="text-sm text-[#DCCDBA]">Staff access</p>
            <h1 className="mt-4 max-w-md text-5xl font-serif">
              Manage orders, delivery progress, and promo codes in one place.
            </h1>
          </div>
          <p className="max-w-sm text-[#DCCDBA]">
            This area is for Lucy only. Once signed in, you can review each
            candle order, update statuses, and create or edit offers for the shop.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-14">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[28px] border border-[#D8CEC0] bg-white/90 p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEE2D3] text-[#2E2922]">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-4xl font-serif text-[#2E2922]">
              Staff login
            </h2>
            <p className="mt-3 text-[#6B6358]">
              Use the private Glow With Lucy staff credentials to open the order
              dashboard and promo code manager.
            </p>

            <label className="mt-8 block">
              <span className="mb-2 block text-sm text-[#6B6358]">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="form-input w-full rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-3 text-[#2E2922]"
                autoComplete="email"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm text-[#6B6358]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="form-input w-full rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-3 text-[#2E2922]"
                autoComplete="current-password"
              />
            </label>

            {error ? (
              <p className="mt-5 rounded-2xl bg-[#F5E4DE] px-4 py-3 text-sm text-[#8A3F2B]">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-8 w-full rounded-full py-6"
            >
              {submitting ? "Signing in..." : "Enter dashboard"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
