import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IinitialState, TProduct } from "./types";

const initialState: IinitialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", // Used to generate unique action types (pending, fulfilled, rejected).
  async (_, thunkAPI) => {
    try {
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        throw new Error("Server Error: FAILED TO FETCH PRODUCTS"); // Payload will be available in action.payload.
      }
      return (await response.json()).products; // Payload will be available in action.payload.
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
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
        `https://dummyjson.com/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Server Error: FAILED TO DELETE PRODUCT");
      }

      return await response.json();
    } catch (error: any) {
      rejectWithValue(error.message);
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
  },
});

export default productsSlice.reducer;
