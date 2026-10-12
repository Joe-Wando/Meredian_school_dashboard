import { useState } from "react";
import { Pencil } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import { formatPrice } from "../../lib/format";
import BookingEditModal from "./BookingEditModal";

const STATUS_LABELS = {
  pending: { label: "En attente", bg: "#F3F4F6", color: "#6B7280" },
  confirmed: { label: "Confirmee", bg: "#DBEAFE", color: "#1D4ED8" },
  completed: { label: "Terminee", bg: "#D1FAE5", color: "#047857" },
  cancelled: { label: "Annulee", bg: "#FEE2E2", color: "#B91C1C" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending;
  return (
    <span className="whitespace-nowrap rounded-full px-3 py-1 font-display text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} · ${d.toLocaleTimeString(
    "fr-FR",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}

export default function MentoringPanel() {
  const bookings = useApi(() => api.adminListBookings(), []);
  const [editing, setEditing] = useState(null);

  return (
    <div>

      {bookings.loading && <Spinner />}
      {bookings.error && <ErrorState message={bookings.error} onRetry={bookings.reload} />}

      {bookings.data && bookings.data.length === 0 && (
        <p className="card p-10 text-center text-sm text-muted">Aucune reservation pour l'instant.</p>
      )}

      {bookings.data && bookings.data.length > 0 && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-navy/5">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-mist/60 text-left font-display text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-semibold">Etudiant</th>
                <th className="px-5 py-3.5 font-semibold">Creneau</th>
                <th className="px-5 py-3.5 font-semibold">Duree</th>
                <th className="px-5 py-3.5 font-semibold">Prix</th>
                <th className="px-5 py-3.5 font-semibold">Statut</th>
                <th className="px-5 py-3.5 font-semibold">Lien</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.data.map((b) => (
                <tr key={b.id} className="border-t border-line">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-navy">{b.student_name}</p>
                    <p className="text-xs text-muted">{b.student_email}</p>
                  </td>
                  <td className="px-5 py-4 text-muted">{formatDateTime(b.scheduled_at)}</td>
                  <td className="px-5 py-4">{b.duration_minutes} min</td>
                  <td className="px-5 py-4">{formatPrice(b.price)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="max-w-[180px] truncate px-5 py-4 text-xs text-muted">
                    {b.meeting_link || "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setEditing(b)}
                      className="ml-auto flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 font-display text-[11px] font-semibold text-accent transition hover:bg-accent hover:text-white"
                    >
                      <Pencil size={13} /> Editer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <BookingEditModal
          booking={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            bookings.setData((list) =>
              list.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
