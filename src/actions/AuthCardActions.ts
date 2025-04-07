export const SET_SHOW_AUTH_CARD = "SET_SHOW_AUTH_CARD";

export const setShowAuthCard = (isOpen: boolean) => ({
    type: SET_SHOW_AUTH_CARD,
    payload: isOpen
});
