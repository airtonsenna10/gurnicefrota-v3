
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
//import { Folder, ChevronDown } from "lucide-react";
import { Folder, ChevronDown, Route } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

type NavItem = {
  title: string;
  url: string;
  role?: "admin" | "gestorOrAdmin";
  icon: string;
};

const mainItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: "bi-speedometer2" },
  { title: "Solicitações", url: "/solicitacoes", icon: "bi-file-text" },
  { title: "Autorizações", url: "/aprovacoes", role: "gestorOrAdmin" as const, icon: "bi-check-circle" },
   { title: "Viagens", url: "/viagens", icon: "route" },
];

const cadastroItems: NavItem[] = [
  { title: "Veículos", url: "/veiculos", icon: "bi-car-front" },
  { title: "Manutenções", url: "/manutencoes", icon: "bi-wrench" },
  { title: "Alertas", url: "/alertas", icon: "bi-bell" },
  { title: "Servidores", url: "/servidores", icon: "bi-people" },
  { title: "Motoristas", url: "/motoristas", icon: "bi-person-badge" },
  { title: "Usuários", url: "/usuarios", role: "admin" as const, icon: "bi-person-gear" },
  { title: "Setores", url: "/setores", icon: "bi-building" },
];

export default function AppSidebar() {
  const { hasRole, isFromSTA } = useAuth();
  const location = useLocation();
  
  const canShow = (it: NavItem) => {
    // Administrador vê tudo
    if (hasRole("administrador")) return true;
    
    // Usuários do setor STA veem tudo
    if (isFromSTA()) return true;
    
    // Demais usuários veem apenas Dashboard e Solicitações
    if (it.url === "/dashboard" || it.url === "/solicitacoes") return true;
    
    return false;
  };

  // Verifica se alguma rota do submenu Cadastro está ativa
  const isInCadastroRoute = cadastroItems.some(item => location.pathname === item.url);
  
  // Estado do submenu Cadastro
  const [isCadastroOpen, setIsCadastroOpen] = useState(isInCadastroRoute);

  // Mantém o submenu aberto se estiver em uma rota de cadastro
  useEffect(() => {
    if (isInCadastroRoute) {
      setIsCadastroOpen(true);
    }
  }, [isInCadastroRoute]);

  return (
    <div
      className="d-flex flex-column border-end bg-light"
      style={{ 
        width: '250px', 
        position: 'fixed', 
        top: '56px', 
        left: 0, 
        bottom: 0, 
        overflowY: 'auto',
        zIndex: 1000
      }}
    >
      <div className="border-bottom p-3">
        <h5 className="mb-0 fw-semibold">Menu</h5>
      </div>
      <div className="flex-grow-1 p-0">
        <ul className="nav nav-pills flex-column">
          {/* Itens principais do menu */}
          {mainItems.filter(canShow).map((item) => (
            <li className="nav-item" key={item.url}>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 py-3 px-4 ${
                    isActive ? "active" : "text-dark"
                  }`
                }
              >
                {item.icon === "route" ? (
                  <Route className="fs-5" size={20} />
                ) : (
                  <i className={`bi ${item.icon} fs-5`}></i>
                )}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}

          {/* Submenu Cadastro */}
          <li className="nav-item">
            <Collapsible open={isCadastroOpen} onOpenChange={setIsCadastroOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={`nav-link d-flex align-items-center gap-3 py-3 px-4 w-100 text-start border-0 ${
                    isInCadastroRoute ? "active" : "text-dark"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <Folder className="fs-5" size={20} />
                  <span className="flex-grow-1">Cadastro</span>
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      isCadastroOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="nav nav-pills flex-column">
                  {cadastroItems.filter(canShow).map((item) => (
                    <li className="nav-item" key={item.url}>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `nav-link d-flex align-items-center gap-3 py-2 ps-5 pe-4 ${
                            isActive ? "active" : "text-dark"
                          }`
                        }
                      >
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </li>
        </ul>
      </div>
    </div>
  );
}












/*codigo original*/
/*
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = {
  title: string;
  url: string;
  role?: "admin" | "gestorOrAdmin";
  icon: string;
};

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: "bi-speedometer2" },
  { title: "Solicitações", url: "/solicitacoes", icon: "bi-file-text" },
  { title: "Autorizações", url: "/aprovacoes", role: "gestorOrAdmin" as const, icon: "bi-check-circle" },
  { title: "Veículos", url: "/veiculos", icon: "bi-car-front" },
  { title: "Manutenções", url: "/manutencoes", icon: "bi-wrench" },
  { title: "Alertas", url: "/alertas", icon: "bi-bell" },
  { title: "Servidores", url: "/servidores", icon: "bi-people" },
  { title: "Motoristas", url: "/motoristas", icon: "bi-person-badge" },
  { title: "Usuários", url: "/usuarios", role: "admin" as const, icon: "bi-person-gear" },
  { title: "Setores", url: "/setores", icon: "bi-building" },
];

export default function AppSidebar() {
  //const { hasRole } = useAuth();
  const { hasRole, isFromSTA } = useAuth();

  const canShow = (it: typeof items[number]) => {
    
    // Administrador vê tudo
    if (hasRole("administrador")) return true;
    
    // Usuários do setor STA veem tudo
    if (isFromSTA()) return true;
    
    // Demais usuários veem apenas Dashboard e Solicitações
    if (it.url === "/dashboard" || it.url === "/solicitacoes") return true;
    
    return false;


  };

  return (
    <div
      className="d-flex flex-column border-end bg-light"
      style={{ 
        width: '250px', 
        position: 'fixed', 
        top: '56px', 
        left: 0, 
        bottom: 0, 
        overflowY: 'auto',
        zIndex: 1000
      }}
    >
      <div className="border-bottom p-3">
        <h5 className="mb-0 fw-semibold">Menu</h5>
      </div>
      <div className="flex-grow-1 p-0">
        <ul className="nav nav-pills flex-column">
          {items.filter(canShow).map((item) => (
            <li className="nav-item" key={item.url}>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 py-3 px-4 ${
                    isActive ? "active" : "text-dark"
                  }`
                }
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/