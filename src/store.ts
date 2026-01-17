import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./reducers/uiReducer.ts";
import dateReducer from "./reducers/dateReducer.ts";
import userReducer from "./reducers/userReducer.ts";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        date: dateReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
