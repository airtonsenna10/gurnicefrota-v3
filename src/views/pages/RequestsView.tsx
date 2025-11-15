
import React, { useState, useEffect } from 'react';
import { RequestController } from '../../controllers/RequestController';
import { SolicitacaoVeiculo } from '../../models/RequestModel';
import { useAuth } from '../../contexts/AuthContext';
import { Eye } from 'lucide-react';

export const RequestsView: React.FC = () => {
  //const { user } = useAuth();
  const { user, hasRole, isFromSTA } = useAuth();
  const [requests, setRequests] = useState<SolicitacaoVeiculo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoVeiculo | null>(null);
  const [formData, setFormData] = useState({
    dataInicio: '',
    dataFim: '',
    horarioSaida: '',
    origem: '',
    destino: '',
     quantidadePessoas: 1,
    bagagemLitros: 0,
    motivo: ''
  });
  
  const requestController = new RequestController();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = requestController.getAllRequests();
    //setRequests(allRequests);

    // Admin e usuários do setor STA veem todas as solicitações
    if (hasRole('administrador') || isFromSTA()) {
      setRequests(allRequests);
    } else {
      // Demais usuários veem apenas suas próprias solicitações
      const userRequests = allRequests.filter(req => req.servidor === user?.nome);
      setRequests(userRequests);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    
    const requestData = {
      servidor: user.nome,
      veiculoId: '',
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      horarioSaida: formData.horarioSaida,
      origem: formData.origem,
      destino: formData.destino,
      motivo: formData.motivo,
      quantidadePessoas: formData.quantidadePessoas,
      bagagemLitros: formData.bagagemLitros,
      setorResponsavel: 'Gestão de Transporte',
      status: 'pendente' as const,
      justificativa: '',
      historico: [{ data: new Date().toISOString(), status: 'pendente', por: user.nome }]
       
    };
  
    
    requestController.createRequest(requestData);
    loadRequests();
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      dataInicio: '',
      dataFim: '',
      horarioSaida: '',
      origem: '',
      destino: '',
      quantidadePessoas: 1,
      bagagemLitros: 0,
      motivo: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: 'bg-warning text-dark',
      aprovada: 'bg-success',
      rejeitada: 'bg-danger'
    };
    return badges[status as keyof typeof badges] || 'bg-secondary';

  };

   const handleViewDetails = (request: SolicitacaoVeiculo) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <>
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h2 fw-bold text-primary mb-1">
                  📋 Solicitações de Veículos
                </h1>
                <p className="text-muted">Gerencie todas as solicitações de veículos</p>
              </div>
              <button
                className="btn btn-primary btn-lg px-4"
                onClick={() => setShowModal(true)}
              >
                ➕ Nova Solicitação
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Solicitações */}
        <div className="row">
          <div className="col">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {requests.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 text-muted mb-3">📋</div>
                    <h4 className="text-muted">Nenhuma solicitação encontrada</h4>
                    <p className="text-muted">Clique em "Nova Solicitação" para começar</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-semibold">Solicitante</th>
                          <th className="fw-semibold">Data da Solicitação</th>
                          <th className="fw-semibold">Data Início</th>
                          <th className="fw-semibold">Data Fim</th>
                           <th className="fw-semibold">Horário</th>
                          <th className="fw-semibold">Status</th>
                          <th className="fw-semibold">Visualizar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
                          <tr key={request.id}>
                            <td className="fw-medium">{request.servidor}</td>
                            <td>{formatDate(request.createdAt)}</td>
                            <td>{formatDate(request.dataInicio)}</td>
                            <td>{formatDate(request.dataFim)}</td>
                             <td>{request.horarioSaida}</td>
                            <td>
                              <span className={`badge ${getStatusBadge(request.status)} px-3 py-2`}>
                                {request.status}
                              </span>
                            </td>

                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewDetails(request)}
                                title="Ver detalhes"
                              >
                                <Eye size={18} />
                              </button>
                            </td>   
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Modal Nova Solicitação */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">📋 Nova Solicitação</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    
                   
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Data Início</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dataInicio"
                        value={formData.dataInicio}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Data Fim</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dataFim"
                        value={formData.dataFim}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Horário de Saída</label>
                      <input
                        type="time"
                        className="form-control"
                        name="horarioSaida"
                        value={formData.horarioSaida}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Origem</label>
                      <input
                        type="text"
                        className="form-control"
                        name="origem"
                        value={formData.origem}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Destino</label>
                      <input
                        type="text"
                        className="form-control"
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Motivo</label>
                      <textarea
                        className="form-control"
                        name="motivo"
                        rows={3}
                        value={formData.motivo}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar Solicitação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes da Solicitação */}
      {showDetailsModal && selectedRequest && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">📋 Detalhes da Solicitação</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Origem</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedRequest.origem}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Destino</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedRequest.destino}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Motivo da Rejeição</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={selectedRequest.motivoRejeicao || 'Não há motivo de rejeição'}
                      readOnly
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};