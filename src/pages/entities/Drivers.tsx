import EntityManager from "@/components/EntityManager";

export default function DriversPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="motoristas"
        title="Motoristas"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "cnhCategoria", label: "CNH (Categoria)" },
          { key: "cnhValidade", label: "CNH (Validade)" },
          { key: "disponibilidade", label: "Disponibilidade" },
        ]}
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "cnhCategoria", label: "CNH (Categoria)", type: "text" },
          { key: "cnhValidade", label: "CNH (Validade)", type: "date" },
          { key: "disponibilidade", label: "Disponibilidade", type: "select", options: [
            { label: "Disponível", value: "disponivel" },
            { label: "Indisponível", value: "indisponivel" },
          ] },
        ]}
      />
    </div>
  );
}
