import React, { useState, useEffect } from 'react';

interface Sector {
  id: string;
  nome: string;
  descricao: string;
  pai?: string;
  createdAt: string;
  updatedAt: string;
}

export const SectorsView: React.FC = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showOrganogram, setShowOrganogram] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    gestor: '',
    descricao: '',
    pai: ''
  });

  useEffect(() => {
    loadSectors();
  }, []);

  const loadSectors = () => {
    const data = localStorage.getItem('setores');
    if (data) {
      setSectors(JSON.parse(data));
    }
  };

  const saveSectors = (updatedSectors: Sector[]) => {
    localStorage.setItem('setores', JSON.stringify(updatedSectors));
    setSectors(updatedSectors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const sectorData = {
      ...formData,
      pai: formData.pai && formData.pai !== '__none__' ? formData.pai : undefined,
      id: editingSector ? editingSector.id : crypto.randomUUID(),
      createdAt: editingSector ? editingSector.createdAt : now,
      updatedAt: now
    };

    let updatedSectors;
    if (editingSector) {
      updatedSectors = sectors.map(s => s.id === editingSector.id ? sectorData as Sector : s);
    } else {
      updatedSectors = [sectorData as Sector, ...sectors];
    }

    saveSectors(updatedSectors);
    resetForm();
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      nome: sector.nome,
      gestor: (sector as any).gestor || '',
      descricao: sector.descricao,
      pai: sector.pai || '__none__'
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este setor?')) {
      const updatedSectors = sectors.filter(s => s.id !== id);
      saveSectors(updatedSectors);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      gestor: '',
      descricao: '',
      pai: ''
    });
    setEditingSector(null);
    setShowModal(false);
  };

  const buildHierarchy = (sectorsList: Sector[]) => {
    const map = new Map();
    const roots: any[] = [];
    
    sectorsList.forEach(sector => map.set(sector.id, { ...sector, children: [] }));
    
    sectorsList.forEach(sector => {
      const node = map.get(sector.id);
      if (sector.pai && map.has(sector.pai)) {
        map.get(sector.pai).children.push(node);
      } else {
        roots.push(node);
      }
    });
    
    return roots;
  };

  const renderNode = (node: any, level = 0): JSX.Element => {
    const indent = "│   ".repeat(level);
    const prefix = level > 0 ? "├── " : "";
    
    return (
      <div key={node.id}>
        <div className="font-monospace small py-1">
          {indent}{prefix}{node.nome}
        </div>
        {node.children.map((child: any) => renderNode(child, level + 1))}
      </div>
    );
  };

  const getSectorName = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector ? sector.nome : 'N/A';
  };

  if (showOrganogram) {
    const hierarchy = buildHierarchy(sectors);
    
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Organograma - Setores</h2>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setShowOrganogram(false)}
          >
            Voltar para Lista
          </button>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Estrutura Hierárquica</h5>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {hierarchy.length > 0 ? (
                <div>
                  {hierarchy.map(root => renderNode(root))}
                </div>
              ) : (
                <p className="text-muted text-center py-5 mb-0">
                  Nenhum setor cadastrado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Setores</h2>
        <div>
          <button 
            className="btn btn-secondary me-2"
            onClick={() => setShowOrganogram(true)}
          >
            <i className="bi bi-diagram-3 me-2"></i>
            Visualizar Organograma
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Setor
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Gestor</th>
                  <th>Descrição</th>
                  <th>Setor Pai</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(sector => (
                  <tr key={sector.id}>
                    <td>{sector.nome}</td>
                    <td>{(sector as any).gestor || '-'}</td>
                    <td>{sector.descricao}</td>
                    <td>{sector.pai ? getSectorName(sector.pai) : '-'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(sector)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(sector.id)}
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
                  {editingSector ? 'Editar Setor' : 'Novo Setor'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome do Setor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gestor</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.gestor}
                      onChange={(e) => setFormData({...formData, gestor: e.target.value})}
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
                    <label className="form-label">Setor Pai</label>
                    <select
                      className="form-select"
                      value={formData.pai}
                      onChange={(e) => setFormData({...formData, pai: e.target.value})}
                    >
                      <option value="__none__">Nenhum</option>
                      {sectors.map(sector => (
                        <option key={sector.id} value={sector.id}>
                          {sector.nome}
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
                    {editingSector ? 'Atualizar' : 'Salvar'}
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
