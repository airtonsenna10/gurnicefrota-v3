import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { listAll, addItem } from "@/services/localdb";
import { SolicitacaoVeiculo } from "@/services/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Requests() {
  //const { user } = useAuth();
  const { user, hasRole, isFromSTA } = useAuth();
  const { toast } = useToast();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoVeiculo[]>([]);
  const [filters, setFilters] = useState<{ nome: string; data: string; status: "todas" | "pendente" | "aprovada" | "rejeitada" }>({ nome: "", data: "", status: "todas" });
  const [showForm, setShowForm] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");
  //const [form, setForm] = useState({ dataInicio: "", dataFim: "", origem: "", destino: "", motivo: "", quantidadePessoas: 1, bagagemLitros: 0 });
  const [form, setForm] = useState({ dataInicio: "", dataFim: "", horarioSaida: "", origem: "", destino: "", quantidadePessoas: 1, bagagemLitros: 0, motivo: "" });
 

  useEffect(() => {
    const allRequests = listAll<SolicitacaoVeiculo>("solicitacoes");
    
    // Admin e usuários do setor STA veem todas as solicitações
    if (hasRole('administrador') || isFromSTA()) {
      setSolicitacoes(allRequests);
    } else {
      // Demais usuários veem apenas suas próprias solicitações
      const userRequests = allRequests.filter(req => req.servidor === user?.nome);
      setSolicitacoes(userRequests);
    }
  }, [user, hasRole, isFromSTA]);


  useEffect(() => {
    document.title = "Solicitações de Veículos | Gestão de Frotas";
    const desc = "Gerencie, filtre e crie solicitações de uso de veículos.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload: Omit<SolicitacaoVeiculo, "id" | "createdAt" | "updatedAt"> = {
      servidor: user.nome,
      veiculoId: "",
      dataInicio: form.dataInicio,
      dataFim: form.dataFim,
      horarioSaida: form.horarioSaida,
      origem: form.origem,
      destino: form.destino,
      motivo: form.motivo,
      quantidadePessoas: Number(form.quantidadePessoas),
      bagagemLitros: Number(form.bagagemLitros),
      setorResponsavel: "Gestão de Transporte",
      status: "pendente",
      historico: [{ data: new Date().toISOString(), status: "pendente", por: user.nome }]
    };
    addItem("solicitacoes", payload);
    toast({ title: "Solicitação enviada", description: "Encaminhada ao setor responsável." });
    setForm({ dataInicio: "", dataFim: "", horarioSaida: "", origem: "", destino: "", quantidadePessoas: 1, bagagemLitros: 0, motivo: "" });
    //setForm({ dataInicio: "", dataFim: "", origem: "", destino: "", motivo: "", quantidadePessoas: 1, bagagemLitros: 0 });
    //setSolicitacoes(listAll<SolicitacaoVeiculo>("solicitacoes"));
    
    // Recarregar solicitações com o filtro apropriado
    const allRequests = listAll<SolicitacaoVeiculo>("solicitacoes");
    if (hasRole('administrador') || isFromSTA()) {
      setSolicitacoes(allRequests);
    } else {
      setSolicitacoes(allRequests.filter(req => req.servidor === user?.nome));
    }

    setShowForm(false);
  };

  const statusText: Record<SolicitacaoVeiculo["status"], string> = {
    pendente: "Aguardando",
    aprovada: "Aprovado",
    rejeitada: "Rejeitado",
  };
  const statusVariant: Record<SolicitacaoVeiculo["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pendente: "secondary",
    aprovada: "default",
    rejeitada: "destructive",
  };
  const filteredSolicitacoes = solicitacoes.filter((s) => {
    const matchesNome = !filters.nome || s.servidor.toLowerCase().includes(filters.nome.toLowerCase());
    const matchesData = !filters.data || s.dataInicio.startsWith(filters.data);
    const matchesStatus = filters.status === "todas" || s.status === filters.status;
    return matchesNome && matchesData && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 max-w-5xl">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Solicitações de Veículos</h1>
          <Button variant="brand" onClick={() => setShowForm(true)}>Nova Solicitação</Button>
        </header>

        <section aria-label="Filtros" className="bg-card border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Nome do solicitante</label>
              <Input placeholder="Buscar por nome" value={filters.nome} onChange={(e) => setFilters({ ...filters, nome: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Data</label>
              <Input type="date" value={filters.data} onChange={(e) => setFilters({ ...filters, data: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v as any })}>
                <SelectTrigger><SelectValue placeholder="Todos os status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos</SelectItem>
                  <SelectItem value="pendente">Aguardando</SelectItem>
                  <SelectItem value="aprovada">Aprovado</SelectItem>
                  <SelectItem value="rejeitada">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-label="Lista de solicitações" className="bg-card border rounded-lg">
          {filteredSolicitacoes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Data da Solicitação</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motivo da Rejeição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitacoes.map((s) => {
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{s.servidor}</TableCell>
                      <TableCell>{new Date(s.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(s.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(s.dataFim).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[s.status]}>{statusText[s.status]}</Badge>
                      </TableCell>
                      <TableCell>
                        {s.status === "rejeitada" && s.justificativa ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRejectionReason(s.justificativa);
                              setShowRejectionModal(true);
                            }}
                          >
                            Visualizar
                          </Button>
                        ) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Nenhuma solicitação encontrada.</div>
          )}
        </section>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md mx-auto" aria-describedby="nova-solicitacao-desc">
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
              <DialogDescription id="nova-solicitacao-desc">
                Preencha os dados para solicitar o uso do veículo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Data Início</label>
                  <Input type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data Fim</label>
                  <Input type="date" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} required />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Horário de Saída</label>
                <Input type="time" value={form.horarioSaida} onChange={(e) => setForm({ ...form, horarioSaida: e.target.value })} required />
              </div>


              <div>
                <label className="text-sm text-muted-foreground">Origem</label>
                <Input value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Destino</label>
                <Input value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Quantidade de Pessoas</label>
                  <Input 
                    type="number" 
                    min={1} 
                    placeholder="Informe a quantidade de passageiros"
                    value={form.quantidadePessoas} 
                    onChange={(e) => setForm({ ...form, quantidadePessoas: Number(e.target.value) })} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Bagagem (em litros)</label>
                  <Input 
                    type="number" 
                    min={0} 
                    placeholder="Capacidade estimada da bagagem em litros"
                    value={form.bagagemLitros} 
                    onChange={(e) => setForm({ ...form, bagagemLitros: Number(e.target.value) })} 
                    required 
                  />
                </div>
              </div>





              <div>
                <label className="text-sm text-muted-foreground">Motivo</label>
                <Input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} required />
              </div>


            
              <div className="flex items-center gap-2">
                <Button variant="brand" type="submit">Enviar Solicitação</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
          <DialogContent aria-describedby="motivo-rejeicao-desc">
            <DialogHeader>
              <DialogTitle>Motivo da Rejeição</DialogTitle>
              <DialogDescription id="motivo-rejeicao-desc">
                Detalhes sobre o motivo da rejeição da solicitação.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm leading-relaxed">{selectedRejectionReason}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
