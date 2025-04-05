
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const CLEAR_ACCOUNT = 'CLEAR_ACCOUNT';

interface SetAccountAction {
    type: typeof SET_ACCOUNT;
    payload: {
        publicKey: string;
        name: string;
        image: string;
    };
}

interface ClearAccountAction {
    type: typeof CLEAR_ACCOUNT;
}

export type AccountActionTypes = SetAccountAction | ClearAccountAction;

export const setAccount = (publicKey: string, name: string, image: string): SetAccountAction => ({
    type: SET_ACCOUNT,
    payload: { publicKey, name, image },
});

export const clearAccount = (): ClearAccountAction => ({
    type: CLEAR_ACCOUNT,
});
