import { createStore, combineReducers } from 'redux';
import { accountReducer } from './reducers/AccountReducer';
import {eventReducer} from "./reducers/EventReducer.ts";

const rootReducer = combineReducers({
    account: accountReducer,
    event: eventReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;   // <-- default export
