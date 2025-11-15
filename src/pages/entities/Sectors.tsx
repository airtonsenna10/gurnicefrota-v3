import { useState } from "react";
import EntityManager from "@/components/EntityManager";

export default function SectorsPage() {
  const [showOrganogram, setShowOrganogram] = useState(false);
  
  const getSetorOptions = () => {
    const setores = JSON.parse(localStorage.getItem("setores") || "[]");
    return [
      { label: "Nenhum", value: "__none__" },
      ...setores.map((setor: any) => ({ label: setor.nome, value: setor.id }))
    ];
  };

  const buildHierarchy = (setores: any[]) => {
    const map = new Map();
    const roots: any[] = [];
    
    setores.forEach(setor => map.set(setor.id, { ...setor, children: [] }));
    
    setores.forEach(setor => {
      const node = map.get(setor.id);
      if (setor.pai && map.has(setor.pai)) {
        map.get(setor.pai).children.push(node);
      } else {
        roots.push(node);
      }
    });
    
    return roots;
  };

  const renderNode = (node: any, level = 0) => {
    const indent = "│   ".repeat(level);
    const prefix = level > 0 ? "├── " : "";
    
    return (
      <div key={node.id}>
        <div className="font-monospace small py-1">
          {indent}{prefix}{node.nome}
        </div>
        {node.children.map((child: any) => renderNode(child, level + 1))}
      </div>
    );
  };

  if (showOrganogram) {
    const setores = JSON.parse(localStorage.getItem("setores") || "[]");
    const hierarchy = buildHierarchy(setores);
    
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0">Organograma - Setores</h1>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setShowOrganogram(false)}
          >
            Voltar para Lista
          </button>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Estrutura Hierárquica</h5>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {hierarchy.length > 0 ? (
                <div>
                  {hierarchy.map(root => renderNode(root))}
                </div>
              ) : (
                <p className="text-muted text-center py-5 mb-0">
                  Nenhum setor cadastrado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Setores</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowOrganogram(true)}
        >
          Visualizar Organograma
        </button>
      </div>
      
      <EntityManager
        storageKey="setores"
        title="Setor"
        columns={[
          { key: "nome", label: "Nome" },
          { key: "gestor", label: "Gestor" },
          { key: "descricao", label: "Descrição" },
        ]}
        fields={[
          { key: "nome", label: "Nome do Setor", type: "text" },
          { key: "gestor", label: "Gestor", type: "text" },
          { key: "descricao", label: "Descrição", type: "textarea" },
          { 
            key: "pai", 
            label: "Setor Pai", 
            type: "select", 
            options: getSetorOptions() 
          },
        ]}
        transformOnSave={(data) => ({
          ...data,
          pai: data.pai && data.pai !== "__none__" ? data.pai : undefined,
        })}
      />
    </div>
  );
}
