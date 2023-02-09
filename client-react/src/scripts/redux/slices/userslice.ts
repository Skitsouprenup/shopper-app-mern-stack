import { createSlice } from '@reduxjs/toolkit';
import { UserSliceInit } from '../../types/usertypes';

export const initialState : UserSliceInit = {
    fetchingUser: false,
    status: "INITIAL",
    isLoggedIn: false,
    errorState: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startFetchState: (state) => {
            state.fetchingUser = true;
        },
        loginUserState: (state) => {
            state.fetchingUser = false;
            state.isLoggedIn = true;
        },
        logoutUserState: (state) => {
            state.fetchingUser = false;
            state.isLoggedIn = false;
        },
        errorUserState: (state) => {
            state.fetchingUser = false;
            state.errorState = true;
        },
        resetErrorState: (state) => {
            state.errorState = false;
            state.fetchingUser = false;
        },
        setSuccessStatus: (state) => {
            state.status = "SUCCESS";
        },
        setFailedStatus: (state) => {
            state.status = "FAILED";
        },
        resetStatus: (state) => {
            state.status = "INITIAL";
        },
        resetFetchState: (state) => {
            state.fetchingUser = false;
        },
    }
});

export const {startFetchState, 
              loginUserState,
              logoutUserState,
              errorUserState, 
              resetErrorState,
              resetFetchState,
              setSuccessStatus,
              setFailedStatus,
              resetStatus } = userSlice.actions;
export default userSlice.reducer;