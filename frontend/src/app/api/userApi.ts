import {client} from './client';
import type {components} from './generated';

export type UserDto = components['schemas']['User'];

export async function getCurrentUserApi(): Promise<UserDto> {
    const {data, error} = await client.GET('/api/user/me');
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Unauthorized');
    return data;
}

export async function verifyOtpApi(email: string, code: string): Promise<void> {
    const {data, error} = await client.POST('/api/auth/verify-otp', {body: {email, code}});
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Code invalide ou expiré');
}

export async function resendOtpApi(email: string): Promise<void> {
    const {error} = await client.POST('/api/auth/resend-otp', {body: {email}});
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Erreur lors de l\'envoi');
}
