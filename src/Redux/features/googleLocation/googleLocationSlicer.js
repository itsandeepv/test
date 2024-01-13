import { createSlice } from '@reduxjs/toolkit';

export const googleLocationSlicer = createSlice({
    name: 'location',
    initialState: { startLocation: [], endLocation: []},
    reducers: {
        setStartLocationName: (state, action) => {
            state.startLocation = action.payload;
        },
        setEndLocationName: (state, action) => {
            state.endLocation = action.payload;
        },
    },
})
export const { setStartLocationName, setEndLocationName, reducer } = googleLocationSlicer.actions;

export const startLocationReduxData = state => state.location;
export const endLocationReduxData = state => state.location;

export default googleLocationSlicer.reducer;