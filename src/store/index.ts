import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import stockDataSlice from './slices/stockDataSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    stockData: stockDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;