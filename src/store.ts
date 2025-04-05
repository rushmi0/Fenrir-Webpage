// src/store.ts
import { createStore, combineReducers } from 'redux';
import { accountReducer } from './reducers/AccountReducer';

const rootReducer = combineReducers({
    account: accountReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;   // <-- default export
