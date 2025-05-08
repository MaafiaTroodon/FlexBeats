// src/redux/services/shazamCore.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shazamCoreApi = createApi({
  reducerPath: 'shazamCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://shazam-core7.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('x-rapidapi-key', '1aea0e1a6cmsh467bb5203be1de1p19752fjsn9fb10026f598');
      headers.set('x-rapidapi-host', 'shazam-core7.p.rapidapi.com');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => 'charts/get-top-songs-in-world',
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => ({
        url: 'charts/get-top-songs-in_country_by_genre',
        params: {
          country_code: countryCode,
          genre: 'POP',
          limit: 40,
        },
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
} = shazamCoreApi;
