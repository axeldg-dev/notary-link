import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createProjectApi,
    getProjectsApi,
    updateProjectApi,
    deleteProjectApi,
} from '../api/projectApi';
import type { CreateProjectRequestDto, UpdateProjectRequestDto, ProjectResponseDto } from '../api/projectApi';

interface ProjectState {
    projects: ProjectResponseDto[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    status: 'idle',
    error: null,
};

export const fetchProjects = createAsyncThunk<ProjectResponseDto[]>(
    'project/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getProjectsApi();
        } catch (err: unknown) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const createProject = createAsyncThunk<ProjectResponseDto, CreateProjectRequestDto>(
    'project/create',
    async (request, { rejectWithValue }) => {
        try {
            return await createProjectApi(request);
        } catch (err: unknown) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const updateProject = createAsyncThunk<ProjectResponseDto, { id: string; request: UpdateProjectRequestDto }>(
    'project/update',
    async ({ id, request }, { rejectWithValue }) => {
        try {
            return await updateProjectApi(id, request);
        } catch (err: unknown) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const deleteProject = createAsyncThunk<string, string>(
    'project/delete',
    async (id, { rejectWithValue }) => {
        try {
            await deleteProjectApi(id);
            return id;
        } catch (err: unknown) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        resetProjectStatus(state) {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(createProject.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(createProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects.unshift(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(updateProject.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const idx = state.projects.findIndex(p => p.id === action.payload.id);
                if (idx !== -1) state.projects[idx] = action.payload;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { resetProjectStatus } = projectSlice.actions;

export const selectProjects = (state: { project: ProjectState }) => state.project.projects;
export const selectProjectStatus = (state: { project: ProjectState }) => state.project.status;
export const selectProjectError = (state: { project: ProjectState }) => state.project.error;

export default projectSlice.reducer;
