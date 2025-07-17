import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState } from "../schemas";

const initialState: UIState = {
  selectedNodeId: null,
  zoom: 1,
  theme: "light",
  isPreviewMode: false,
  sidebarOpen: true,
};

const uiStateSlice = createSlice({
  name: "uiState",
  initialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(2, action.payload));
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    togglePreviewMode: (state) => {
      state.isPreviewMode = !state.isPreviewMode;
      // プレビューモード時は選択をクリア
      if (state.isPreviewMode) {
        state.selectedNodeId = null;
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    resetUIState: () => initialState,
  },
});

export const {
  setSelectedNode,
  setZoom,
  setTheme,
  togglePreviewMode,
  toggleSidebar,
  resetUIState,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;