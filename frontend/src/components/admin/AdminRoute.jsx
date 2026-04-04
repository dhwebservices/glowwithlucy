import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminRoute({ children }) {
  const { loading, authenticated } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1EA] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#D8CEC0] bg-white/80 p-10 text-center">
          <p className="text-[#6B6358]">Checking staff session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  return children;
}
