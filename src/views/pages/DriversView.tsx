import React, { useState, useEffect } from 'react';

interface Driver {
  id: string;
  nome: string;
  cnhCategoria: string;
  cnhValidade: string;
  disponibilidade: string;
  createdAt: string;
  updatedAt: string;
}

export const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnhCategoria: '',
    cnhValidade: '',
    disponibilidade: ''
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    const data = localStorage.getItem('motoristas');
    if (data) {
      setDrivers(JSON.parse(data));
    }
  };

  const saveDrivers = (updatedDrivers: Driver[]) => {
    localStorage.setItem('motoristas', JSON.stringify(updatedDrivers));
    setDrivers(updatedDrivers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const driverData = {
      ...formData,
      id: editingDriver ? editingDriver.id : crypto.randomUUID(),
      createdAt: editingDriver ? editingDriver.createdAt : now,
      updatedAt: now
    };

    let updatedDrivers;
    if (editingDriver) {
      updatedDrivers = drivers.map(d => d.id === editingDriver.id ? driverData as Driver : d);
    } else {
      updatedDrivers = [driverData as Driver, ...drivers];
    }

    saveDrivers(updatedDrivers);
    resetForm();
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      nome: driver.nome,
      cnhCategoria: driver.cnhCategoria,
      cnhValidade: driver.cnhValidade,
      disponibilidade: driver.disponibilidade
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este motorista?')) {
      const updatedDrivers = drivers.filter(d => d.id !== id);
      saveDrivers(updatedDrivers);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cnhCategoria: '',
      cnhValidade: '',
      disponibilidade: ''
    });
    setEditingDriver(null);
    setShowModal(false);
  };

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestão de Motoristas</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Motorista
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNH (Categoria)</th>
                    <th>CNH (Validade)</th>
                    <th>Disponibilidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver.id}>
                      <td>{driver.nome}</td>
                      <td>{driver.cnhCategoria}</td>
                      <td>{new Date(driver.cnhValidade).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          driver.disponibilidade === 'disponivel' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {driver.disponibilidade === 'disponivel' ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(driver)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(driver.id)}
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
                    {editingDriver ? 'Editar Motorista' : 'Novo Motorista'}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">CNH (Categoria)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.cnhCategoria}
                        onChange={(e) => setFormData({...formData, cnhCategoria: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">CNH (Validade)</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.cnhValidade}
                        onChange={(e) => setFormData({...formData, cnhValidade: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Disponibilidade</label>
                      <select
                        className="form-select"
                        value={formData.disponibilidade}
                        onChange={(e) => setFormData({...formData, disponibilidade: e.target.value})}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="disponivel">Disponível</option>
                        <option value="indisponivel">Indisponível</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingDriver ? 'Atualizar' : 'Salvar'}
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