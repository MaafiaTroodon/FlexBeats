import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://spotify23.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('x-rapidapi-key', '1aea0e1a6cmsh467bb5203be1de1p19752fjsn9fb10026f598');
      headers.set('x-rapidapi-host', 'spotify23.p.rapidapi.com');
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
  useGetTrackLyricsQuery,
  useGetTrackRecommendationsQuery,
  useSearchArtistQuery,
  useGetArtistDetailsQuery,
  useGetArtistAlbumsQuery,
  useGetArtistTopTracksQuery,
} = spotifyApi;
