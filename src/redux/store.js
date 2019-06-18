import { createActionsFromReducer } from "@bit/rivigo.ui.utils.redux-wow";
import { combineReducers, createStore } from "redux";
import { todoReducer } from "./reducers/todoReducer";
/**
 * Creating Root Reducer
 */
const rootReducer = combineReducers({
  todoReducer
});
/**
 * Generating Store from RootReducer
 */
const store = createStore(rootReducer);
const dispatch = store.dispatch;

/**
 * Generating Actions from Store
 */

const actions = {
  [todoReducer.namespace]: createActionsFromReducer(todoReducer, dispatch)
};
export { dispatch, store, actions };
