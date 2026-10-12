import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

/** Tout le dashboard est reserve au role admin (le backend le verifie aussi). */
export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, ready, user, logout } = useAuth();
  const location = useLocation();

  if (!ready) return <Spinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/connexion" state={{ from: location }} replace />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card flex max-w-md flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert size={24} />
          </span>
          <h1 className="text-xl font-bold text-navy">Acces reserve</h1>
          <p className="text-sm text-muted">
            Le compte <strong>{user?.email}</strong> n'a pas les droits administrateur.
          </p>
          <button onClick={logout} className="btn-primary">
            Changer de compte
          </button>
        </div>
      </div>
    );
  }

  return children;
}
