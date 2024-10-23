import { createSlice } from '@reduxjs/toolkit';

const userReducer = createSlice({
    name: 'userReducer',
    initialState: {
        isLoading: false,
        error: false,
        data: {}
    },
    reducers: {
        addUser: (state, action) => {
            state.data = action.payload;
            state.isLoading = false;
            state.error = false;
        },
        removeUser:(state,action)=>{
            state.data=null;
            state.isLoading=false;
            state.error=null;
        }
    }
});


export const { addUser ,removeUser} = userReducer.actions;


export default userReducer.reducer;
