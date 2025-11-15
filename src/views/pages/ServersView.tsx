import React, { useState, useEffect } from 'react';

interface Server {
  id: string;
  nome: string;
  matricula: string;
  setor: string;
  status: string;
  perfil: string;
  createdAt: string;
  updatedAt: string;
}

export const ServersView: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [activeUsers, setActiveUsers] = useState<Array<{ id: string; nome: string }>>([]);
  const [sectors, setSectors] = useState<Array<{ id: string; nome: string }>>([]);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    setor: '',
    status: '',
    perfil: ''
  });

  useEffect(() => {
    loadServers();
    loadActiveUsers();
    loadSectors();
  }, []);

  const loadServers = () => {
    const data = localStorage.getItem('servidores');
    if (data) {
      setServers(JSON.parse(data));
    }
  };

  const loadActiveUsers = () => {
    const data = localStorage.getItem('usuarios');
    if (data) {
      const users = JSON.parse(data);
      const active = users
        .filter((user: any) => user.status === 'ativo')
        .map((user: any) => ({ id: user.id, nome: user.nome }));
      setActiveUsers(active);
    }
  };

  const loadSectors = () => {
    const data = localStorage.getItem('setores');
    if (data) {
      const sectorsData = JSON.parse(data);
      const sectorsList = sectorsData.map((sector: any) => ({ 
        id: sector.id, 
        nome: sector.nome 
      }));
      setSectors(sectorsList);
    }
  };

  const saveServers = (updatedServers: Server[]) => {
    localStorage.setItem('servidores', JSON.stringify(updatedServers));
    setServers(updatedServers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const serverData = {
      ...formData,
      id: editingServer ? editingServer.id : crypto.randomUUID(),
      createdAt: editingServer ? editingServer.createdAt : now,
      updatedAt: now
    };

    let updatedServers;
    if (editingServer) {
      updatedServers = servers.map(s => s.id === editingServer.id ? serverData as Server : s);
    } else {
      updatedServers = [serverData as Server, ...servers];
    }

    saveServers(updatedServers);
    resetForm();
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    setFormData({
      nome: server.nome,
      matricula: server.matricula,
      setor: server.setor,
      status: server.status,
      perfil: server.perfil
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este servidor?')) {
      const updatedServers = servers.filter(s => s.id !== id);
      saveServers(updatedServers);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      matricula: '',
      setor: '',
      status: '',
      perfil: ''
    });
    setEditingServer(null);
    setShowModal(false);
  };

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestão de Servidores</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Servidor
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Matrícula</th>
                    <th>Setor</th>
                    <th>Status</th>
                    <th>Perfil</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map(server => (
                    <tr key={server.id}>
                      <td>{server.nome}</td>
                      <td>{server.matricula}</td>
                      <td>{server.setor}</td>
                      <td>
                        <span className={`badge ${
                          server.status === 'ativo' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {server.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {server.perfil}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(server)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(server.id)}
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
                    {editingServer ? 'Editar Servidor' : 'Novo Servidor'}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <select
                      className="form-select"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    >
                      <option value="">Selecione um usuário...</option>
                      {activeUsers.map(user => (
                        <option key={user.id} value={user.nome}>
                          {user.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="mb-3">
                      <label className="form-label">Matrícula</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.matricula}
                        onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                        required
                      />
                    </div>
                  <div className="mb-3">
                    <label className="form-label">Setor</label>
                    <select
                      className="form-select"
                      value={formData.setor}
                      onChange={(e) => setFormData({...formData, setor: e.target.value})}
                      required
                    >
                      <option value="">Selecione um setor...</option>
                      {sectors.map(sector => (
                        <option key={sector.id} value={sector.nome}>
                          {sector.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Perfil</label>
                      <select
                        className="form-select"
                        value={formData.perfil}
                        onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="servidor">Servidor</option>
                        <option value="terceirizado">Terceirizado</option>
                        <option value="estagiario">Estagiário</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingServer ? 'Atualizar' : 'Salvar'}
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