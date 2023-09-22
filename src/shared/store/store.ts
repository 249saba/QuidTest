import { configureStore } from "@reduxjs/toolkit";
// Import our reducer from the sluce:
import layoutReducer from "../slices/LayoutSlice";

// Use `configureStore` function to create the store:
export const store = configureStore({
  reducer: {
    // Specify our reducer in the reducers object:
    layout: layoutReducer,
  },
});

// Define the `RootState` as the return type:
export type RootState = ReturnType<typeof store.getState>;