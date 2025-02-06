import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
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
  sortComparer: (a, b) => a.id - b.id, // Sorting by cart ID (descending), (use localeCompare if the id is string. e.g: a.title.localeCompare(b.title))
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

export const createCart = createAsyncThunk<
  ICart,
  { userId: number; products: { id: number; quantity: number }[] }
>("carts/addCart", async ({ userId, products }, { rejectWithValue }) => {
  try {
    const res = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        products,
      }),
    });

    if (!res.ok) return rejectWithValue("Server Error: Failed to add cart");

    return await res.json();
  } catch (error: any) {
    console.log(error);
    return rejectWithValue(error.message);
  }
});

export const deleteCart = createAsyncThunk<ICart, number>(
  "carts/deleteCart",
  async (cartId, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dummyjson.com/carts/${cartId}`, {
        method: "DELETE",
      });

      if (!res.ok)
        return rejectWithValue("Server Error: Failed to delete the Cart");

      return await res.json();
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCart = createAsyncThunk<
  ICart,
  {
    cartId: number;
    merge: boolean;
    products: { id: number; quantity: number }[];
  }
>(
  "carts/updateCart",
  async ({ cartId, merge, products }, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dummyjson.com/carts/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merge,
          products,
        }),
      });

      if (!res.ok)
        return rejectWithValue("Server Error: Failed to update cart");

      return await res.json();
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
    // These reducers (addCart, updateCart, and removeCart) are not making API calls; they are only modifying the Redux store.
    // When would we use them ?
    // 1. If we were not handling API requests and just managing local state in Redux (like a simple app with local data).
    // 2. When optimistically updating the UI (e.g., show the cart instantly, then send an API request).
    // 3. When adding a cart temporarily in the frontend.
    // addCart: cartsAdapter.addOne, // ✅ Add a new cart (local reducers doesn't trigger API)
    // updateCart: cartsAdapter.updateOne, // ✅ Update a cart (by id) (local reducers doesn't trigger API)
    // removeCart: cartsAdapter.removeOne, // ✅ Remove a cart (local reducers doesn't trigger API)
  },
  extraReducers: (builder) => {
    //FETCH CART
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
    //CREATE CART
    builder
      .addCase(createCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        cartsAdapter.addOne(state, action.payload); // ✅ Add cart to the store
      })
      .addCase(createCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    //DELETE CART
    builder
      .addCase(deleteCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        cartsAdapter.removeOne(state, action.payload.id);
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    //UPDATE CART
    builder
      .addCase(updateCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        cartsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export actions to handle local state
// export const { addCart, updateCart, removeCart} = cartsSlice.actions;

// Export Selectors
export const selectCartsStatus = (state: RootState) => state.carts.status;
export const selectCartsError = (state: RootState) => state.carts.error;
export const {
  selectAll: selectAllCarts, // Get all carts
  selectById: selectCartById, // Get a specific cart by ID
  selectIds: selectCartIds, // Get all cart IDs
} = cartsAdapter.getSelectors((state: RootState) => state.carts);

export const selectCarts = createSelector(
  // Fonction(s) qui extraient les données nécessaires de l'état Redux.
  [selectAllCarts, selectCartsStatus, selectCartsError, selectCartIds], // Input selectors
  // Prend les résultats des sélecteurs d'entrée / input selectors et renvoie la valeur finale calculée
  (cartsList, status, error, ids) => ({
    cartsList,
    status,
    error,
    ids,
  }) // Output function
);

export const selectOneCartById = createSelector(
  // Fonction(s) qui extraient les données nécessaires de l'état Redux.
  [selectCartById, selectCartsStatus, selectCartsError], // Input selectors
  // Prend les résultats des sélecteurs d'entrée / input selectors et renvoie la valeur finale calculée
  (cart, statusCart, errorCart) => ({
    cart,
    statusCart,
    errorCart,
  }) // Output function
);

export default cartsSlice.reducer;
