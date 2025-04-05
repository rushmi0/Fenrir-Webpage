import loginImg from "../assets/login.png";

import {
    SET_ACCOUNT,
    CLEAR_ACCOUNT,
    AccountActionTypes,
} from '../actions/AccountAction';

interface AccountState {
    publicKey: string | null;
    name: string;
    image: string;
}

const initialState: AccountState = {
    publicKey: null,
    name: 'Anonymous',
    image: loginImg,
};

export const accountReducer = (
    state = initialState,
    action: AccountActionTypes
): AccountState => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                publicKey: action.payload.publicKey,
                name: action.payload.name,
                image: action.payload.image,
            };
        case CLEAR_ACCOUNT:
            return initialState;
        default:
            return state;
    }
};
