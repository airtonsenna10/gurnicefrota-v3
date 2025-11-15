export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export abstract class BaseModel<T extends BaseEntity> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  protected read(): T[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  protected write(data: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getAll(): T[] {
    return this.read();
  }

  getById(id: string): T | undefined {
    return this.read().find(item => item.id === id);
  }

  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): string {
    const now = new Date().toISOString();
    const entity = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    } as T;
    
    const data = this.read();
    data.unshift(entity);
    this.write(data);
    return entity.id;
  }

  update(id: string, partial: Partial<T>): boolean {
    const data = this.read();
    const index = data.findIndex(item => item.id === id);
    
    if (index >= 0) {
      data[index] = {
        ...data[index],
        ...partial,
        updatedAt: new Date().toISOString()
      };
      this.write(data);
      return true;
    }
    return false;
  }

  delete(id: string): boolean {
    const data = this.read();
    const filteredData = data.filter(item => item.id !== id);
    
    if (filteredData.length !== data.length) {
      this.write(filteredData);
      return true;
    }
    return false;
  }

  count(): number {
    return this.read().length;
  }
}