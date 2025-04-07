import { SET_SHOW_AUTH_CARD } from "../actions/AuthCardActions.ts";

const initialState = {
    isOpen: false
};

export const authCardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_SHOW_AUTH_CARD:
            return {
                ...state,
                isOpen: action.payload
            };
        default:
            return state;
    }
};
