
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type ShellProps = {
    isShowFooter?:boolean
    isShowHeader?:boolean
}

type LayoutState = {
    shell: ShellProps;
  };

const initialState: LayoutState = {
    shell: {isShowFooter:false, isShowHeader:false}
  };

  export const LayoutSlice = createSlice({
    // A name, used in action types:
    name: "layout",
    
    // The initial state:
    initialState,

    reducers: {
        setLayout(
            state: LayoutState, 
            action: PayloadAction<ShellProps>
        ) {
            state.shell= action.payload;
        }
  }
})
// Export all of the actions:
export const { setLayout } = LayoutSlice.actions;

// It is a convention to export reducer as a default export:
export default LayoutSlice.reducer;

export const selectLayout = (state: RootState) => state.layout.shell;