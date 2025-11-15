import React, { useState, useEffect } from 'react';
import { DashboardController, DashboardData } from '../../controllers/DashboardController';
import { Car } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const dashboardController = new DashboardController();

  useEffect(() => {
    const data = dashboardController.getDashboardData();
    setDashboardData(data);
  }, []);

  if (!dashboardData) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="h2 fw-bold text-primary mb-3">
              📊 Dashboard - Visão Geral
            </h1>
            <p className="text-muted">Acompanhe os indicadores principais do sistema</p>
          </div>
        </div>

        {/* Status dos Veículos */}
        <div className="row mb-5">
          <div className="col">
            <h3 className="h4 fw-semibold mb-3">Status dos Veículos</h3>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="d-flex justify-content-center mb-3">
                  <Car className="text-success" size={64} strokeWidth={2} />
                </div>
                <h5 className="card-title text-success fw-bold">Disponível</h5>
                <h2 className="display-4 fw-bold text-dark">{dashboardData.vehicleStats.disponivel}</h2>
                <p className="text-muted mb-0">veículos prontos para uso</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="display-4 text-warning mb-3">🔧</div>
                <h5 className="card-title text-warning fw-bold">Manutenção</h5>
                <h2 className="display-4 fw-bold text-dark">{dashboardData.vehicleStats.manutencao}</h2>
                <p className="text-muted mb-0">veículos em manutenção</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="display-4 text-info mb-3">📅</div>
                <h5 className="card-title text-info fw-bold">Reservado</h5>
                <h2 className="display-4 fw-bold text-dark">{dashboardData.vehicleStats.reservado}</h2>
                <p className="text-muted mb-0">veículos reservados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solicitações por Status */}
        <div className="row mb-3">
          <div className="col">
            <h3 className="h4 fw-semibold mb-3">Solicitações por Status</h3>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 border-start border-warning border-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title fw-bold mb-0">Pendente</h5>
                  <span className="badge bg-warning text-dark px-3 py-2">pendente</span>
                </div>
                <h2 className="display-4 fw-bold text-warning mb-2">
                  {dashboardData.requestStats.pendente}
                </h2>
                <p className="text-muted mb-0">aguardando aprovação</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 border-start border-success border-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title fw-bold mb-0">Aprovada</h5>
                  <span className="badge bg-success px-3 py-2">aprovada</span>
                </div>
                <h2 className="display-4 fw-bold text-success mb-2">
                  {dashboardData.requestStats.aprovada}
                </h2>
                <p className="text-muted mb-0">solicitações aprovadas</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 border-start border-danger border-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title fw-bold mb-0">Rejeitada</h5>
                  <span className="badge bg-danger px-3 py-2">rejeitada</span>
                </div>
                <h2 className="display-4 fw-bold text-danger mb-2">
                  {dashboardData.requestStats.rejeitada}
                </h2>
                <p className="text-muted mb-0">solicitações rejeitadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};