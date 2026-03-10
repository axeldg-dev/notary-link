import { client } from './client';
import type { components } from './generated';

export type CreateProjectRequestDto = components['schemas']['CreateProjectRequest'];
export type UpdateProjectRequestDto = components['schemas']['UpdateProjectRequest'];
export type ProjectResponseDto = components['schemas']['ProjectResponse'];
export type ProjectDocumentsResponseDto = components['schemas']['ProjectDocumentsResponse'];
export type ProjectDocumentItemDto = components['schemas']['ProjectDocumentItem'];

export async function createProjectApi(request: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    const { data, error } = await client.POST('/api/projects', { body: request });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to create project');
    return data;
}

export async function getProjectsApi(): Promise<ProjectResponseDto[]> {
    const { data, error } = await client.GET('/api/projects');
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to fetch projects');
    return data;
}

export async function getProjectApi(id: string): Promise<ProjectResponseDto> {
    const { data, error } = await client.GET('/api/projects/{id}', { params: { path: { id } } });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Project not found');
    return data;
}

export async function updateProjectApi(id: string, request: UpdateProjectRequestDto): Promise<ProjectResponseDto> {
    const { data, error } = await client.PUT('/api/projects/{id}', { params: { path: { id } }, body: request });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to update project');
    return data;
}

export async function deleteProjectApi(id: string): Promise<void> {
    const { error } = await client.DELETE('/api/projects/{id}', { params: { path: { id } } });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to delete project');
}

export async function getProjectDocumentsApi(id: string): Promise<ProjectDocumentsResponseDto> {
    const { data, error } = await client.GET('/api/projects/{id}/documents', { params: { path: { id } } });
    if (error) throw new Error((error as components['schemas']['ErrorResponse']).message ?? 'Failed to fetch documents');
    return data;
}

export async function uploadDocumentApi(
    projectId: string,
    documentTypeId: string,
    file: File,
): Promise<ProjectDocumentItemDto> {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
        `/api/projects/${projectId}/documents/${documentTypeId}/upload`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token ?? ''}` },
            body: formData,
        },
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as components['schemas']['ErrorResponse']).message ?? 'Failed to upload document');
    }
    return response.json();
}
