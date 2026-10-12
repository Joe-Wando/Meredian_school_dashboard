import { useState } from "react";
import { Download, FileCheck2 } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import { formatPrice } from "../../lib/format";
import WorkReviewModal from "./WorkReviewModal";

const STATUS_LABELS = {
  pending: { label: "En attente", bg: "#F3F4F6", color: "#6B7280" },
  in_review: { label: "En correction", bg: "#FEF3C7", color: "#92400E" },
  completed: { label: "Terminee", bg: "#D1FAE5", color: "#047857" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.pending;
  return (
    <span
      className="whitespace-nowrap rounded-full px-3 py-1 font-display text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function CorrectionsPanel() {
  const submissions = useApi(() => api.adminListWorkSubmissions(), []);
  const [reviewing, setReviewing] = useState(null);

  return (
    <div>

      {submissions.loading && <Spinner />}
      {submissions.error && <ErrorState message={submissions.error} onRetry={submissions.reload} />}

      {submissions.data && submissions.data.length === 0 && (
        <p className="card p-10 text-center text-sm text-muted">Aucune soumission pour l'instant.</p>
      )}

      {submissions.data && submissions.data.length > 0 && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-navy/5">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-mist/60 text-left font-display text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-semibold">Etudiant</th>
                <th className="px-5 py-3.5 font-semibold">Fichier</th>
                <th className="px-5 py-3.5 font-semibold">Note</th>
                <th className="px-5 py-3.5 font-semibold">Statut</th>
                <th className="px-5 py-3.5 font-semibold">Prix</th>
                <th className="px-5 py-3.5 font-semibold">Deposee le</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.data.map((s) => (
                <tr key={s.id} className="border-t border-line align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-navy">{s.student_name}</p>
                    <p className="text-xs text-muted">{s.student_email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => api.downloadWorkSubmissionFile(s.id, "original")}
                      className="flex items-center gap-1.5 text-accent"
                    >
                      <Download size={13} /> {s.original_file_name}
                    </button>
                  </td>
                  <td className="max-w-[220px] px-5 py-4 text-muted">{s.note || "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-5 py-4">{formatPrice(s.price)}</td>
                  <td className="px-5 py-4 text-muted">
                    {new Date(s.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setReviewing(s)}
                      className="ml-auto flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 font-display text-[11px] font-semibold text-accent transition hover:bg-accent hover:text-white"
                    >
                      <FileCheck2 size={13} /> Examiner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewing && (
        <WorkReviewModal
          submission={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={(updated) => {
            submissions.setData((list) =>
              list.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
            );
            setReviewing(null);
          }}
        />
      )}
    </div>
  );
}
