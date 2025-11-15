import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { seed } from "@/services/seed";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", senha: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    seed();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await login(form.login, form.senha);
    if (!ok) {
      setError("Credenciais inválidas.");
      toast({ title: "Falha no login", description: "Credenciais inválidas.", variant: "destructive" as any });
    } else {
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
      navigate("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-gradient p-4">
      <section className="w-full max-w-sm">
        <form onSubmit={submit} className="w-full bg-card border rounded-lg p-6 shadow-elevated">
          <header className="text-center mb-4">
            <img src="/lovable-uploads/f655a59c-4ce0-47ae-987d-f255a50b6af8.png" alt="Logo Guarnicé Frotas" className="h-20 md:h-24 mx-auto mb-3 object-contain" loading="lazy" decoding="async" />
            <h1 className="text-2xl font-semibold">Acessar Guarnicé Frotas</h1>
          </header>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Login</label>
              <Input value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Senha</label>
              <Input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </div>
          <Button variant="brand" className="w-full mt-6" type="submit">Entrar</Button>
          <p className="text-xs text-muted-foreground mt-3">Sugestão: admin / admin123 — gestor / gestor123</p>
        </form>
      </section>
    </main>
  );
}
