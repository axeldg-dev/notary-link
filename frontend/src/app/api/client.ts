import createClient from 'openapi-fetch';
import type { paths } from './generated';

export const client = createClient<paths>({
  baseUrl: 'http://localhost:8080',
});

client.use({
  onRequest({ request }) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});
