import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: {},
  genreListId: '',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      const { song, data, i } = action.payload;

      // ✅ Extract a valid URL for the audio preview
      let url = song?.url;

      if (!url) {
        url =
          song?.hub?.actions?.find((a) => a.uri)?.uri || // primary
          song?.hub?.options?.[0]?.actions?.[0]?.uri ||  // fallback option
          song?.attributes?.previews?.[0]?.url ||        // Spotify-style previews
          null;
      }

      state.activeSong = { ...song, url };

      if (Array.isArray(data)) {
        state.currentSongs = data;
      } else if (data?.tracks?.hits) {
        // Normalize structure: hits can be { track } or plain songs
        state.currentSongs = data.tracks.hits.map((h) => h.track || h);
      } else if (data?.tracks) {
        state.currentSongs = data.tracks;
      } else {
        state.currentSongs = [];
      }

      state.currentIndex = i;
      state.isActive = true;
    },
    setActiveSongUrl: (state, action) => {
      const { url, key, spotifyId } = action.payload || {};
      if (!url) return;

      state.activeSong = { ...state.activeSong, url };

      if (Array.isArray(state.currentSongs)) {
        state.currentSongs = state.currentSongs.map((song) => {
          const matchesKey = key && song?.key === key;
          const matchesSpotify = spotifyId && song?.spotifyId === spotifyId;
          if (matchesKey || matchesSpotify) {
            return { ...song, url };
          }
          return song;
        });
      }
    },

    nextSong: (state, action) => {
      const next = state.currentSongs[action.payload];

      let url =
        next?.url ||
        next?.hub?.actions?.find((a) => a.uri)?.uri ||
        next?.hub?.options?.[0]?.actions?.[0]?.uri ||
        next?.attributes?.previews?.[0]?.url ||
        null;

      state.activeSong = { ...next, url };
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {
      const prev = state.currentSongs[action.payload];

      let url =
        prev?.url ||
        prev?.hub?.actions?.find((a) => a.uri)?.uri ||
        prev?.hub?.options?.[0]?.actions?.[0]?.uri ||
        prev?.attributes?.previews?.[0]?.url ||
        null;

      state.activeSong = { ...prev, url };
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreListId = action.payload;
    },
  },
});

export const {
  setActiveSong,
  setActiveSongUrl,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
} = playerSlice.actions;

export default playerSlice.reducer;
