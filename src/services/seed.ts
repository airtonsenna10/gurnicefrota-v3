import { addItem, listAll, saveAll, hash } from "./localdb";
import { Usuario, Setor, Veiculo } from "./types";

export async function seed() {
  // Usuarios
  const usuarios = listAll<Usuario>("usuarios");
  if (usuarios.length === 0) {
    const adminHash = await hash("admin123");
    const gestorHash = await hash("gestor123");
    addItem("usuarios", { login: "admin", nome: "Administrador", perfil: "administrador", senhaHash: adminHash });
    addItem("usuarios", { login: "gestor", nome: "Gestor Transporte", perfil: "gestor", senhaHash: gestorHash });
  }

  // Setores
  const setores = listAll<Setor>("setores");
  if (setores.length === 0) {
    addItem("setores", { nome: "Gestão de Transporte", responsavel: "Gestor Transporte", descricao: "Setor responsável por autorizações" });
  }

  // Veículos exemplo
  const veiculos = listAll<Veiculo>("veiculos");
  if (veiculos.length === 0) {
    addItem("veiculos", { placa: "ABC1D23", modelo: "Ônibus Escolar", ano: 2020, capacidade: 44, status: "disponivel", quilometragem: 45000, dataUltimaManutencao: new Date().toISOString().slice(0,10) });
    addItem("veiculos", { placa: "XYZ4E56", modelo: "Van Escolar", ano: 2019, capacidade: 15, status: "manutencao", quilometragem: 78000, dataUltimaManutencao: new Date().toISOString().slice(0,10) });
  }
}
