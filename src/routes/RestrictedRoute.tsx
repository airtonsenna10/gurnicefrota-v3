import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Componente de proteção de rotas restritas.
 * 
 * Permite acesso apenas para:
 * - Administradores
 * - Usuários do setor STA
 * 
 * Redireciona demais usuários para o dashboard.
 */
const RestrictedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, hasRole, isFromSTA } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Administrador tem acesso total
  if (hasRole("administrador")) return children;
  
  // Usuários do setor STA têm acesso total
  if (isFromSTA()) return children;
  
  // Demais usuários são redirecionados para o dashboard
  return <Navigate to="/dashboard" replace />;
};

export default RestrictedRoute;