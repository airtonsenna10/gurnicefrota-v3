import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index-bootstrap.css'
import { initializeSeedData } from './services/seedData'
import { UserModel } from './models/UserModel'

// Ensure default MVC demo users exist even if old data is present
const ensureDefaultUsers = async () => {
  try {
    const userModel = new UserModel();
    const users = userModel.getAll();
    const ensure = async (login: string, nome: string, perfil: 'administrador' | 'usuario', senha: string) => {
      if (!users.some(u => u.login === login)) {
        console.log('➕ Criando usuário padrão:', login);
        await userModel.createWithPassword({
          nome,
          login,
          cpf: '',
          celular: '',
          perfil,
          status: 'ativo',
          fotoPerfil: '',
          senha
        });
      } else {
        console.log('✅ Usuário já existe:', login);
      }
    };
    await ensure('admin@sistema.com', 'Administrador', 'administrador', 'admin123');
    await ensure('user@sistema.com', 'Usuário Teste', 'usuario', 'user123');
  } catch (e) {
    console.warn('Não foi possível garantir usuários padrão:', e);
  }
};

// Initialize sample data and defaults
ensureDefaultUsers();
initializeSeedData();

createRoot(document.getElementById("root")!).render(<App />);
