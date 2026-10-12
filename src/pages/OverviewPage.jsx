import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Wallet, Mail, FileCheck2, Users, ArrowRight } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import { Underlined } from "../components/ui/Decor";
import { formatPrice } from "../lib/format";

export default function OverviewPage() {
  const { user } = useAuth();
  const stats = useApi(() => api.adminStats(), []);
  const submissions = useApi(() => api.adminListWorkSubmissions(), []);
  const bookings = useApi(() => api.adminListBookings(), []);
  const messages = useApi(() => api.contactMessages(), []);

  const firstName = (user?.name || "").split(" ")[0];

  const cards = stats.data
    ? [
        { label: "Cours publies", value: stats.data.published_courses, icon: BookOpen, tone: "bg-accent-soft text-accent" },
        { label: "Ventes ce mois", value: stats.data.sales_this_month, icon: TrendingUp, tone: "bg-emerald-50 text-emerald-600" },
        { label: "Revenu total", value: formatPrice(stats.data.total_revenue), icon: Wallet, tone: "bg-sun/25 text-amber-700" },
        { label: "Messages non lus", value: stats.data.unread_messages, icon: Mail, tone: "bg-fuchsia-50 text-fuchsia-700" },
      ]
    : [];

  const pendingWork = submissions.data?.filter((s) => s.status !== "completed").length ?? 0;
  const pendingBookings = bookings.data?.filter((b) => b.status === "pending").length ?? 0;
  const unread = messages.data?.filter((m) => !m.is_read) ?? [];

  const todo = [
    { to: "/corrections", label: "Corrections en cours", count: pendingWork, icon: FileCheck2 },
    { to: "/mentorat", label: "Reservations a confirmer", count: pendingBookings, icon: Users },
    { to: "/messages", label: "Messages non lus", count: unread.length, icon: Mail },
  ];

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-navy px-6 py-8 sm:px-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        <p className="eyebrow relative !text-sun">Vue d'ensemble</p>
        <h1 className="relative mt-3 text-2xl font-bold text-white sm:text-3xl">
          Bonjour <Underlined>{firstName || "admin"}</Underlined>
        </h1>
        <p className="relative mt-4 text-sm text-white/70">Voici l'etat de la plateforme aujourd'hui.</p>
      </div>

      {stats.loading && <Spinner />}
      {stats.error && <ErrorState message={stats.error} onRetry={stats.reload} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.tone}`}>
              <c.icon size={20} />
            </span>
            <p className="mt-5 font-display text-2xl font-bold text-navy">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="card p-6">
          <h2 className="text-lg font-bold text-navy">A traiter</h2>
          <ul className="mt-5 space-y-2">
            {todo.map((t) => (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-mist"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
                    <t.icon size={17} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-navy">{t.label}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 font-display text-xs font-bold ${
                      t.count > 0 ? "bg-sun text-navy" : "bg-mist text-muted"
                    }`}
                  >
                    {t.count}
                  </span>
                  <ArrowRight size={15} className="text-muted transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Derniers messages</h2>
            <Link to="/messages" className="font-display text-xs font-semibold text-accent">
              Tout voir →
            </Link>
          </div>
          {messages.loading && <Spinner />}
          {messages.data?.length === 0 && (
            <p className="mt-5 text-sm text-muted">Aucun message pour l'instant.</p>
          )}
          <ul className="mt-5 divide-y divide-line">
            {messages.data?.slice(0, 4).map((m) => (
              <li key={m.id} className="flex gap-3 py-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-accent"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-navy">{m.name}</p>
                    <span className="shrink-0 text-xs text-muted">
                      {new Date(m.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted">{m.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
