import { client } from './client';
import type { components } from './generated';

export type CreateProjectRequestDto = components['schemas']['CreateProjectRequest'];
export type ProjectResponseDto = components['schemas']['ProjectResponse'];

export async function createProjectApi(request: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    const { data, error } = await client.POST('/api/projects', { body: request });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to create project');
    return data;
}
