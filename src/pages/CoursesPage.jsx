import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, Trash2, Lock, Unlock, Layers, Search } from "lucide-react";
import api from "../api";
import { useApi } from "../hooks/useApi";
import { useMutation } from "../hooks/useMutation";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import CategoryBadge from "../components/ui/CategoryBadge";
import PageTitle from "../components/ui/PageTitle";
import CourseFormModal from "../components/admin/CourseFormModal";
import ModuleManagerModal from "../components/admin/ModuleManagerModal";
import { CATEGORY_NAMES } from "../lib/theme";

export default function CoursesPage() {
  const { refreshStats } = useOutletContext();
  const courses = useApi(() => api.listCourses(), []);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [managing, setManaging] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");

  const createCourse = useMutation(api.createCourse);
  const updateCourse = useMutation(api.updateCourse);
  const deleteCourse = useMutation(api.deleteCourse);

  async function patchCourse(id, patch) {
    const updated = await updateCourse.mutate(id, patch);
    courses.setData((list) => list.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (courses.data || []).filter(
      (c) =>
        (category === "Toutes" || c.category === category) &&
        (q === "" || c.title.toLowerCase().includes(q))
    );
  }, [courses.data, query, category]);

  return (
    <div>
      <PageTitle
        title="Cours"
        subtitle={courses.data ? `${courses.data.length} cours au catalogue.` : "Gestion du catalogue."}
      >
        <button onClick={() => setAdding(true)} className="btn-primary">
          <Plus size={15} /> Ajouter un cours
        </button>
      </PageTitle>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Toutes", ...CATEGORY_NAMES].map((name) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`rounded-full px-4 py-2 font-display text-xs font-semibold transition ${
                category === name ? "bg-navy text-white" : "bg-white text-navy hover:bg-mist"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 md:w-72">
          <Search size={15} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un cours"
            className="w-full bg-transparent text-sm outline-none placeholder:text-navy/40"
            aria-label="Rechercher un cours"
          />
        </label>
      </div>

      {courses.loading && <Spinner />}
      {courses.error && <ErrorState message={courses.error} onRetry={courses.reload} />}

      {courses.data && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm shadow-navy/5">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-mist/60 text-left font-display text-[11px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5 font-semibold">Cours</th>
                <th className="px-5 py-3.5 font-semibold">Matiere</th>
                <th className="px-5 py-3.5 font-semibold">Niveau</th>
                <th className="px-5 py-3.5 font-semibold">Statut</th>
                <th className="px-5 py-3.5 font-semibold">Prix (FCFA)</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    Aucun cours ne correspond.
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-5 py-4 font-semibold text-navy">{c.title}</td>
                  <td className="px-5 py-4">
                    <CategoryBadge category={c.category} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted">{c.level}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => patchCourse(c.id, { is_free: !c.is_free })}
                      title="Basculer gratuit / payant"
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[11px] font-semibold transition ${
                        c.is_free ? "bg-emerald-50 text-emerald-700" : "bg-mist text-muted hover:bg-line"
                      }`}
                    >
                      {c.is_free ? <Unlock size={11} /> : <Lock size={11} />}
                      {c.is_free ? "Gratuit" : "Payant"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <input
                      // Remonte le champ quand le statut change pour reafficher le bon prix.
                      key={`${c.id}-${c.is_free}`}
                      type="number"
                      min="0"
                      disabled={c.is_free}
                      defaultValue={c.is_free ? 0 : c.price}
                      onBlur={(e) => {
                        const price = Number(e.target.value) || 0;
                        if (price !== c.price) patchCourse(c.id, { price });
                      }}
                      className="w-28 rounded-xl border-2 border-transparent bg-mist px-3 py-1.5 text-sm font-medium outline-none focus:border-accent focus:bg-white disabled:text-muted/60"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setManaging(c)}
                        className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 font-display text-[11px] font-semibold text-accent transition hover:bg-accent hover:text-white"
                      >
                        <Layers size={12} /> Modules
                      </button>
                      <button
                        onClick={() => setEditing(c)}
                        aria-label="Modifier"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-mist hover:text-navy"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Supprimer « ${c.title} » ?`)) return;
                          await deleteCourse.mutate(c.id);
                          courses.setData((list) => list.filter((x) => x.id !== c.id));
                          refreshStats();
                        }}
                        aria-label="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(updateCourse.error || deleteCourse.error) && (
        <p className="mt-3 text-sm text-red-600">{updateCourse.error || deleteCourse.error}</p>
      )}

      {adding && (
        <CourseFormModal
          onClose={() => setAdding(false)}
          saving={createCourse.loading}
          error={createCourse.error}
          onSubmit={async (payload) => {
            const created = await createCourse.mutate(payload);
            courses.setData((list) => [created, ...list]);
            setAdding(false);
            refreshStats();
          }}
        />
      )}

      {editing && (
        <CourseFormModal
          course={editing}
          onClose={() => setEditing(null)}
          saving={updateCourse.loading}
          error={updateCourse.error}
          onSubmit={async (payload) => {
            await patchCourse(editing.id, payload);
            setEditing(null);
          }}
        />
      )}

      {managing && <ModuleManagerModal course={managing} onClose={() => setManaging(null)} />}
    </div>
  );
}
