import { createSlice } from '@reduxjs/toolkit';

export const sideBarMenuSlicer = createSlice({
    name:'tabName',
    initialState: { tabName: "" },
    reducers: {
        setTabName: (state, action) => {
          state.tabName = action.payload;
        },
      },
})
export const { setTabName,reducer } = sideBarMenuSlicer.actions;

export const selectTabName = state => state.tabName;

export default sideBarMenuSlicer.reducer;