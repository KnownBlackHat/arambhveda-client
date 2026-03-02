import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { ERPLayout } from "./ERPLayout";

export function ProtectedERPRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAdmin, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/erp/login" replace />;
  if (adminOnly && !hasRole("admin") && !hasRole("super_admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ERPLayout>{children}</ERPLayout>;
}
