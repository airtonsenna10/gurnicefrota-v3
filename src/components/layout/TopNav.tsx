import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center ms-2">
          <img 
            src="/lovable-uploads/logo-2.png" 
            alt="Guarnicé Frotas - logotipo oficial" 
            height="32"
            className="me-2"
          />
          <span className="fw-semibold">Guarnicé Frotas</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <span className="text-muted small d-none d-sm-inline">
              {user.nome} • {user.perfil}
            </span>
          )}
          {user ? (
            <button className="btn btn-outline-primary" onClick={handleLogout}>
              Sair
            </button>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">Entrar</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
