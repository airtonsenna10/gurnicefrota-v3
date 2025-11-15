import EntityManager from "@/components/EntityManager";

export default function VehiclesPage() {
  return (
    <div className="min-h-screen">
      
      <EntityManager
        storageKey="veiculos"
        title="Veículos"
        columns={[
          { key: "modelo", label: "Modelo" },
          { key: "marca", label: "Marca" },
          { key: "placa", label: "Placa" },
          { key: "tipoVeiculo", label: "Tipo de Veículo" },
          { key: "capacidade", label: "Capacidade" },
          { key: "status", label: "Status" },
        ]}
        detailFields={[
          { key: "chassi", label: "Chassi" },
          { key: "renavam", label: "Renavam" },
          { key: "dataAquisicao", label: "Data da Aquisição" },
          { key: "propriedade", label: "Propriedade" },
          { key: "categoria", label: "Categoria" },
          { key: "kml", label: "Km/l" },
          { key: "ultimaRevisao", label: "Última Revisão" },
        ]}
        fields={[
          { key: "modelo", label: "Modelo", type: "text" },
          { key: "marca", label: "Marca", type: "text" },
          { key: "placa", label: "Placa", type: "text" },
          { key: "chassi", label: "Chassi", type: "text" },
          { key: "renavam", label: "Renavam", type: "text" },
          { key: "tipoVeiculo", label: "Tipo de Veículo", type: "select", options: [
            { label: "Carro", value: "carro" },
            { label: "Utilitário", value: "utilitario" },
            { label: "Moto", value: "moto" },
            { label: "Van", value: "van" },
            { label: "Micro-ônibus", value: "micro_onibus" },
            { label: "Ônibus", value: "onibus" },
            { label: "Caminhão", value: "caminhao" },
          ] },
          { key: "capacidade", label: "Capacidade", type: "number" },
          { key: "status", label: "Status", type: "select", options: [
            { label: "Disponível", value: "disponivel" },
            { label: "Em uso", value: "em_uso" },
            { label: "Em Manutenção", value: "manutencao" },
            { label: "Inativo", value: "inativo" },
          ] },
          { key: "dataAquisicao", label: "Data da Aquisição", type: "date" },
          { key: "propriedade", label: "Propriedade", type: "select", options: [
            { label: "Alugado", value: "alugado" },
            { label: "Próprio", value: "proprio" },
          ] },
          { key: "categoria", label: "Categoria", type: "select", options: [
            { label: "Elétrico", value: "eletrico" },
            { label: "Híbrido", value: "hibrido" },
            { label: "Flex", value: "flex" },
            { label: "Álcool", value: "alcool" },
            { label: "Gasolina", value: "gasolina" },
            { label: "Diesel", value: "diesel" },
            { label: "GNV", value: "gnv" },
          ] },
          { key: "kml", label: "Km/l", type: "number" },
          { key: "ultimaRevisao", label: "Última Revisão", type: "date" },
        ]}
      />
    </div>
  );
}
