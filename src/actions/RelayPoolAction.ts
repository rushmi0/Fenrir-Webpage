export const setRelayPool = (relays: string[]) => ({
    type: "SET_RELAY_POOL",
    payload: relays,
});

export const clearRelayPool = () => ({
    type: "CLEAR_RELAY_POOL",
});
