import EntityManager from "@/components/EntityManager";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="manutencoes"
        title="Manutenções"
        columns={[
          { key: "veiculo", label: "Veículo" },
          { key: "tipoManutencao", label: "Tipo de Manutenção" },
          { key: "descricao", label: "Descrição" },
          { key: "dataInicio", label: "Data Início" },
          { key: "dataFim", label: "Data Fim" },
          { key: "statusManutencao", label: "Status da Manutenção" },
        ]}
        fields={[
          { key: "veiculo", label: "Veículo", type: "text" },
          { key: "tipoManutencao", label: "Tipo de Manutenção", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
          { key: "dataInicio", label: "Data Início", type: "date" },
          { key: "dataFim", label: "Data Fim", type: "date" },
          { key: "statusManutencao", label: "Status da Manutenção", type: "select", options: [
            
            { label: "Não iniciado", value: "nao_iniciado" },
            { label: "Em andamento", value: "em_andamento" },
            { label: "Concluída", value: "concluida" },
            { label: "Cancelada", value: "cancelada" },
          ] },
        ]}
      />
    </div>
  );
}
