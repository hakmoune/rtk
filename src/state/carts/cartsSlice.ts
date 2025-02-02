import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { ICart, IinitialState } from "./types";
import { RootState } from "../store";

// ICart → The shape of the entity (the type of each cart).
// number → The type of the id field in the entity (the type of cart.id).
// createEntityAdapter: returns an EntityAdapter object.that provides set of pre-built reducers and selectors to manage a normalized state.
// it expects an entity definition, which represents a single item (a cart in this case).
const cartsAdapter = createEntityAdapter<ICart, number>({
  selectId: (cart) => cart.id, // Specify `id` as the unique identifier
  sortComparer: (a, b) => b.id - a.id, // Sorting by cart ID (descending), (use localeCompare if the id is string. e.g: a.title.localeCompare(b.title))
});

// By default, Redux Toolkit assumes that your entity has an id field and that id is the unique identifier.
// The order will stay as it is in the state.
// When you call createEntityAdapter<ICart>() without specifying an ID type, TypeScript automatically infers the type of id from the ICart type definition.
// ###### When do you need selectId?
// 1. If your entity has an id field with a different name (e.g., cartId instead of id).
// 2. If your entity does not have an id property and you need to derive a unique identifier in another way.
//const cartsAdapter = createEntityAdapter<ICart>();

// Create initial state from the adapter
const initialState: IinitialState = cartsAdapter.getInitialState({
  status: "idle", // Status for tracking async operations
  error: null as string | null, // Store error messages if any
});

// The second type is "void" because we don't pass any argument when calling fetchCarts().
// The _ is a convention for an unused argument.
// rejectWithValue is NOT considered an argument, because it's part of thunkAPI, which Redux Toolkit automatically injects.
// Arguments are values explicitly passed when calling the function.
export const fetchCarts = createAsyncThunk<ICart[], void>(
  "carts/fetchCarts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://dummyjson.com/carts");

      if (!res.ok)
        return rejectWithValue("Server Error: Failed to fetch Carts");

      return (await res.json()).carts;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    // addCart: cartsAdapter.addOne, // ✅ Add a new cart
    // updateCart: cartsAdapter.updateOne, // ✅ Update a cart (by id)
    // removeCart: cartsAdapter.removeOne, // ✅ Remove a cart
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = "succeeded";
        cartsAdapter.setAll(state, action.payload); // ✅ Store all carts
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Selectors to get cart data
export const selectCartsStatus = (state: RootState) => state.carts.status;
export const selectCartsError = (state: RootState) => state.carts.error;
export const {
  selectAll: selectAllCarts, // Get all carts
} = cartsAdapter.getSelectors((state: RootState) => state.carts);

export default cartsSlice.reducer;
