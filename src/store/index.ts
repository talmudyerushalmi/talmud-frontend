import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import mishnaViewReducer from './reducers/mishnaViewReducer';
import navigationReducer from './reducers/navigationReducer';
import mishnaEditReducer from './reducers/mishnaEditReducer';
import generalReducer from './reducers/generalReducer';
import commentsReducer from './reducers/commentsReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import relatedReducer from './reducers/relatedReducer';



const rootReducer = combineReducers({
  general: generalReducer,
  navigation: navigationReducer,
  authentication: authReducer,
  mishnaView: mishnaViewReducer,
  mishnaEdit: mishnaEditReducer,
  comments: commentsReducer,
  related: relatedReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['mishnaView'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
export default store;
