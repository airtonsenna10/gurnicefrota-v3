import EntityManager from "@/components/EntityManager";

export default function AlertsPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="alertas"
        title="Alertas"
        columns={[
          { key: "tipo", label: "Tipo" },
          { key: "descricao", label: "Descrição" },
          { key: "data", label: "Data" },
          { key: "veiculoId", label: "Veículo" },
        ]}
        fields={[
          { key: "tipo", label: "Tipo", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
          { key: "data", label: "Data", type: "date" },
          { key: "veiculoId", label: "Veículo", type: "select", options: [] },
        ]}
      />
    </div>
  );
}
