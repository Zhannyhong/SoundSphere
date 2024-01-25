import { authApi } from "./apis/authApi";
import { threadApi } from "./apis/threadApi";
import { commentApi } from "./apis/commentApi";
import { tagApi } from "./apis/tagApi";
import { voteApi } from "./apis/voteApi";
import authReducer from "./features/authSlice";
import threadReducer from "./features/threadSlice";
import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { TypedUseSelectorHook } from "react-redux";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [threadApi.reducerPath]: threadApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
        [voteApi.reducerPath]: voteApi.reducer,
        authState: persistedReducer,
        threadState: threadReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
            authApi.middleware,
            threadApi.middleware,
            commentApi.middleware,
            tagApi.middleware,
            voteApi.middleware,
        ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
