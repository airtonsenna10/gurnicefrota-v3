import { BaseEntity } from "./types";

export type StorageKey =
  | "veiculos"
  | "servidores"
  | "usuarios"
  | "setores"
  | "motoristas"
  | "manutencoes"
  | "alertas"
  | "solicitacoes";

const read = <T>(key: StorageKey): T[] => {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
};

const write = <T>(key: StorageKey, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const listAll = <T>(key: StorageKey): T[] => read<T>(key);

export const getById = <T extends BaseEntity>(key: StorageKey, id: string): T | undefined => {
  return read<T>(key).find((i) => (i as unknown as BaseEntity).id === id);
};

export const addItem = <T extends Omit<BaseEntity, "id" | "createdAt" | "updatedAt">>(
  key: StorageKey,
  item: T
) => {
  const now = new Date().toISOString();
  const entity: BaseEntity = { id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  const data = read<any>(key);
  data.unshift({ ...item, ...entity });
  write(key, data);
  return entity.id;
};

export const updateItem = <T extends BaseEntity>(key: StorageKey, id: string, partial: Partial<T>) => {
  const data = read<T>(key);
  const idx = data.findIndex((i) => i.id === id);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...partial, updatedAt: new Date().toISOString() };
    write(key, data);
  }
};

export const removeItem = (key: StorageKey, id: string) => {
  const data = read<BaseEntity>(key).filter((i) => i.id !== id);
  write(key, data);
};

export const saveAll = <T>(key: StorageKey, items: T[]) => write(key, items);

export async function hash(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}
