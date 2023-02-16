import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer';
import mishnaViewReducer from './reducers/mishnaViewReducer';
import navigationReducer from './reducers/navigationReducer';
import { devToolsEnhancer } from 'redux-devtools-extension';
import mishnaEditReducer from './reducers/mishnaEditReducer';
import generalReducer from './reducers/generalReducer';

const rootReducer = combineReducers({
  general: generalReducer,
  navigation: navigationReducer,
  authentication: authReducer,
  mishnaView: mishnaViewReducer,
  mishnaEdit: mishnaEditReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  enhancers: [devToolsEnhancer({})],
})

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
