import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import menusReducer from "./slices/menusSlice";
import heroReducer from "./slices/heroSlice";
import aboutReducer from "./slices/aboutSlice";
import noticesReducer from "./slices/noticesSlice";
import programsReducer from "./slices/programsSlice";
import galleryReducer from "./slices/gallerySlice";
import teachersReducer from "./slices/teachersSlice";
import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  menus: menusReducer,
  hero: heroReducer,
  about: aboutReducer,
  notices: noticesReducer,
  programs: programsReducer,
  gallery: galleryReducer,
  teachers: teachersReducer,
  settings: settingsReducer,
});

const persistConfig = { key: "root", storage, whitelist: ["auth"] };
const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (g) => g(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
