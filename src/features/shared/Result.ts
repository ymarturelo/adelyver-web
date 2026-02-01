export type SuccessResult<T> = {
  data: T;
  ok: true;
};

export type DomainError = {
  code: string;
  message?: string;
  path?: string[];
  data?: unknown;
};

export type ErrorResult = {
  error: DomainError;
  ok: false;
};

export type Result<T> = SuccessResult<T> | ErrorResult;

function ok<T>(data: T): Result<T> {
  return {
    data,
    ok: true,
  };
}

function err(error: DomainError): ErrorResult {
  return {
    error,
    ok: false,
  };
}

export const Result = {
  ok,
  err,
};
