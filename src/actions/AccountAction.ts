export const SET_ACCOUNT = "SET_ACCOUNT";
export const CLEAR_ACCOUNT = "CLEAR_ACCOUNT";

export interface SetAccountAction {
    type: typeof SET_ACCOUNT;
    payload: {
        publicKey: string;
        name: string;
        image: string;
        displayName: string;
        about: string;
        banner: string;
        lud16: string;
    };
}

export interface ClearAccountAction {
    type: typeof CLEAR_ACCOUNT;
}

export type AccountActionTypes = SetAccountAction | ClearAccountAction;

// Action Creator สำหรับ SET_ACCOUNT
export const setAccount = (
    publicKey: string,
    name: string,
    image: string,
    displayName: string,
    about: string,
    banner: string,
    lud16: string
): SetAccountAction => ({
    type: SET_ACCOUNT,
    payload: { publicKey, name, image, displayName, about, banner, lud16 },
});

// Action Creator สำหรับ CLEAR_ACCOUNT
export const clearAccount = (): ClearAccountAction => ({
    type: CLEAR_ACCOUNT,
});
