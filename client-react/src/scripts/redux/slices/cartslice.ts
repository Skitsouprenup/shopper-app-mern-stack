import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    totalQuantity: 0,
    count: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        incrementCount: (state) => {
            state.count = state.count + 1;
        },
        decrementCount: (state) => {
            state.count = state.count - 1;
            if(state.count < 0)
                state.count = 0;
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
        setTotalQuantity: (state, action: PayloadAction<number>) => {
            state.totalQuantity = action.payload;
        },
    }
});

export const { 
    incrementCount, 
    decrementCount, 
    setCount, 
    setTotalQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;