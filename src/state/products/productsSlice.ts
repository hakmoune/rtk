import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IinitialState, TProduct } from "./types";

const initialState: IinitialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", // Used to generate unique action types (pending, fulfilled, rejected).
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        return rejectWithValue("Server Error: FAILED TO DELETE PRODUCT"); // Payload will be available in action.payload.
      }
      return (await response.json()).products; // Payload will be available in action.payload.
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteProductById",
  async (
    product: TProduct,
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/productsss/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        return rejectWithValue("Server Error: FAILED TO DELETE PRODUCT");
      }

      return await response.json();
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductById = createAsyncThunk(
  "products/updateProductById",
  async (
    { id, title }: { id: number; title: string }, // single payload argument
    { rejectWithValue }: { rejectWithValue: (value: any) => void } // ThunkAPI object (which includes rejectWithValue, dispatch, getState...)
  ) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        // This returns early with rejectWithValue, so the catch block is never executed
        // The error is directly passed to Redux via action.payload.
        // Redux dispatches the "rejected action" with "action.payload" containing "Server Error: FAILED TO UPDATE PRODUCT"
        return rejectWithValue("Server Error: FAILED TO UPDATE PRODUCT");
      }

      return await response.json();
    } catch (error: any) {
      // Catch used if you want to catch network errors (e.g., no internet) or unexpected errors (e.g., bad JSON parsing):
      console.error(error);
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products", // Used to generate action types.
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Delete product by id
    builder
      .addCase(deleteProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Update product by id
    builder
      .addCase(updateProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );

        if (index !== -1) {
          // Redux toolkit uses Immer.js to allow direct state mutation.
          // Redux  keeps the state immutable in the background.
          // Immer automatically creates a new state behind the scenes.
          // you don't have to manually create a new array to ensure immutability
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default productsSlice.reducer;
