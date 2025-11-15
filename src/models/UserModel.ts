import { BaseModel, BaseEntity } from './BaseModel';

export interface User extends BaseEntity {
  nome: string;
  login: string;
  cpf: string;
  celular: string;
  perfil: 'administrador' | 'usuario';
  status: 'ativo' | 'inativo';
  fotoPerfil?: string;
  senhaHash: string;
}

export class UserModel extends BaseModel<User> {
  constructor() {
    super('usuarios');
  }

  async validatePassword(login: string, password: string): Promise<User | null> {
    const users = this.getAll();
    console.log('🔍 Buscando usuário com login:', login);
    const user = users.find(u => u.login === login && u.status === 'ativo');
    
    if (user) {
      console.log('👤 Usuário encontrado:', user.nome);
      const passwordHash = await this.hashPassword(password);
      console.log('🔑 Hash da senha informada:', passwordHash);
      console.log('🔑 Hash armazenado:', user.senhaHash);
      if (user.senhaHash === passwordHash) {
        console.log('✅ Senha correta!');
        return user;
      } else {
        console.log('❌ Senha incorreta!');
      }
    } else {
      console.log('❌ Usuário não encontrado ou inativo');
    }
    return null;
  }

  async createWithPassword(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'senhaHash'> & { senha: string }): Promise<string> {
    const { senha, ...rest } = userData;
    const senhaHash = await this.hashPassword(senha);
    return this.create({ ...rest, senhaHash });
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}