import { Action, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
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
import contentfulReducer from './reducers/contentfulReducer';
import { searchReducer } from './reducers/searchReducer';
import synopsisReducer from './reducers/synopsisReducer';

const rootReducer = combineReducers({
  general: generalReducer,
  navigation: navigationReducer,
  authentication: authReducer,
  mishnaView: mishnaViewReducer,
  mishnaEdit: mishnaEditReducer,
  comments: commentsReducer,
  related: relatedReducer,
  contentful: contentfulReducer,
  search: searchReducer,
  synopsis: synopsisReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['mishnaView'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        // Increase threshold to 100ms to avoid warnings with large state
        warnAfter: 100,
        // Or disable completely: false
      },
    }),
});

// Infer `RootState` directly from `rootReducer` (bypasses the `persistReducer`
// cast on line 37 so state slice types stay intact).
export type RootState = ReturnType<typeof rootReducer>;

/**
 * `AppDispatch` is declared explicitly (rather than `typeof store.dispatch`)
 * because the `as any` cast we're forced to make at the redux-persist boundary
 * poisons `configureStore`'s dispatch inference — the derived type collapses
 * to a plain `Dispatch<Action>` and loses the thunk overload. `ThunkDispatch`
 * already extends `Dispatch`, so this single type accepts both regular actions
 * and thunks (which is what every consumer of `useAppDispatch()` needs).
 */
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, Action<string>>;

setupListeners(store.dispatch);
export default store;
