import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const shazamHost = import.meta.env.VITE_SHAZAM_CORE_HOST || 'shazam-core7.p.rapidapi.com';

if (!rapidApiKey) {
  // Warn once in dev if the RapidAPI key is missing.
  console.warn('Missing VITE_RAPIDAPI_KEY; Shazam Core requests will fail.');
}

export const shazamCoreApi = createApi({
  reducerPath: 'shazamCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${shazamHost}/`,
    prepareHeaders: (headers) => {
      if (rapidApiKey) {
        headers.set('x-rapidapi-key', rapidApiKey);
      }
      headers.set('x-rapidapi-host', shazamHost);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: (limit = 40) => ({
        url: 'charts/get-top-songs-in-world',
        params: { limit },
      }),
    }),
    getSongsByGenre: builder.query({
      query: (genre) => ({
        url: 'charts/get-top-songs-in_world_by_genre',
        params: { genre, limit: 40 },
      }),
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => ({
        url: 'charts/get-top-songs-in_country_by_genre',
        params: { country_code: countryCode, genre: 'POP', limit: 40 },
      }),
    }),
    // ✅ Correctly placed search endpoint
    getSongsBySearch: builder.query({
      query: (searchTerm) => ({
        url: 'search',
        params: { term: searchTerm, limit: 10 },
      }),
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `artist/get-details?artist_id=${artistId}`,
    }),
    getArtistTopSongs: builder.query({
      query: (artistId) => `artist/get-top-songs?artist_id=${artistId}`,
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByCountryQuery,
  useGetArtistDetailsQuery,
  useGetArtistTopSongsQuery,
  useGetSongsByGenreQuery,
  useGetSongsBySearchQuery, // ✅ Now valid
} = shazamCoreApi;
