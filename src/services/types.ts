export type PerfilAcesso = "administrador" | "usuario" | "motorista" | "gestor";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Veiculo extends BaseEntity {
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  status: "disponivel" | "manutencao" | "reservado";
  quilometragem: number;
  dataUltimaManutencao: string; // ISO date
}

export interface Servidor extends BaseEntity {
  nome: string;
  matricula: string;
  setor: string;
  cargo: string;
  contato: string;
}

export interface Usuario extends BaseEntity {
  login: string; // usado como email
  nome: string;
  cpf: string;
  celular: string;
  perfil: PerfilAcesso;
  status: "ativo" | "inativo";
  fotoPerfil?: string;
  senhaHash: string;
}

export interface Setor extends BaseEntity {
  nome: string;
  responsavel: string;
  descricao?: string;
  pai?: string; // ID do setor pai para hierarquia
}

export interface Motorista extends BaseEntity {
  nome: string;
  cnhCategoria: string;
  cnhValidade: string; // ISO date
  disponibilidade: "disponivel" | "indisponivel";
}

export interface Manutencao extends BaseEntity {
  tipo: string;
  descricao: string;
  veiculoId: string;
  data: string; // ISO date
  custo: number;
  fornecedor: string;
}

export interface Alerta extends BaseEntity {
  tipo: string;
  descricao: string;
  data: string; // ISO date
  veiculoId?: string;
}

export interface SolicitacaoVeiculo extends BaseEntity {
  servidor: string;
  veiculoId: string;
  dataInicio: string; // ISO date
  dataFim: string; // ISO date
  horarioSaida: string; // HH:mm format
  origem: string;
  destino: string;
  motivo: string;
  quantidadePessoas: number;
  bagagemLitros: number;
  setorResponsavel: string;
  status: "pendente" | "aprovada" | "rejeitada";
  justificativa?: string;
  historico: Array<{ data: string; status: string; por: string; justificativa?: string }>; 
}

export type EntityMap = {
  veiculos: Veiculo;
  servidores: Servidor;
  usuarios: Usuario;
  setores: Setor;
  motoristas: Motorista;
  manutencoes: Manutencao;
  alertas: Alerta;
  solicitacoes: SolicitacaoVeiculo;
};
