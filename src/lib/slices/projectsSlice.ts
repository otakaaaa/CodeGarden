import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project, CreateProject } from "../schemas";
import * as projectsApi from "../supabase/projects";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

// 非同期アクション
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    return await projectsApi.fetchProjects();
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: CreateProject) => {
    return await projectsApi.createProject(projectData);
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string) => {
    await projectsApi.deleteProject(projectId);
    return projectId;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "プロジェクトの取得に失敗しました";
      });

    // createProject
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "プロジェクトの作成に失敗しました";
      });

    // deleteProject
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "プロジェクトの削除に失敗しました";
      });
  },
});

export const { setProjects, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;