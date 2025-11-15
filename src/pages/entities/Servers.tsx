import EntityManager from "@/components/EntityManager";

export default function ServersPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="servidores"
        title="Servidores"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "matricula", label: "Matrícula" },
          { key: "setor", label: "Setor" },
          { key: "status", label: "Status" },
          { key: "perfil", label: "Perfil" },
        ]}
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "matricula", label: "Matrícula", type: "text" },
          { key: "setor", label: "Setor", type: "text" },
          { key: "status", label: "Status", type: "select", options: [
            { label: "Ativo", value: "ativo" },
            { label: "Inativo", value: "inativo" },
          ] },
          { key: "perfil", label: "Perfil", type: "select", options: [
            { label: "Servidor", value: "servidor" },
            { label: "Terceirizado", value: "terceirizado" },
            { label: "Estagiário", value: "estagiario" },
          ] },
        ]}
      />
    </div>
  );
}
