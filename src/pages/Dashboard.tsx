import { useEffect, useMemo, useState } from "react";
import { listAll } from "@/services/localdb";
import { Veiculo, SolicitacaoVeiculo } from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoVeiculo[]>([]);

  useEffect(() => {
    setVeiculos(listAll<Veiculo>("veiculos"));
    setSolicitacoes(listAll<SolicitacaoVeiculo>("solicitacoes"));
  }, []);

  const stats = useMemo(() => ({
    total: veiculos.length,
    disponiveis: veiculos.filter(v => v.status === "disponivel").length,
    manutencao: veiculos.filter(v => v.status === "manutencao").length,
    reservado: veiculos.filter(v => v.status === "reservado").length,
  }), [veiculos]);

  const statusCounts = useMemo(() => {
    const counts = { pendente: 0, aprovada: 0, rejeitada: 0 } as Record<string, number>;
    solicitacoes.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
    return counts;
  }, [solicitacoes]);

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto py-6">
        <section className="rounded-xl p-6 bg-brand-gradient text-primary-foreground shadow-elevated">
          <h1 className="text-2xl font-semibold">Bem-vindo ao Guarnicé Frotas</h1>
          <p className="opacity-90">Mobilidade com Ritmo Maranhense.</p>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mt-6">
          <Card><CardHeader><CardTitle>Veículos</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.total}</CardContent></Card>
          <Card><CardHeader><CardTitle>Disponíveis</CardTitle></CardHeader><CardContent className="text-3xl font-semibold text-secondary">{stats.disponiveis}</CardContent></Card>
          <Card><CardHeader><CardTitle>Em Manutenção</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.manutencao}</CardContent></Card>
          <Card><CardHeader><CardTitle>Reservados</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{stats.reservado}</CardContent></Card>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Solicitações por Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pendente</CardTitle>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    pendente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statusCounts.pendente}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Aprovada</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    aprovada
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statusCounts.aprovada}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Rejeitada</CardTitle>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                    rejeitada
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statusCounts.rejeitada}</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
