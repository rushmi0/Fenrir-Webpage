import { createStore, combineReducers } from 'redux';
import { accountReducer } from './reducers/AccountReducer';
import {eventReducer} from "./reducers/EventReducer.ts";
import RelayPoolReducer from "./reducers/RelayPoolReducer.ts";
import {authCardReducer} from "./reducers/AuthCardReducer.ts";

const rootReducer = combineReducers({
    relayPool: RelayPoolReducer,
    authCard: authCardReducer,
    account: accountReducer,
    event: eventReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const store = createStore(rootReducer);

export default store;
