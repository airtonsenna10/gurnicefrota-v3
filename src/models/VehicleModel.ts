import { BaseModel, BaseEntity } from './BaseModel';

export interface Veiculo extends BaseEntity {
  modelo: string;
  marca: string;
  placa: string;
  ano: number;
  chassi: string;
  renavam: string;
  cor: string;
  combustivel: 'flex' | 'gasolina' | 'etanol' | 'diesel';
  quilometragem: number;
  status: 'disponivel' | 'manutencao' | 'reservado';
  capacidadePassageiros: number;
  categoria: 'passeio' | 'utilitario' | 'caminhao' | 'motocicleta';
}

export class VehicleModel extends BaseModel<Veiculo> {
  constructor() {
    super('veiculos');
  }

  getByStatus(status: 'disponivel' | 'manutencao' | 'reservado'): Veiculo[] {
    return this.getAll().filter(vehicle => vehicle.status === status);
  }

  getAvailableVehicles(): Veiculo[] {
    return this.getByStatus('disponivel');
  }

  getStatusCounts(): { disponivel: number; manutencao: number; reservado: number } {
    const vehicles = this.getAll();
    return {
      disponivel: vehicles.filter(v => v.status === 'disponivel').length,
      manutencao: vehicles.filter(v => v.status === 'manutencao').length,
      reservado: vehicles.filter(v => v.status === 'reservado').length
    };
  }

  updateStatus(id: string, status: 'disponivel' | 'manutencao' | 'reservado'): boolean {
    return this.update(id, { status });
  }
}