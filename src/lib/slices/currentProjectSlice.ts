import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project, FlowNode, FlowEdge, ProjectSettings } from "../schemas";

interface CurrentProjectState {
  project: Project | null;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

const initialState: CurrentProjectState = {
  project: null,
  loading: false,
  error: null,
  hasUnsavedChanges: false,
};

// 非同期アクション
export const fetchProject = createAsyncThunk(
  "currentProject/fetchProject",
  async (projectId: string) => {
    // TODO: Supabase実装時に追加
    return null as Project | null;
  }
);

export const saveProject = createAsyncThunk(
  "currentProject/saveProject",
  async (project: Project) => {
    // TODO: Supabase実装時に追加
    return project;
  }
);

const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.project = action.payload;
      state.hasUnsavedChanges = false;
    },
    updateNodes: (state, action: PayloadAction<FlowNode[]>) => {
      if (state.project) {
        state.project.data.nodes = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateEdges: (state, action: PayloadAction<FlowEdge[]>) => {
      if (state.project) {
        state.project.data.edges = action.payload;
        state.hasUnsavedChanges = true;
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<ProjectSettings>>) => {
      if (state.project) {
        state.project.data.settings = {
          ...state.project.data.settings,
          ...action.payload,
        };
        state.hasUnsavedChanges = true;
      }
    },
    addNode: (state, action: PayloadAction<FlowNode>) => {
      if (state.project) {
        state.project.data.nodes.push(action.payload);
        state.hasUnsavedChanges = true;
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      if (state.project) {
        state.project.data.nodes = state.project.data.nodes.filter(
          (node) => node.id !== action.payload
        );
        // 関連するエッジも削除
        state.project.data.edges = state.project.data.edges.filter(
          (edge) => edge.source !== action.payload && edge.target !== action.payload
        );
        state.hasUnsavedChanges = true;
      }
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<FlowNode> }>) => {
      if (state.project) {
        const nodeIndex = state.project.data.nodes.findIndex(
          (node) => node.id === action.payload.id
        );
        if (nodeIndex !== -1) {
          state.project.data.nodes[nodeIndex] = {
            ...state.project.data.nodes[nodeIndex],
            ...action.payload.data,
          };
          state.hasUnsavedChanges = true;
        }
      }
    },
    clearChanges: (state) => {
      state.hasUnsavedChanges = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProject
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
        state.hasUnsavedChanges = false;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "プロジェクトの読み込みに失敗しました";
      });

    // saveProject
    builder
      .addCase(saveProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
        state.hasUnsavedChanges = false;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "プロジェクトの保存に失敗しました";
      });
  },
});

export const {
  setCurrentProject,
  updateNodes,
  updateEdges,
  updateSettings,
  addNode,
  removeNode,
  updateNode,
  clearChanges,
  clearError,
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;