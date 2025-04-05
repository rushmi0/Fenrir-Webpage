import {NDKRawEvent} from "@nostr-dev-kit/ndk";

export const SET_FIRST_EVENT = "SET_FIRST_EVENT";
export const CLEAR_FIRST_EVENT = "CLEAR_FIRST_EVENT";

interface SetFirstEventAction {
    type: typeof SET_FIRST_EVENT;
    payload: NDKRawEvent;
}

interface ClearFirstEventAction {
    type: typeof CLEAR_FIRST_EVENT;
}

export type EventActionTypes = SetFirstEventAction | ClearFirstEventAction;

export const setFirstEvent = (evt: NDKRawEvent): SetFirstEventAction => ({
    type: SET_FIRST_EVENT,
    payload: evt,
});

export const clearFirstEvent = (): ClearFirstEventAction => ({
    type: CLEAR_FIRST_EVENT,
});
