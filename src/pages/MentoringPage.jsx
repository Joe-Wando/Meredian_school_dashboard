import PageTitle from "../components/ui/PageTitle";
import MentoringPanel from "../components/admin/MentoringPanel";

export default function MentoringPage() {
  return (
    <div>
      <PageTitle
        title="Mentorat"
        subtitle="Reservations de creneaux 1-a-1 : mets a jour leur statut et ajoute le lien de visio."
      />
      <MentoringPanel />
    </div>
  );
}
