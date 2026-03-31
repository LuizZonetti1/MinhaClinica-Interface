import { isAxiosError } from "axios";

export type EndpointRequest<TResult> = (endpoint: string) => Promise<TResult>;

type RequestFallbackOptions = {
  fallbackMessage?: string;
};

export const requestWithEndpointFallback = async <TResult>(
  endpoints: readonly string[],
  request: EndpointRequest<TResult>,
  options: RequestFallbackOptions = {},
): Promise<TResult> => {
  let lastNotFoundError: unknown;

  for (const endpoint of endpoints) {
    try {
      return await request(endpoint);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        lastNotFoundError = error;
        continue;
      }

      throw error;
    }
  }

  if (lastNotFoundError) {
    throw lastNotFoundError;
  }

  throw new Error(options.fallbackMessage ?? "Nao foi possivel completar a requisicao.");
};
