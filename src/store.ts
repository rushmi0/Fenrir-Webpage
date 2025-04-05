import { createStore, combineReducers } from 'redux';
import { accountReducer } from './reducers/AccountReducer';
import {eventReducer} from "./reducers/EventReducer.ts";
import RelayPoolReducer from "./reducers/RelayPoolReducer.ts";

const rootReducer = combineReducers({
    relayPool: RelayPoolReducer,
    account: accountReducer,
    event: eventReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);

export default store;
