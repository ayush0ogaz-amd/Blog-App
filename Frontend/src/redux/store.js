import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// 1. Fixed typo from persistConfq to persistConfig
const persistConfig = {
  key: "root",
  storage
};

// Pass the corrected config variable here
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  // Optional but recommended: Adds middleware to ignore serializable checks for redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 2. Fixed typo from peristor to persistor
export const persistor = persistStore(store);
