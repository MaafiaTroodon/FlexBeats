import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const spotifyHost = import.meta.env.VITE_SPOTIFY_HOST || 'spotify23.p.rapidapi.com';

if (!rapidApiKey) {
  // Warn once in dev if the RapidAPI key is missing.
  console.warn('Missing VITE_RAPIDAPI_KEY; Spotify requests will fail.');
}

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${spotifyHost}/`,
    prepareHeaders: (headers) => {
      if (rapidApiKey) {
        headers.set('x-rapidapi-key', rapidApiKey);
      }
      headers.set('x-rapidapi-host', spotifyHost);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSongsBySearch: builder.query({
      query: (searchTerm) => ({
        url: 'search/',
        params: {
          q: searchTerm,
          type: 'multi', // 🟢 Correct: allows fuzzy matching and broad search
          limit: 10,
          numberOfTopResults: 5,
        },
      }),
    }),

    getTracksBySearch: builder.query({
      query: ({ query, limit = 40 }) => ({
        url: 'search/',
        params: {
          q: query,
          type: 'tracks',
          limit,
        },
      }),
    }),

    getTrackLyrics: builder.query({
      query: (id) => ({
        url: 'track_lyrics/',
        params: { id },
      }),
    }),

    getTrackRecommendations: builder.query({
      query: ({ trackId, artistId }) => ({
        url: 'recommendations/',
        params: {
          seed_tracks: trackId,
          seed_artists: artistId,
          limit: 20,
        },
      }),
    }),

    searchArtist: builder.query({
      query: (artistName) => ({
        url: 'search/',
        params: { q: artistName, type: 'artist', limit: 1 },
      }),
    }),

    getArtistDetails: builder.query({
      query: (id) => `artists/${id}`,
    }),

    getArtistAlbums: builder.query({
      query: (id) => ({
        url: 'artist_albums/',
        params: { id, offset: 0, limit: 20 },
      }),
    }),

    getArtistTopTracks: builder.query({
      query: (id) => ({
        url: 'artist_top_tracks/',
        params: { id, market: 'US' },
      }),
    }),
  }),
});

export const {
  useGetSongsBySearchQuery,
  useGetTracksBySearchQuery,
  useGetTrackLyricsQuery,
  useGetTrackRecommendationsQuery,
  useSearchArtistQuery,
  useGetArtistDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetArtistTopTracksQuery,
} = spotifyApi;
