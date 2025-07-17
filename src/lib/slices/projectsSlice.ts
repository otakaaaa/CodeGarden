import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../schemas";

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

// 非同期アクション（後でSupabase連携時に実装）
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    // TODO: Supabase実装時に追加
    return [] as Project[];
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: { name: string }) => {
    // TODO: Supabase実装時に追加
    const newProject: Project = {
      id: crypto.randomUUID(),
      user_id: "temp-user-id",
      name: projectData.name,
      data: {
        nodes: [],
        edges: [],
        settings: {
          theme: "light",
          previewMode: false,
          variables: {},
        },
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
    };
    return newProject;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string) => {
    // TODO: Supabase実装時に追加
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