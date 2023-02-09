export type QuantityActionType = 
    {type: 'increment'} |
    {type: 'decrement'} |
    {type: 'setValue', payload: number};

export interface CountState {
    count: number;
}

export const initialQuantity = {count: 0};

export const quantityReducer = (state: CountState, action : QuantityActionType) => {
    switch(action.type) {
        case 'increment':
            return {count: state.count + 1}

        case 'decrement':
            return {count: state.count - 1}

        case 'setValue':
            return {count: action.payload}
        
        default:
            throw new Error('Invalid Action in quantityReducer method!');
    }
};