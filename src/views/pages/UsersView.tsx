import React, { useState, useEffect } from 'react';
import { hash } from '@/services/localdb';

interface User {
  id: string;
  nome: string;
  login: string;
  cpf: string;
  celular: string;
  perfil: string;
  status: string;
  fotoPerfil?: string;
  senhaHash: string;
  createdAt: string;
  updatedAt: string;
}

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    login: '',
    cpf: '',
    celular: '',
    perfil: '',
    status: '',
    fotoPerfil: '',
    senha: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const data = localStorage.getItem('usuarios');
    if (data) {
      setUsers(JSON.parse(data));
    }
  };

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    let userData: any = {
      nome: formData.nome,
      login: formData.login,
      cpf: formData.cpf,
      celular: formData.celular,
      perfil: formData.perfil,
      status: formData.status,
      fotoPerfil: formData.fotoPerfil,
      id: editingUser ? editingUser.id : crypto.randomUUID(),
      createdAt: editingUser ? editingUser.createdAt : now,
      updatedAt: now
    };

    // Handle password
    if (formData.senha) {
      userData.senhaHash = await hash(formData.senha);
    } else if (editingUser) {
      userData.senhaHash = editingUser.senhaHash;
    }

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser.id ? userData as User : u);
    } else {
      updatedUsers = [userData as User, ...users];
    }

    saveUsers(updatedUsers);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      login: user.login,
      cpf: user.cpf,
      celular: user.celular,
      perfil: user.perfil,
      status: user.status,
      fotoPerfil: user.fotoPerfil || '',
      senha: '' // Never populate password field
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(u => u.id !== id);
      saveUsers(updatedUsers);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      login: '',
      cpf: '',
      celular: '',
      perfil: '',
      status: '',
      fotoPerfil: '',
      senha: ''
    });
    setEditingUser(null);
    setShowModal(false);
  };

  return (
    <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestão de Usuários</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Usuário
          </button>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Celular</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {user.fotoPerfil && (
                            <img 
                              src={user.fotoPerfil} 
                              alt="Foto" 
                              className="rounded-circle me-2"
                              style={{ width: 32, height: 32 }}
                            />
                          )}
                          {user.nome}
                        </div>
                      </td>
                      <td>{user.login}</td>
                      <td>{user.cpf}</td>
                      <td>{user.celular}</td>
                      <td>
                        <span className={`badge ${
                          user.perfil === 'administrador' ? 'bg-primary' : 'bg-secondary'
                        }`}>
                          {user.perfil === 'administrador' ? 'Admin' : 'Usuário'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          user.status === 'ativo' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user.id)}
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
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nome</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.login}
                          onChange={(e) => setFormData({...formData, login: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">CPF</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.cpf}
                          onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Celular</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.celular}
                          onChange={(e) => setFormData({...formData, celular: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Perfil</label>
                        <select
                          className="form-select"
                          value={formData.perfil}
                          onChange={(e) => setFormData({...formData, perfil: e.target.value})}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="administrador">Admin</option>
                          <option value="usuario">Usuário</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Status da Conta</label>
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
                      <div className="col-12 mb-3">
                        <label className="form-label">Foto de Perfil (URL)</label>
                        <input
                          type="url"
                          className="form-control"
                          value={formData.fotoPerfil}
                          onChange={(e) => setFormData({...formData, fotoPerfil: e.target.value})}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label">
                          {editingUser ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.senha}
                          onChange={(e) => setFormData({...formData, senha: e.target.value})}
                          required={!editingUser}
                        />
                        <div className="form-text">A senha será armazenada como hash por segurança.</div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingUser ? 'Atualizar' : 'Salvar'}
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