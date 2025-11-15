import { BaseModel, BaseEntity } from './BaseModel';

export interface SolicitacaoVeiculo extends BaseEntity {
  servidor: string;
  veiculoId: string;
  dataInicio: string;
  dataFim: string;
  horarioSaida: string;
  origem: string;
  destino: string;
  motivo: string;
  quantidadePessoas: number;
  bagagemLitros: number;
  setorResponsavel: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  motivoRejeicao?: string;
  justificativa?: string;
  historico: Array<{ data: string; status: string; por: string; justificativa?: string }>;
}

export class RequestModel extends BaseModel<SolicitacaoVeiculo> {
  constructor() {
    super('solicitacoes');
  }

  getByStatus(status: 'pendente' | 'aprovada' | 'rejeitada'): SolicitacaoVeiculo[] {
    return this.getAll().filter(request => request.status === status);
  }

  getPendingRequests(): SolicitacaoVeiculo[] {
    return this.getByStatus('pendente');
  }

  approveRequest(id: string): boolean {
    return this.update(id, { status: 'aprovada' });
  }

  rejectRequest(id: string, motivoRejeicao: string): boolean {
    return this.update(id, { 
      status: 'rejeitada', 
      motivoRejeicao 
    });
  }

  getStatusCounts(): { pendente: number; aprovada: number; rejeitada: number } {
    const requests = this.getAll();
    return {
      pendente: requests.filter(r => r.status === 'pendente').length,
      aprovada: requests.filter(r => r.status === 'aprovada').length,
      rejeitada: requests.filter(r => r.status === 'rejeitada').length
    };
  }
}