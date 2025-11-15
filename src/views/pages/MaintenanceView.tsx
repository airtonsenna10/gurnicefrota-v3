import React, { useState, useEffect } from 'react';

interface Maintenance {
  id: string;
  veiculo: string;
  tipoManutencao: string;
  descricao: string;
  dataInicio: string;
  //dataFim: string;
  statusManutencao: string;
  createdAt: string;
  updatedAt: string;
}

interface Vehicle {
  id: string;
  modelo: string;
  placa: string;
  status: string;
}

export const MaintenanceView: React.FC = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState({
    veiculo: '',
    tipoManutencao: '',
    descricao: '',
    dataInicio: '',
    //dataFim: '',
    statusManutencao: ''
  });

  useEffect(() => {
    loadMaintenances();
    loadVehicles();
  }, []);

   const loadVehicles = () => {
    const data = localStorage.getItem('veiculos');
    if (data) {
      const allVehicles = JSON.parse(data);
      // Filter only vehicles with status "disponivel" or "inativo"
      const filteredVehicles = allVehicles.filter(
        (v: Vehicle) => v.status === 'disponivel' || v.status === 'inativo'
      );
      setVehicles(filteredVehicles);
    }
  };

  const loadMaintenances = () => {
    const data = localStorage.getItem('manutencoes');
    if (data) {
      setMaintenances(JSON.parse(data));
    }
  };

  const saveMaintenances = (updatedMaintenances: Maintenance[]) => {
    localStorage.setItem('manutencoes', JSON.stringify(updatedMaintenances));
    setMaintenances(updatedMaintenances);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const maintenanceData = {
      ...formData,
      id: editingMaintenance ? editingMaintenance.id : crypto.randomUUID(),
      createdAt: editingMaintenance ? editingMaintenance.createdAt : now,
      updatedAt: now
    };

    let updatedMaintenances;
    if (editingMaintenance) {
      updatedMaintenances = maintenances.map(m => m.id === editingMaintenance.id ? maintenanceData as Maintenance : m);
    } else {
      updatedMaintenances = [maintenanceData as Maintenance, ...maintenances];
    }

    saveMaintenances(updatedMaintenances);
    resetForm();
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
    setFormData({
      veiculo: maintenance.veiculo,
      tipoManutencao: maintenance.tipoManutencao,
      descricao: maintenance.descricao,
      dataInicio: maintenance.dataInicio,
      //dataFim: maintenance.dataFim,
      statusManutencao: maintenance.statusManutencao
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta manutenção?')) {
      const updatedMaintenances = maintenances.filter(m => m.id !== id);
      saveMaintenances(updatedMaintenances);
    }
  };

  const resetForm = () => {
    setFormData({
      veiculo: '',
      tipoManutencao: '',
      descricao: '',
      dataInicio: '',
      //dataFim: '',
      statusManutencao: ''
    });
    setEditingMaintenance(null);
    setShowModal(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
       case 'nao_iniciado':
        return 'bg-secondary';
      case 'concluida':
        return 'bg-success';
      case 'em_andamento':
        return 'bg-warning';
      case 'cancelada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nao_iniciado':
        return 'Não iniciado';
      case 'concluida':
        return 'Concluída';
      case 'em_andamento':
        return 'Em andamento';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Manutenções</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nova Manutenção
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Tipo de Manutenção</th>
                  <th>Descrição</th>
                  <th>Data Início</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.map(maintenance => (
                  <tr key={maintenance.id}>
                    <td>{maintenance.veiculo}</td>
                    <td>{maintenance.tipoManutencao}</td>
                    <td>{maintenance.descricao}</td>
                    <td>{new Date(maintenance.dataInicio).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(maintenance.statusManutencao)}`}>
                        {getStatusLabel(maintenance.statusManutencao)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(maintenance)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(maintenance.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Veículo</label>
                     <select
                      className="form-select"
                      value={formData.veiculo}
                      onChange={(e) => setFormData({...formData, veiculo: e.target.value})}
                      required
                      >
                      <option value="">Selecione um veículo...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={`${vehicle.modelo} - ${vehicle.placa}`}>
                          {vehicle.modelo} - {vehicle.placa}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tipo de Manutenção</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tipoManutencao}
                      onChange={(e) => setFormData({...formData, tipoManutencao: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data Início</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}

                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status da Manutenção</label>
                    <select
                      className="form-select"
                      value={formData.statusManutencao}
                      onChange={(e) => setFormData({...formData, statusManutencao: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      
                       <option value="nao_iniciado">Não iniciado</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMaintenance ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
    </>
  );
};
