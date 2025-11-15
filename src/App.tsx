import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginWrapper } from "@/components/LoginWrapper";
import { DashboardView } from "@/views/pages/DashboardView";
import { RequestsView } from "@/views/pages/RequestsView";
import { ApprovalsView } from "@/views/pages/ApprovalsView";
import { VehiclesView } from "@/views/pages/VehiclesView";
import { ServersView } from "@/views/pages/ServersView";
import { UsersView } from "@/views/pages/UsersView";
import { SectorsView } from "@/views/pages/SectorsView";
import { DriversView } from "@/views/pages/DriversView";
import { MaintenanceView } from "@/views/pages/MaintenanceView";
import { AlertsView } from "@/views/pages/AlertsView";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";
import RestrictedRoute from "@/routes/RestrictedRoute";
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/solicitacoes" element={<RequestsView />} />
              <Route path="/aprovacoes" element={<RestrictedRoute><ApprovalsView /></RestrictedRoute>} />
              <Route path="/veiculos" element={<RestrictedRoute><VehiclesView /></RestrictedRoute>} />
              <Route path="/servidores" element={<RestrictedRoute><ServersView /></RestrictedRoute>} />
              <Route path="/usuarios" element={<RestrictedRoute><UsersView /></RestrictedRoute>} />
              <Route path="/setores" element={<RestrictedRoute><SectorsView /></RestrictedRoute>} />
              <Route path="/motoristas" element={<RestrictedRoute><DriversView /></RestrictedRoute>} />
              <Route path="/manutencoes" element={<RestrictedRoute><MaintenanceView /></RestrictedRoute>} />
              <Route path="/alertas" element={<RestrictedRoute><AlertsView /></RestrictedRoute>} />

              
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
