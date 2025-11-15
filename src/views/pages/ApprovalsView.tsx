import React, { useState, useEffect } from 'react';
import { RequestController } from '../../controllers/RequestController';
import { SolicitacaoVeiculo } from '../../models/RequestModel';

export const ApprovalsView: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<SolicitacaoVeiculo[]>([]);
  const [justificativa, setJustificativa] = useState<{ [key: string]: string }>({});
  
  const requestController = new RequestController();

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = () => {
    const requests = requestController.getPendingRequests();
    setPendingRequests(requests);
  };

  const handleApprove = (id: string) => {
    if (requestController.approveRequest(id)) {
      loadPendingRequests();
      showToast('Solicitação aprovada com sucesso!', 'success');
    }
  };

  const handleReject = (id: string) => {
    const reason = justificativa[id];
    if (!reason?.trim()) {
      showToast('Justificativa é obrigatória para rejeição', 'error');
      return;
    }
    
    if (requestController.rejectRequest(id, reason)) {
      loadPendingRequests();
      setJustificativa(prev => ({ ...prev, [id]: '' }));
      showToast('Solicitação rejeitada', 'error');
    }
  };

  const handleJustificativaChange = (id: string, value: string) => {
    setJustificativa(prev => ({ ...prev, [id]: value }));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple alert for now - in a real app you'd use a proper toast library
    alert(message);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="h2 fw-bold text-primary mb-1">
              ✅ Autorizações Pendentes
            </h1>
            <p className="text-muted">
              Analise e aprove as solicitações de veículos pendentes
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="row">
          <div className="col">
            {pendingRequests.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="display-1 text-muted mb-3">✅</div>
                  <h4 className="text-muted">Nenhuma solicitação pendente</h4>
                  <p className="text-muted">Todas as solicitações foram processadas</p>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-4">
                        {/* Linha 1: Solicitante e Data */}
                        <div className="row mb-3">
                          <div className="col">
                            <p className="mb-0">
                              <strong>Solicitante:</strong> {request.servidor} • 
                              <strong> Data da Solicitação:</strong> {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Linha 2: Origem e Destino */}
                        <div className="row mb-3">
                          <div className="col">
                            <p className="mb-0">
                              <strong>Origem:</strong> {request.origem} • 
                              <strong> Destino:</strong> {request.destino}
                            </p>
                          </div>
                        </div>

                        {/* Linha 3: Datas da Viagem e horarrio*/}
                        <div className="row mb-3">
                          <div className="col">
                            <p className="mb-0">
                              <strong>Data Início:</strong> {formatDate(request.dataInicio)} • 
                              <strong> Data Fim:</strong> {formatDate(request.dataFim)}    
                              <strong> Horário de Saída:</strong> {request.horarioSaida}
                            </p>
                          </div>
                        </div>

                         {/* Linha 4: Passageiros e Bagagem */}
                        <div className="row mb-3">
                          <div className="col">
                            <p className="mb-0">
                              <strong>Quantidade de Pessoas:</strong> {request.quantidadePessoas} •
                              <strong> Bagagem:</strong> {request.bagagemLitros}L
                            </p>
                          </div>
                        </div>

                        {/* Linha 5: Motivo */}
                        <div className="row mb-3">
                          <div className="col">
                            <p className="mb-0">
                              <strong>Motivo:</strong> {request.motivo}
                            </p>
                          </div>
                        </div>

                        {/* Linha 6: Justificativa */}
                        <div className="row mb-4">
                          <div className="col">
                            <label className="form-label fw-semibold">
                              Justificativa (obrigatória para rejeição)
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              value={justificativa[request.id] || ''}
                              onChange={(e) => handleJustificativaChange(request.id, e.target.value)}
                              placeholder="Digite a justificativa para aprovação ou rejeição..."
                            />
                          </div>
                        </div>

                        {/* Linha 7: Botões de Ação */}
                        <div className="row">
                          <div className="col">
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success px-4"
                                onClick={() => handleApprove(request.id)}
                              >
                                ✅ Aprovar
                              </button>
                              <button
                                className="btn btn-danger px-4"
                                onClick={() => handleReject(request.id)}
                              >
                                ❌ Rejeitar
                              </button>
                              <button
                                className="btn btn-secondary px-4"
                                onClick={() => {
                                  // Logic to cancel request
                                  if (confirm('Tem certeza que deseja cancelar esta solicitação?')) {
                                    // Implementation for cancel functionality
                                  }
                                }}
                              >
                                🚫 Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
  );
};