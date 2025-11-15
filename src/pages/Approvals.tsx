import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listAll, updateItem } from "@/services/localdb";
import { SolicitacaoVeiculo, Veiculo } from "@/services/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Approvals() {
  const [items, setItems] = useState<SolicitacaoVeiculo[]>([]);
  const [mapVeiculos, setMapVeiculos] = useState<Record<string, Veiculo>>({});
  const [just, setJust] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const veiculos = listAll<Veiculo>("veiculos");
    setMapVeiculos(Object.fromEntries(veiculos.map(v => [v.id, v])));
    setItems(listAll<SolicitacaoVeiculo>("solicitacoes").filter(s => s.status === "pendente"));
  }, []);

  const act = (s: SolicitacaoVeiculo, aprovar: boolean) => {
    const status = aprovar ? "aprovada" : "rejeitada";
    updateItem<SolicitacaoVeiculo>("solicitacoes", s.id, {
      status,
      justificativa: just[s.id],
      historico: [...s.historico, { data: new Date().toISOString(), status, por: user?.nome || "sistema", justificativa: just[s.id] }]
    });
    toast({ title: `Solicitação ${status}`, description: aprovar ? "Aprovada com sucesso." : "Rejeitada com justificativa." });
    setItems(prev => prev.filter(i => i.id !== s.id));
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">Autorizações Pendentes</h1>
        <div className="grid gap-4">
          {items.map(s => (
            <div key={s.id} className="border rounded-lg p-4 bg-card space-y-3">
              {/* Primeira linha: Solicitante e Data da Solicitação */}
              <div className="text-sm">
                <span className="font-medium">Solicitante:</span> {s.servidor} • <span className="font-medium">Data da Solicitação:</span> {new Date(s.createdAt).toLocaleDateString('pt-BR')}
              </div>
              
              {/* Segunda linha: Origem e Destino */}
              <div className="text-sm">
                <span className="font-medium">Origem:</span> {s.origem} • <span className="font-medium">Destino:</span> {s.destino}
              </div>
              
              {/* Terceira linha: Data Início e Data Fim */}
              <div className="text-sm">
                <span className="font-medium">Data Início:</span> {new Date(s.dataInicio).toLocaleDateString('pt-BR')} • <span className="font-medium">Data Fim:</span> {new Date(s.dataFim).toLocaleDateString('pt-BR')}
              </div>
              
              {/* Quarta linha: Motivo */}
              <div className="text-sm">
                <span className="font-medium">Motivo:</span> {s.motivo}
              </div>
              
              {/* Quinta linha: Campo de Justificativa */}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Justificativa (obrigatória ao rejeitar)
                </label>
                <Textarea 
                  value={just[s.id] || ""} 
                  onChange={(e) => setJust({ ...just, [s.id]: e.target.value })}
                  placeholder="Digite a justificativa aqui..."
                  className="min-h-[80px]"
                />
              </div>
              
              {/* Sexta linha: Botões de Ação */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="default" onClick={() => act(s, true)} className="bg-blue-600 hover:bg-blue-700">
                  Aprovar
                </Button>
                <Button variant="destructive" onClick={() => act(s, false)}>
                  Rejeitar
                </Button>
                <Button variant="secondary">
                  Cancelar
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground">Sem solicitações pendentes.</p>
          )}
        </div>
      </main>
    </div>
  );
}
