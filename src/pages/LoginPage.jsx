import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Logo from "../components/Logo";
import Field from "../components/ui/Field";
import { Starburst, Wave } from "../components/ui/Decor";
import { useAuth } from "../context/AuthContext";
import { USE_MOCKS } from "../api/client";

export default function LoginPage() {
  const { login, logout, isAdmin, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (ready && isAdmin) return <Navigate to={redirectTo} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError("Renseigne ton email et ton mot de passe.");
      return;
    }
    setSubmitting(true);
    try {
      const u = await login(form);
      if (u?.role !== "admin") {
        logout();
        setError("Ce compte n'a pas acces au dashboard.");
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-navy">
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          <Starburst className="absolute -right-6 -top-10 z-10 h-24 w-24 rotate-12">Admin</Starburst>
          <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-8 shadow-2xl shadow-black/30 sm:p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist">
                <Logo variant="icon" to={null} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
                <p className="mt-1 text-sm text-muted">Espace de gestion de la plateforme</p>
              </div>
            </div>

            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                className="field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Mot de passe">
              <input
                type="password"
                autoComplete="current-password"
                className="field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" className="btn-primary mt-1 !py-4" disabled={submitting}>
              <ShieldCheck size={16} /> {submitting ? "Connexion…" : "Se connecter"}
            </button>

            {USE_MOCKS && (
              <p className="rounded-2xl bg-accent-soft px-4 py-3 text-center text-xs font-medium text-accent">
                Demo — admin@meredian.dev / admin1234
              </p>
            )}
          </form>
        </div>
      </div>
      <Wave className="text-ground" />
    </div>
  );
}
