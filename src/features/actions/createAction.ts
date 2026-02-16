import { db, TransactionType } from "../implementations/db";
import { getIoc, IocRegistry } from "../ioc";

export default function createAction<P extends unknown[], R>(
  callback: (
    ioc: IocRegistry,
    tx: TransactionType
  ) => (...args: P) => Promise<R>
) {
  return async (...args: P): Promise<R> => {
    return await db.transaction(async (tx) => {
      const ioc = getIoc(tx);

      const method = callback(ioc, tx);

      return await method(...args);
    });
  };
}
