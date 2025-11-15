import React, { useMemo, useState } from "react";

export type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  options?: { label: string; value: string }[];
};

interface Props<T extends { id: string }> {
  storageKey: string;
  title: string;
  columns: { key: keyof T | string; label: string }[];
  fields: Field[];
  detailFields?: { key: string; label: string }[];
  transformOnSave?: (data: any) => any;
}

export default function EntityManager<T extends { id: string }>({ storageKey, title, columns, fields, detailFields, transformOnSave }: Props<T>) {
  const [items, setItems] = useState<any[]>(() => JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);

  const reset = () => setEditing({});

  const save = async () => {
    const now = new Date().toISOString();
    const payloadRaw = transformOnSave ? await transformOnSave(editing) : editing;
    const payload = payloadRaw ?? editing;
    if (editing.id) {
      const updated = items.map((i) => (i.id === editing.id ? { ...i, ...payload, updatedAt: now } : i));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
    } else {
      const entity = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...payload };
      const updated = [entity, ...items];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
    }
    setEditing(null);
  };
  const remove = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setItems(updated);
  };

  const headers = useMemo(() => columns.map((c) => c.label), [columns]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">{title}</h1>
        <button className="btn btn-primary" onClick={reset}>
          <i className="bi bi-plus-circle me-2"></i>Novo
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((c) => (
                      <td key={String(c.key)}>
                        {c.key === 'status' ? (
                          <span className={`badge ${
                            item[c.key] === 'disponivel' ? 'bg-success' :
                            item[c.key] === 'em_uso' ? 'bg-warning' :
                            item[c.key] === 'manutencao' ? 'bg-danger' :
                            item[c.key] === 'reservado' ? 'bg-secondary' : 'bg-secondary'
                          }`}>
                            {String(item[c.key as any] ?? "")}
                          </span>
                        ) : (
                          String(item[c.key as any] ?? "")
                        )}
                      </td>
                    ))}
                    <td>
                      {detailFields && (
                        <button className="btn btn-sm btn-info me-2" onClick={() => setViewing(item)}>
                          Visualizar
                        </button>
                      )}
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditing(item)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-4 text-muted">
                      Sem registros ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing !== null && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setEditing(null)}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing.id ? "Editar" : "Novo"} {title}</h5>
                <button type="button" className="btn-close" onClick={() => setEditing(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {fields.map((f) => (
                    <div key={f.key} className="col-md-6">
                      <label htmlFor={f.key} className="form-label">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea 
                          id={f.key} 
                          className="form-control" 
                          value={editing[f.key] || ""} 
                          onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} 
                          rows={3}
                        />
                      ) : f.type === "select" ? (
                        <select 
                          id={f.key} 
                          className="form-select" 
                          value={editing[f.key] ?? ""} 
                          onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                        >
                          <option value="">Selecionar...</option>
                          {f.options?.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          id={f.key} 
                          type={f.type} 
                          className="form-control" 
                          value={editing[f.key] || ""} 
                          onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={save}>Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewing !== null && detailFields && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setViewing(null)}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do {title}</h5>
                <button type="button" className="btn-close" onClick={() => setViewing(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {detailFields.map((field) => (
                    <div key={field.key} className="col-md-6">
                      <label className="form-label fw-bold">{field.label}</label>
                      <div className="p-3 bg-light rounded border">
                        <span>{viewing[field.key] || "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setViewing(null)}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
