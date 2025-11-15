import { UserModel } from '../models/UserModel';
import { VehicleModel } from '../models/VehicleModel';
import { RequestModel } from '../models/RequestModel';

export const initializeSeedData = async () => {
  console.log('🌱 Iniciando seed de dados...');
  const userModel = new UserModel();
  const vehicleModel = new VehicleModel();
  const requestModel = new RequestModel();

  // Check if data already exists
  const currentUserCount = userModel.count();
  console.log('👥 Usuários existentes:', currentUserCount);
  
  if (currentUserCount > 0) {
    console.log('⚠️ Dados já existem, pulando seed');
    return; // Data already seeded
  }

  // Create sample users
  await userModel.createWithPassword({
    nome: 'Administrador',
    login: 'admin@sistema.com',
    cpf: '123.456.789-00',
    celular: '(98) 99999-9999',
    perfil: 'administrador',
    status: 'ativo',
    fotoPerfil: '',
    senha: 'admin123'
  });

  await userModel.createWithPassword({
    nome: 'Usuário Teste',
    login: 'user@sistema.com',
    cpf: '987.654.321-00',
    celular: '(98) 88888-8888',
    perfil: 'usuario',
    status: 'ativo',
    fotoPerfil: '',
    senha: 'user123'
  });

  // Create sample vehicles
  vehicleModel.create({
    modelo: 'Civic',
    marca: 'Honda',
    placa: 'ABC-1234',
    ano: 2022,
    chassi: '1HGBH41JXMN109186',
    renavam: '12345678901',
    cor: 'Prata',
    combustivel: 'flex',
    quilometragem: 15000,
    status: 'disponivel',
    capacidadePassageiros: 5,
    categoria: 'passeio'
  });

  vehicleModel.create({
    modelo: 'Hilux',
    marca: 'Toyota',
    placa: 'DEF-5678',
    ano: 2021,
    chassi: '2HGBH41JXMN109187',
    renavam: '12345678902',
    cor: 'Branco',
    combustivel: 'diesel',
    quilometragem: 25000,
    status: 'manutencao',
    capacidadePassageiros: 5,
    categoria: 'utilitario'
  });

  vehicleModel.create({
    modelo: 'Corolla',
    marca: 'Toyota',
    placa: 'GHI-9012',
    ano: 2023,
    chassi: '3HGBH41JXMN109188',
    renavam: '12345678903',
    cor: 'Preto',
    combustivel: 'flex',
    quilometragem: 8000,
    status: 'reservado',
    capacidadePassageiros: 5,
    categoria: 'passeio'
  });

  // Create sample requests
  /*
  requestModel.create({
    servidor: 'João Silva',
    veiculoId: '',
    dataInicio: '2024-01-20',
    dataFim: '2024-01-22',
    horarioSaida: '08:00',
    origem: 'São Luís-MA',
    destino: 'Barra do Corda-MA',
    motivo: 'Reunião de secretários da educação',
    quantidadePessoas: 3,
    bagagemLitros: 50,
    setorResponsavel: 'Gestão de Transporte',
    status: 'pendente',
    justificativa: '',
     historico: [{ data: new Date().toISOString(), status: 'pendente', por: 'João Silva' }]
  });

  requestModel.create({
    servidor: 'Maria Santos',
    veiculoId: '',
    dataInicio: '2024-01-15',
    dataFim: '2024-01-16',
     horarioSaida: '07:30',
    origem: 'São Luís-MA',
    destino: 'Imperatriz-MA',
    motivo: 'Capacitação de servidores',
    quantidadePessoas: 5,
    bagagemLitros: 80,
    setorResponsavel: 'Gestão de Transporte',
    status: 'aprovada',
    justificativa: '',
     historico: [{ data: new Date().toISOString(), status: 'aprovada', por: 'Administrador' }]
  });

  requestModel.create({
    servidor: 'Pedro Oliveira',
    veiculoId: '',
    dataInicio: '2024-01-12',
    dataFim: '2024-01-14',
    horarioSaida: '09:00',
    origem: 'São Luís-MA',
    destino: 'Caxias-MA',
    motivo: 'Fiscalização de obras',
     quantidadePessoas: 2,
    bagagemLitros: 30,
    setorResponsavel: 'Gestão de Transporte',
    status: 'rejeitada',
    justificativa: 'Veículo não disponível no período solicitado',
    historico: [{ data: new Date().toISOString(), status: 'rejeitada', por: 'Administrador', justificativa: 'Veículo não disponível no período solicitado' }]
  });

  console.log('Dados de exemplo criados com sucesso!');
  */
};