import 'server-only';
import { redirect } from 'next/navigation';
import { LocalApiError, dispatchLocalApi } from '@/server/dispatch';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly body?: unknown) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await dispatchLocalApi<T>(path, init);
  } catch (error) {
    if (error instanceof LocalApiError) {
      if (error.status === 401) redirect('/login');
      throw new ApiError(error.message,error.status,error.details);
    }
    throw error;
  }
}
