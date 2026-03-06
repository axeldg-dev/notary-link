import {client} from './client';
import type {components} from './generated';

export type RegisterPayload = components['schemas']['RegisterRequest'];
export type LoginPayload = components['schemas']['LoginRequest'];
export type AuthApiResponse = components['schemas']['AuthResponse'];

export async function registerApi(payload: RegisterPayload): Promise<AuthApiResponse> {
    const {data, error} = await client.POST('/api/auth/register', {body: payload});
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Registration failed');
    return data;
}

export async function loginApi(payload: LoginPayload): Promise<AuthApiResponse> {
    const {data, error} = await client.POST('/api/auth/login', {body: payload});
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Invalid credentials');
    return data;
}
