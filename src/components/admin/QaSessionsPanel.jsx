import { useState } from "react";
import { Plus } from "lucide-react";
import api from "../../api";
import { useApi } from "../../hooks/useApi";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";
import QaSessionFormModal from "./QaSessionFormModal";

export default function QaSessionsPanel() {
  const sessions = useApi(() => api.qaSessions(), []);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus size={14} /> Creer une session
        </button>
      </div>

      {sessions.loading && <Spinner />}
      {sessions.error && <ErrorState message={sessions.error} onRetry={sessions.reload} />}

      {sessions.data && sessions.data.length === 0 && (
        <p className="card p-10 text-center text-sm text-muted">Aucune session a venir.</p>
      )}

      {sessions.data && sessions.data.length > 0 && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-navy/5">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="bg-mist/60 text-left font-display text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Sujet</th>
                <th className="px-5 py-3.5 font-semibold">Duree</th>
                <th className="px-5 py-3.5 font-semibold">Places</th>
              </tr>
            </thead>
            <tbody>
              {sessions.data.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-5 py-4 text-muted">
                    {s.date} · {s.time}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{s.topic}</td>
                  <td className="px-5 py-4">{s.duration_minutes} min</td>
                  <td className="px-5 py-4">
                    {s.spots_left} / {s.max_spots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <QaSessionFormModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            sessions.reload();
          }}
        />
      )}
    </div>
  );
}
