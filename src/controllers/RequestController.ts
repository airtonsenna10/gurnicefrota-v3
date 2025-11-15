import { RequestModel, SolicitacaoVeiculo } from '../models/RequestModel';

export class RequestController {
  private requestModel: RequestModel;

  constructor() {
    this.requestModel = new RequestModel();
  }

  getAllRequests(): SolicitacaoVeiculo[] {
    return this.requestModel.getAll();
  }

  getRequestById(id: string): SolicitacaoVeiculo | undefined {
    return this.requestModel.getById(id);
  }

  createRequest(requestData: Omit<SolicitacaoVeiculo, 'id' | 'createdAt' | 'updatedAt'>): string {
    return this.requestModel.create(requestData);
  }

  updateRequest(id: string, updates: Partial<SolicitacaoVeiculo>): boolean {
    return this.requestModel.update(id, updates);
  }

  deleteRequest(id: string): boolean {
    return this.requestModel.delete(id);
  }

  getPendingRequests(): SolicitacaoVeiculo[] {
    return this.requestModel.getPendingRequests();
  }

  approveRequest(id: string): boolean {
    return this.requestModel.approveRequest(id);
  }

  rejectRequest(id: string, reason: string): boolean {
    return this.requestModel.rejectRequest(id, reason);
  }

  getRequestsByStatus(status: 'pendente' | 'aprovada' | 'rejeitada'): SolicitacaoVeiculo[] {
    return this.requestModel.getByStatus(status);
  }
}