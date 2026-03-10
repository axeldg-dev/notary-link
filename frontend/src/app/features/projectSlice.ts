import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createProjectApi } from '../api/projectApi';
import type { CreateProjectRequestDto, ProjectResponseDto } from '../api/projectApi';

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
            .addCase(createProject.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(createProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetProjectStatus } = projectSlice.actions;

export const selectProjects = (state: { project: ProjectState }) => state.project.projects;
export const selectProjectStatus = (state: { project: ProjectState }) => state.project.status;
export const selectProjectError = (state: { project: ProjectState }) => state.project.error;

export default projectSlice.reducer;
