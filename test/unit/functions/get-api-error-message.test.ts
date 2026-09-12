import { describe, expect, it } from 'vitest';
import axios from 'axios';
import {
  getApiErrorMessage,
  isApiNotFound,
} from '@gamification/shared-utils/utils/get-api-error-message';

function axiosError(status: number, message?: string) {
  return new axios.AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      status,
      statusText: 'Error',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
      data: message ? { message } : {},
    },
  );
}

describe('getApiErrorMessage', () => {
  it('extrae message del body de un AxiosError', () => {
    expect(getApiErrorMessage(axiosError(401, 'Credenciales inválidas'))).toBe(
      'Credenciales inválidas',
    );
  });

  it('usa el message de un Error genérico', () => {
    expect(getApiErrorMessage(new Error('Fallo de red'))).toBe('Fallo de red');
  });

  it('usa el fallback cuando no hay mensaje útil', () => {
    expect(getApiErrorMessage(null, 'Error de login')).toBe('Error de login');
    expect(getApiErrorMessage({})).toBe('Ocurrió un error inesperado');
  });
});

describe('isApiNotFound', () => {
  it('detecta un 404 de Axios', () => {
    expect(isApiNotFound(axiosError(404, 'Cliente no encontrado'))).toBe(true);
    expect(isApiNotFound(axiosError(500))).toBe(false);
    expect(isApiNotFound(new Error('Fallo'))).toBe(false);
  });
});
