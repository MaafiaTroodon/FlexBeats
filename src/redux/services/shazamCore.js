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
    getSongDetails: builder.query({
      query: (songid) => `songs/get_details?id=${songid}`, // ✅ FIXED: use id
    }),
    getSongRelated: builder.query({
      query: (songid) => `songs/list-recommendations?id=${songid}`,
    }),
  }),
});


export const {
  useGetTopChartsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} = shazamCoreApi;
