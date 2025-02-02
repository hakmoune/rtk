import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import productsReducer from "./products/productsSlice";
import cartsReducer from "./carts/cartsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    products: productsReducer,
    carts: cartsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
