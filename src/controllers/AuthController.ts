import { UserModel, User } from '../models/UserModel';

export class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async login(login: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 Tentativa de login para:', login);
      const allUsers = this.userModel.getAll();
      console.log('👥 Total de usuários cadastrados:', allUsers.length);
      console.log('👤 Usuários:', allUsers.map(u => ({ login: u.login, perfil: u.perfil, status: u.status })));
      
      const user = await this.userModel.validatePassword(login, password);
      
      if (user) {
        console.log('✅ Login bem-sucedido para:', user.nome);
        // Store user in session/localStorage for auth context
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      } else {
        console.log('❌ Credenciais inválidas para:', login);
        return { success: false, message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('💥 Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: 'administrador' | 'usuario'): boolean {
    const user = this.getCurrentUser();
    return user ? user.perfil === role : false;
  }
}