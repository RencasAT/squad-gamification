import { http } from '@gamification/shared-utils/api/http';
import type { AuthUser } from './auth.types';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type MeResponse = {
  data: AuthUser;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/login', payload);
  return data;
}

export async function fetchMeApi(): Promise<AuthUser> {
  const { data } = await http.get<MeResponse>('/me');
  return data.data;
}

export async function logoutApi(): Promise<void> {
  await http.post('/logout');
}

export async function changePasswordApi(
  payload: ChangePasswordRequest,
): Promise<void> {
  await http.put('/change-password', payload);
}
