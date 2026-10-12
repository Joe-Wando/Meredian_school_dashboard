import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import RequireAdmin from "./components/RequireAdmin";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import CoursesPage from "./pages/CoursesPage";
import CorrectionsPage from "./pages/CorrectionsPage";
import MentoringPage from "./pages/MentoringPage";
import QaSessionsPage from "./pages/QaSessionsPage";
import MessagesPage from "./pages/MessagesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />

      <Route
        element={
          <RequireAdmin>
            <DashboardLayout />
          </RequireAdmin>
        }
      >
        <Route path="/" element={<OverviewPage />} />
        <Route path="/cours" element={<CoursesPage />} />
        <Route path="/corrections" element={<CorrectionsPage />} />
        <Route path="/mentorat" element={<MentoringPage />} />
        <Route path="/sessions" element={<QaSessionsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
