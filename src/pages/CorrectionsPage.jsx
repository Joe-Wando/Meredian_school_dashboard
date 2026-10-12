import PageTitle from "../components/ui/PageTitle";
import CorrectionsPanel from "../components/admin/CorrectionsPanel";

export default function CorrectionsPage() {
  return (
    <div>
      <PageTitle
        title="Corrections"
        subtitle="Travaux envoyes par les etudiants : telecharge le fichier, puis rends ton retour."
      />
      <CorrectionsPanel />
    </div>
  );
}
