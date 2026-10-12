import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Check, Mail, Reply } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import PageTitle from "../components/ui/PageTitle";

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "unread", label: "Non lus" },
];

export default function MessagesPage() {
  const { refreshStats } = useOutletContext();
  const messages = useApi(() => api.contactMessages(), []);
  const markRead = useMutation(api.markMessageRead);
  const [filter, setFilter] = useState("all");

  async function onMarkRead(id) {
    await markRead.mutate(id);
    messages.setData((list) => list.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    refreshStats();
  }

  const unreadCount = messages.data?.filter((m) => !m.is_read).length ?? 0;
  const list = (messages.data || []).filter((m) => filter === "all" || !m.is_read);

  return (
    <div>
      <PageTitle title="Messages" subtitle="Messages recus via le formulaire de contact du site." />

      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 font-display text-xs font-semibold transition ${
              filter === f.key ? "bg-navy text-white" : "bg-white text-navy hover:bg-mist"
            }`}
          >
            {f.label}
            {f.key === "unread" && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {messages.loading && <Spinner />}
      {messages.error && <ErrorState message={messages.error} onRetry={messages.reload} />}
      {markRead.error && <p className="mb-3 text-sm text-red-600">{markRead.error}</p>}

      {messages.data && list.length === 0 && (
        <div className="card flex flex-col items-center gap-3 p-10 text-center text-sm text-muted">
          <Mail size={22} />
          {filter === "unread" ? "Tout est lu." : "Aucun message pour l'instant."}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {list.map((m) => (
          <article
            key={m.id}
            className={`card relative overflow-hidden p-6 ${m.is_read ? "" : "ring-2 ring-accent/20"}`}
          >
            {!m.is_read && <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-accent" />}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-navy">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-sm text-accent">
                  {m.email}
                </a>
              </div>
              <span className="text-xs text-muted">
                {new Date(m.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-navy/80">{m.message}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`mailto:${m.email}`} className="btn-outline !px-4 !py-2 !text-xs">
                <Reply size={13} /> Repondre
              </a>
              {!m.is_read && (
                <button
                  onClick={() => onMarkRead(m.id)}
                  disabled={markRead.loading}
                  className="btn-primary !px-4 !py-2 !text-xs"
                >
                  <Check size={13} /> Marquer comme lu
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
