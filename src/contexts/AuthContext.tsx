import React, { createContext, useContext, useMemo, useState } from "react";
import { listAll } from "@/services/localdb";
import { Usuario, PerfilAcesso } from "@/services/types";

interface AuthContextValue {
  user: Pick<Usuario, "id" | "login" | "nome" | "perfil"> & { setor?: string } | null;
  login: (login: string, senha: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (...roles: PerfilAcesso[]) => boolean;
  isFromSTA: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function sha(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(() => {
    const saved = localStorage.getItem("auth.user");
    return saved ? JSON.parse(saved) : null;
  });
  const login = async (login: string, senha: string) => {
    // Verificar primeiro se é o administrador hardcoded
    if (login === "admin" && senha === "admin123") {
      const adminPayload = { 
        id: "admin-hardcoded", 
        login: "admin", 
        nome: "Administrador do Sistema", 
        perfil: "administrador" as PerfilAcesso 
      };
      setUser(adminPayload);
      localStorage.setItem("auth.user", JSON.stringify(adminPayload));
      return true;
    }


    // Se não for admin, buscar nos usuários do localStorage
    const users = listAll<Usuario>("usuarios");
    const found = users.find((u) => u.login === login);
    if (!found) return false;
    const hash = await sha(senha);
    if (hash !== found.senhaHash) return false;

    // Buscar o setor do servidor
    let userSetor = undefined;
    const servers = listAll<any>("servidores");
    const server = servers.find((s: any) => s.nome === found.nome);
    if (server) {
      userSetor = server.setor;
    }

    const payload = { id: found.id, login: found.login, nome: found.nome, perfil: found.perfil, setor: userSetor };
    setUser(payload);
    localStorage.setItem("auth.user", JSON.stringify(payload));
    return true;
  };

  const logout = () => {
    localStorage.removeItem("auth.user");
    setUser(null);
  };

  const hasRole = (...roles: PerfilAcesso[]) => !!user && roles.includes(user.perfil);

  //const value = useMemo(() => ({ user, login, logout, hasRole }), [user]);
  const isFromSTA = () => !!user && user.setor === "STA - SUPERVISÃO DE TRANSPORTE ADMINISTRATIVO";

  const value = useMemo(() => ({ user, login, logout, hasRole, isFromSTA }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
