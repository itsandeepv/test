import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
    name:'login',
    initialState: { 
      items: [], 
      loginStatus: false, 
      role:[],
      loading: false
     },
    reducers: {
        setData: (state, action) => {
            console.log(state,action)
          // Set the data array in the state using the payload
          state.items = action.payload;
        },
        setLoginStatus:(status, action) =>{
            console.log("action>>",action)
            status.loginStatus = action.payload
        },
        setRole:(status, action) => {
          status.role = action.payload
        },
        setLoading:(status,action)=>{
          status.loading = action.payload
        }
      },
})
export const { setData,reducer ,setLoginStatus, setRole,setLoading} = loginSlice.actions;

export const selectData = state => state.login;

export default loginSlice.reducer;