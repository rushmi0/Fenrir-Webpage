const initialState: string[] = [];

type Action =
    | { type: "SET_RELAY_POOL"; payload: string[] }
    | { type: "CLEAR_RELAY_POOL" };

const RelayPoolReducer = (state = initialState, action: Action): string[] => {
    switch (action.type) {
        case "SET_RELAY_POOL":
            return [...new Set(action.payload)]; // ลบ duplicates ด้วย Set
        case "CLEAR_RELAY_POOL":
            return [];
        default:
            return state;
    }
};

export default RelayPoolReducer;
