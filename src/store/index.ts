import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";
import mishnaViewReducer from "./reducers/mishnaViewReducer";
import navigationReducer from "./reducers/navigationReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import mishnaEditReducer from "./reducers/mishnaEditReducer";
import generalReducer from "./reducers/generalReducer";

const rootReducer = combineReducers({
  general: generalReducer,
  navigation: navigationReducer,
  authentication: authReducer,
  mishnaView: mishnaViewReducer,
  mishnaEdit: mishnaEditReducer
});



const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch