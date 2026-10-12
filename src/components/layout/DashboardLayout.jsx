import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Users,
  Radio,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../lib/format";
import Logo from "../Logo";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5180";

const NAV = [
  { to: "/", label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
  { to: "/cours", label: "Cours", icon: BookOpen },
  { to: "/corrections", label: "Corrections", icon: FileCheck2 },
  { to: "/mentorat", label: "Mentorat", icon: Users },
  { to: "/sessions", label: "Sessions Q&R", icon: Radio },
  { to: "/messages", label: "Messages", icon: Mail, badge: "unread_messages" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // Les compteurs de la barre laterale ; les pages peuvent les rafraichir via le contexte d'Outlet.
  const stats = useApi(() => api.adminStats(), []);

  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
          <Logo variant="icon" />
        </span>
        <span className="font-display text-lg font-bold leading-none">
          Meredian
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-widest text-sun">
            Dashboard
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => {
          const count = badge ? stats.data?.[badge] : 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-4 py-3 font-display text-[13px] font-semibold transition ${
                  isActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sun transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Icon size={18} className={isActive ? "text-sun" : ""} />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold text-navy">
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 px-3 py-4">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl px-4 py-2.5 font-display text-[13px] font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={17} /> Voir le site
        </a>
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-semibold">
            {initials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-white/50">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Se deconnecter"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ground">
      {/* Barre laterale fixe (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Barre du haut + tiroir (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-display text-sm font-bold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <Logo variant="icon" />
          </span>
          Dashboard
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white"
        >
          <Menu size={18} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] shadow-2xl">
            {sidebar}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-3 top-6 flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 lg:py-10">
          <Outlet context={{ refreshStats: stats.reload }} />
        </div>
      </main>
    </div>
  );
}
