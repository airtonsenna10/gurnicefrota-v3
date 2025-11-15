import EntityManager from "@/components/EntityManager";
import { hash } from "@/services/localdb";

export default function UsersPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="usuarios"
        title="Usuários"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "login", label: "Email" },
          { key: "cpf", label: "CPF" },
          { key: "celular", label: "Celular" },
          { key: "perfil", label: "Perfil" },
          { key: "status", label: "Status da Conta" },
          { key: "fotoPerfil", label: "Foto de Perfil" },
        ]}
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "login", label: "Email", type: "text" },
          { key: "cpf", label: "CPF", type: "text" },
          { key: "celular", label: "Celular", type: "text" },
          { key: "perfil", label: "Perfil", type: "select", options: [
            { label: "Admin", value: "administrador" },
            { label: "Usuário", value: "usuario" },
          ] },
          { key: "status", label: "Status da Conta", type: "select", options: [
            { label: "Ativo", value: "ativo" },
            { label: "Inativo", value: "inativo" },
          ] },
          { key: "fotoPerfil", label: "Foto de Perfil (URL)", type: "text" },
          { key: "senha", label: "Senha (será armazenada como hash)", type: "text" },
        ]}
        transformOnSave={async (data: any) => {
          if (data.senha) {
            const senhaHash = await hash(data.senha);
            delete data.senha;
            return { ...data, senhaHash };
          }
          return data;
        }}
      />
    </div>
  );
}
