// src/redux/services/spotify.js

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
    searchSong: builder.query({
      query: (searchTerm) => ({
        url: 'search/',
        params: { q: searchTerm, type: 'track' },
      }),
    }),
    getTrackLyrics: builder.query({
      query: (spotify_track_id) => ({
        url: 'track_lyrics/',
        params: { id: spotify_track_id },
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
        params: { q: artistName, type: 'artist' },
      }),
    }),
    getArtistDetails: builder.query({
      query: (spotifyArtistId) => ({
        url: 'artists/',
        params: { ids: spotifyArtistId },
      }),
    }),
  }),
});

export const {
  useSearchSongQuery,
  useGetTrackLyricsQuery,
  useGetTrackRecommendationsQuery,
  useSearchArtistQuery,
  useGetArtistDetailsQuery,
} = spotifyApi;
