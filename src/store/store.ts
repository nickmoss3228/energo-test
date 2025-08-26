import { configureStore } from '@reduxjs/toolkit';
import webrtcReducer from './webrtcSlice';

export const store = configureStore({
  reducer: {
    webrtc: webrtcReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'webrtc/setStream',
          'webrtc/initializeWebRTC/fulfilled',
        ],
        ignoredPaths: ['webrtc.stream'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;