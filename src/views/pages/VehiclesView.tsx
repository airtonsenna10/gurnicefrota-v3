import React, { useState, useEffect } from 'react';

interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  placa: string;
  chassi: string;
  renavam: string;
  tipoVeiculo: string;
  capacidade: number;
  status: string;
  dataAquisicao: string;
  propriedade: string;
  categoria: string;
  kml: number;
  ultimaRevisao: string;
  createdAt: string;
  updatedAt: string;
}

export const VehiclesView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    modelo: '',
    marca: '',
    placa: '',
    chassi: '',
    renavam: '',
    tipoVeiculo: '',
    capacidade: '',
    status: '',
    dataAquisicao: '',
    propriedade: '',
    categoria: '',
    kml: '',
    ultimaRevisao: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    const data = localStorage.getItem('veiculos');
    if (data) {
      setVehicles(JSON.parse(data));
    }
  };

  const saveVehicles = (updatedVehicles: Vehicle[]) => {
    localStorage.setItem('veiculos', JSON.stringify(updatedVehicles));
    setVehicles(updatedVehicles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const vehicleData = {
      ...formData,
      capacidade: Number(formData.capacidade),
      kml: Number(formData.kml),
      id: editingVehicle ? editingVehicle.id : crypto.randomUUID(),
      createdAt: editingVehicle ? editingVehicle.createdAt : now,
      updatedAt: now
    };

    let updatedVehicles;
    if (editingVehicle) {
      updatedVehicles = vehicles.map(v => v.id === editingVehicle.id ? vehicleData as Vehicle : v);
    } else {
      updatedVehicles = [vehicleData as Vehicle, ...vehicles];
    }

    saveVehicles(updatedVehicles);
    resetForm();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      modelo: vehicle.modelo,
      marca: vehicle.marca,
      placa: vehicle.placa,
      chassi: vehicle.chassi,
      renavam: vehicle.renavam,
      tipoVeiculo: vehicle.tipoVeiculo,
      capacidade: vehicle.capacidade != null ? String(vehicle.capacidade) : '',
      status: vehicle.status,
      dataAquisicao: vehicle.dataAquisicao,
      propriedade: vehicle.propriedade,
      categoria: vehicle.categoria,
      kml: vehicle.kml != null ? String(vehicle.kml) : '',
      ultimaRevisao: vehicle.ultimaRevisao
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      const updatedVehicles = vehicles.filter(v => v.id !== id);
      saveVehicles(updatedVehicles);
    }
  };

  const resetForm = () => {
    setFormData({
      modelo: '',
      marca: '',
      placa: '',
      chassi: '',
      renavam: '',
      tipoVeiculo: '',
      capacidade: '',
      status: '',
      dataAquisicao: '',
      propriedade: '',
      categoria: '',
      kml: '',
      ultimaRevisao: ''
    });
    setEditingVehicle(null);
    setShowModal(false);
  };

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestão de Veículos</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Veículo
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Placa</th>
                    <th>Tipo</th>
                    <th>Capacidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.modelo}</td>
                      <td>{vehicle.marca}</td>
                      <td>{vehicle.placa}</td>
                      <td>{vehicle.tipoVeiculo}</td>
                      <td>{vehicle.capacidade}</td>
                      <td>
                        <span className={`badge ${
                          vehicle.status === 'disponivel' ? 'bg-success' :
                          vehicle.status === 'em_uso' ? 'bg-warning' :
                          vehicle.status === 'manutencao' ? 'bg-danger' : 'bg-secondary'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(vehicle)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(vehicle.id)}
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
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Modelo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.modelo}
                          onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Marca</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.marca}
                          onChange={(e) => setFormData({...formData, marca: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Placa</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.placa}
                          onChange={(e) => setFormData({...formData, placa: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tipo de Veículo</label>
                        <select
                          className="form-select"
                          value={formData.tipoVeiculo}
                          onChange={(e) => setFormData({...formData, tipoVeiculo: e.target.value})}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="carro">Carro</option>
                          <option value="utilitario">Utilitário</option>
                          <option value="moto">Moto</option>
                          <option value="van">Van</option>
                          <option value="micro_onibus">Micro-ônibus</option>
                          <option value="onibus">Ônibus</option>
                          <option value="caminhao">Caminhão</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Capacidade</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.capacidade}
                          onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="disponivel">Disponível</option>
                          <option value="em_uso">Em uso</option>
                          <option value="manutencao">Em Manutenção</option>
                          <option value="inativo">Inativo</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Chassi</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.chassi}
                          onChange={(e) => setFormData({...formData, chassi: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Renavam</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.renavam}
                          onChange={(e) => setFormData({...formData, renavam: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Data da Aquisição</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.dataAquisicao}
                          onChange={(e) => setFormData({...formData, dataAquisicao: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Propriedade</label>
                        <select
                          className="form-select"
                          value={formData.propriedade}
                          onChange={(e) => setFormData({...formData, propriedade: e.target.value})}
                        >
                          <option value="">Selecione...</option>
                          <option value="alugado">Alugado</option>
                          <option value="proprio">Próprio</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Categoria</label>
                        <select
                          className="form-select"
                          value={formData.categoria}
                          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        >
                          <option value="">Selecione...</option>
                          <option value="eletrico">Elétrico</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="flex">Flex</option>
                          <option value="alcool">Álcool</option>
                          <option value="gasolina">Gasolina</option>
                          <option value="diesel">Diesel</option>
                          <option value="gnv">GNV</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Km/l</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={formData.kml}
                          onChange={(e) => setFormData({...formData, kml: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Última Revisão</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.ultimaRevisao}
                          onChange={(e) => setFormData({...formData, ultimaRevisao: e.target.value})}
                        />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingVehicle ? 'Atualizar' : 'Salvar'}
                    </button>
                  </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
  );
};