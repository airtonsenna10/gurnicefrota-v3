import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PerfilAcesso } from "@/services/types";

const RoleRoute = ({ allow, children }: { allow: PerfilAcesso[]; children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow.includes(user.perfil)) return children;
  return <Navigate to="/dashboard" replace />;
};

export default RoleRoute;
