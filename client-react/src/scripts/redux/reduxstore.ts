import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/userslice';
import cartReducer from './slices/cartslice';

const reduxStore = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
export default reduxStore;