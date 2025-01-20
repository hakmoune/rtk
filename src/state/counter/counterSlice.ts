import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const CounterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, actions: PayloadAction<number>) => {
      //state.value += 1;
      state.value += actions.payload;
    },
    decrement: (state, actions: PayloadAction<number>) => {
      //state.value -= 1;
      state.value -= actions.payload;
    },
  },
});

export const { increment, decrement } = CounterSlice.actions;
export default CounterSlice.reducer;

//25
