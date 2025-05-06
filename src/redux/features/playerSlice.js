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

      // 🔄 Normalize audio URL across different APIs
      let url = song?.url;
      if (!url && song?.hub?.actions?.[0]?.uri) {
        url = song.hub.actions[0].uri;
      } else if (!url && song?.attributes?.previews?.[0]?.url) {
        url = song.attributes.previews[0].url;
      }

      state.activeSong = { ...song, url };

      if (Array.isArray(data)) {
        state.currentSongs = data;
      } else if (data?.tracks?.hits) {
        state.currentSongs = data.tracks.hits;
      } else if (data?.tracks) {
        state.currentSongs = data.tracks;
      } else {
        state.currentSongs = [];
      }

      state.currentIndex = i;
      state.isActive = true;
    },

    nextSong: (state, action) => {
      const next = state.currentSongs[action.payload];

      let url = next?.url;
      if (!url && next?.hub?.actions?.[0]?.uri) {
        url = next.hub.actions[0].uri;
      } else if (!url && next?.attributes?.previews?.[0]?.url) {
        url = next.attributes.previews[0].url;
      }

      state.activeSong = { ...next, url };
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action) => {
      const prev = state.currentSongs[action.payload];

      let url = prev?.url;
      if (!url && prev?.hub?.actions?.[0]?.uri) {
        url = prev.hub.actions[0].uri;
      } else if (!url && prev?.attributes?.previews?.[0]?.url) {
        url = prev.attributes.previews[0].url;
      }

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
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
} = playerSlice.actions;

export default playerSlice.reducer;
