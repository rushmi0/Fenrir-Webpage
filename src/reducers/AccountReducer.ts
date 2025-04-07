import {
    SET_ACCOUNT,
    CLEAR_ACCOUNT,
    AccountActionTypes
} from '../actions/AccountAction';

interface AccountState {
    publicKey: string | null;
    name: string;
    image: string;
    displayName: string;
    about: string;
    banner: string;
    lud16: string;
    nsec?: string | null;
}

const initialState: AccountState = {
    publicKey: null,
    name: 'Anonymous',
    image: '',
    displayName: '',
    about: '',
    banner: '',
    lud16: '',
    nsec: null,
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
                displayName: action.payload.displayName,
                about: action.payload.about,
                banner: action.payload.banner,
                lud16: action.payload.lud16,
                nsec: action.payload.nsec ?? null,
            };
        case CLEAR_ACCOUNT:
            return initialState;
        default:
            return state;
    }
};
