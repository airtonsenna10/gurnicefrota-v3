import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginView } from '@/views/pages/LoginView';

export const LoginWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Navegar para o dashboard após login bem-sucedido
    navigate('/dashboard');
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
};