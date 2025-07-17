import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "./slices/projectsSlice";
import currentProjectSlice from "./slices/currentProjectSlice";
import uiStateSlice from "./slices/uiStateSlice";

export const store = configureStore({
  reducer: {
    projects: projectsSlice,
    currentProject: currentProjectSlice,
    uiState: uiStateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;