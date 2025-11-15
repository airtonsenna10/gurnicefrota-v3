import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
  veiculoId: string;
  createdAt: string;
  updatedAt: string;
}

interface Vehicle {
  id: string;
  modelo: string;
  placa: string;
  status: string;
}

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descricao: '',
    data: '',
    veiculoId: ''
  });

  useEffect(() => {
    loadAlerts();
     loadVehicles();
  }, []);

   const loadVehicles = () => {
    const data = localStorage.getItem('veiculos');
    if (data) {
      const allVehicles = JSON.parse(data);
      setVehicles(allVehicles);
    }
  };

  const loadAlerts = () => {
    const data = localStorage.getItem('alertas');
    if (data) {
      setAlerts(JSON.parse(data));
    }
  };

  const saveAlerts = (updatedAlerts: Alert[]) => {
    localStorage.setItem('alertas', JSON.stringify(updatedAlerts));
    setAlerts(updatedAlerts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const alertData = {
      ...formData,
      id: editingAlert ? editingAlert.id : crypto.randomUUID(),
      createdAt: editingAlert ? editingAlert.createdAt : now,
      updatedAt: now
    };

    let updatedAlerts;
    if (editingAlert) {
      updatedAlerts = alerts.map(a => a.id === editingAlert.id ? alertData as Alert : a);
    } else {
      updatedAlerts = [alertData as Alert, ...alerts];
    }

    saveAlerts(updatedAlerts);
    resetForm();
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      tipo: alert.tipo,
      descricao: alert.descricao,
      data: alert.data,
      veiculoId: alert.veiculoId
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este alerta?')) {
      const updatedAlerts = alerts.filter(a => a.id !== id);
      saveAlerts(updatedAlerts);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: '',
      descricao: '',
      data: '',
      veiculoId: ''
    });
    setEditingAlert(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Alertas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Novo Alerta
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Data</th>
                  <th>Veículo (ID)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id}>
                    <td>
                      <span className="badge bg-warning">
                        {alert.tipo}
                      </span>
                    </td>
                    <td>{alert.descricao}</td>
                    <td>{new Date(alert.data).toLocaleDateString()}</td>
                    <td>{alert.veiculoId}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(alert)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(alert.id)}
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
                  {editingAlert ? 'Editar Alerta' : 'Novo Alerta'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
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
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Veículo</label>
                    <select
                      className="form-select"
                      value={formData.veiculoId}
                      onChange={(e) => setFormData({...formData, veiculoId: e.target.value})}
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
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAlert ? 'Atualizar' : 'Salvar'}
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
