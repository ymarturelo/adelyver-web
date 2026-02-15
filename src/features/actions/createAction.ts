import { getIoc, IocRegistry } from "../ioc";

type ControllerKeys = keyof IocRegistry;

export function createAction<
  K extends ControllerKeys,
  M extends keyof IocRegistry[K]
>(controller: K, method: M): IocRegistry[K][M] {
  const callback = async (...args: unknown[]) => {
    const ioc = getIoc();
    const instance = ioc[controller];

    return await (instance[method] as (...args: unknown[]) => unknown)(...args);
  };

  return callback as IocRegistry[K][M];
}
