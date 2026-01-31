import { Result } from "./Result";

export interface IRepository<T> {
  getAll: () => Promise<Result<T[]>>;
  getById: (id: string) => Promise<Result<T | null>>;
  create: (data: T) => Promise<Result<T>>;
  update: (id: string, data: Partial<T>) => Promise<Result<T>>;
  delete: (id: string) => Promise<Result<void>>;
}