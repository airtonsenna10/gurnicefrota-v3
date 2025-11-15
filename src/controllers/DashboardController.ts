import { VehicleModel } from '../models/VehicleModel';
import { RequestModel } from '../models/RequestModel';

export interface DashboardData {
  vehicleStats: {
    disponivel: number;
    manutencao: number;
    reservado: number;
    total: number;
  };
  requestStats: {
    pendente: number;
    aprovada: number;
    rejeitada: number;
    total: number;
  };
}

export class DashboardController {
  private vehicleModel: VehicleModel;
  private requestModel: RequestModel;

  constructor() {
    this.vehicleModel = new VehicleModel();
    this.requestModel = new RequestModel();
  }

  getDashboardData(): DashboardData {
    const vehicleCounts = this.vehicleModel.getStatusCounts();
    const requestCounts = this.requestModel.getStatusCounts();

    return {
      vehicleStats: {
        ...vehicleCounts,
        total: vehicleCounts.disponivel + vehicleCounts.manutencao + vehicleCounts.reservado
      },
      requestStats: {
        ...requestCounts,
        total: requestCounts.pendente + requestCounts.aprovada + requestCounts.rejeitada
      }
    };
  }
}