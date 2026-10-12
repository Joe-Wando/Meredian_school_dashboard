import PageTitle from "../components/ui/PageTitle";
import QaSessionsPanel from "../components/admin/QaSessionsPanel";

export default function QaSessionsPage() {
  return (
    <div>
      <PageTitle
        title="Sessions Q&R"
        subtitle="Sessions collectives en direct, gratuites pour les inscrits."
      />
      <QaSessionsPanel />
    </div>
  );
}
