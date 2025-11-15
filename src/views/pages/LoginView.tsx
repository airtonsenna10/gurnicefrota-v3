import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const ok = await login(formData.login, formData.password);
      if (ok) {
        onLoginSuccess();
      } else {
        setError('Credenciais inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/lovable-uploads/logo-3.png" 
                    alt="Logo" 
                    className="img-fluid mb-15"
                    style={{ maxHeight: '100px' }}
                  />
                 {/*<h3 className="fw-bold text-primary">Sistema de Gestão de Frotas</h3>*/}
                  <p className="text-muted">Faça login para continuar</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="login" className="form-label fw-semibold">
                      Email ou Login
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="login"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      required
                      placeholder="Digite seu email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Digite sua senha"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </form>

                <hr className="my-4" />
                
                <div className="text-center">
                  <small className="text-muted">
                    Esqueceu sua senha? Entre em contato com o administrador.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};