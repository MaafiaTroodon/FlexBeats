import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useSearchSongQuery, useGetTrackLyricsQuery, useGetTrackRecommendationsQuery } from '../redux/services/spotify';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data: topChartsData, isFetching: isFetchingTopCharts } = useGetTopChartsQuery();

  const clickedSong = topChartsData?.data?.find(song => String(song.id) === String(songid));

  const searchTerm = clickedSong ? `${clickedSong.attributes.name.replace(/[()]/g, '')} ${clickedSong.attributes.artistName}` : '';

  const { data: spotifySearchData, isFetching: isFetchingSpotifySearch } = useSearchSongQuery(searchTerm, { skip: !clickedSong });
  const spotifyTrackId = spotifySearchData?.tracks?.items?.[0]?.id;

  const { data: spotifyLyricsData, isFetching: isFetchingLyrics } = useGetTrackLyricsQuery(spotifyTrackId, { skip: !spotifyTrackId });
  const { data: recommendationsData, isFetching: isFetchingRecommendations } = useGetTrackRecommendationsQuery(
    { trackId: spotifyTrackId, artistId: spotifySearchData?.tracks?.items?.[0]?.artists?.[0]?.id },
    { skip: !spotifyTrackId }
  );

  if (isFetchingTopCharts || isFetchingSpotifySearch || isFetchingLyrics || isFetchingRecommendations)
    return <Loader title="Loading song details..." />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: recommendationsData?.tracks, i }));
    dispatch(playPause(true));
  };

  const spotifyTrack = spotifySearchData?.tracks?.items?.[0];

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={artistId}
        songData={{
          title: spotifyTrack?.name || clickedSong?.attributes?.name || 'Unknown Title',
          subtitle: spotifyTrack?.artists?.[0]?.name || clickedSong?.attributes?.artistName || 'Unknown Artist',
          images: {
            coverart: spotifyTrack?.album?.images?.[0]?.url || clickedSong?.attributes?.artwork?.url?.replace('{w}', '500')?.replace('{h}', '500'),
          },
          genres: {
            primary: spotifyTrack?.album?.name || clickedSong?.attributes?.genreNames?.[0],
          },
        }}
      />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          {spotifyLyricsData?.lyrics?.lines?.length > 0 ? (
            spotifyLyricsData.lyrics.lines.map((line, i) => (
              <p key={i} className="text-gray-400 text-base my-1">{line.words}</p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">Sorry, No lyrics found!</p>
          )}
        </div>
      </div>

      <RelatedSongs
        data={recommendationsData?.tracks || []}
        artistId={artistId}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
