import { configureStore } from '@reduxjs/toolkit';
import { shazamCoreApi } from './services/shazamCore';
import { spotifyApi } from './services/spotify';
import playerReducer from './features/playerSlice';

// Setup Redux store
export const store = configureStore({
  reducer: {
    [shazamCoreApi.reducerPath]: shazamCoreApi.reducer, // for Top Charts page
    [spotifyApi.reducerPath]: spotifyApi.reducer,       // for SongDetails and Spotify data
    player: playerReducer,                              // for Play/Pause actions
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      shazamCoreApi.middleware,
      spotifyApi.middleware,
    ),
});
