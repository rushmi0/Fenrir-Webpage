import {
    SET_FIRST_EVENT,
    CLEAR_FIRST_EVENT,
    EventActionTypes,
} from "../actions/EventAction";
import { NDKRawEvent } from "@nostr-dev-kit/ndk";

interface EventState {
    firstEvent: NDKRawEvent | null;
}

const initialState: EventState = {
    firstEvent: null,
};

export const eventReducer = (
    state = initialState,
    action: EventActionTypes
): EventState => {
    switch (action.type) {
        case SET_FIRST_EVENT:
            return { firstEvent: action.payload };
        case CLEAR_FIRST_EVENT:
            return initialState;
        default:
            return state;
    }
};
