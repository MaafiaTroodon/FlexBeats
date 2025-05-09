import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { useGetSongsBySearchQuery, useGetTrackLyricsQuery, useGetTrackRecommendationsQuery } from '../redux/services/spotify';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';
import axios from 'axios'; // NEW

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid, id: artistId } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [backupLyrics, setBackupLyrics] = useState(null); // BACKUP Lyrics

  const { data: topChartsData, isFetching: isFetchingTopCharts } = useGetTopChartsQuery();
  const clickedSong = topChartsData?.data?.find(song => String(song.id) === String(songid));

  const searchTerm = clickedSong ? `${clickedSong.attributes.name.replace(/[()]/g, '')} ${clickedSong.attributes.artistName}` : '';

  const { data: spotifySearchData, isFetching: isFetchingSpotifySearch } = useGetSongsBySearchQuery(searchTerm, { skip: !clickedSong });
  const spotifyTrackId = spotifySearchData?.tracks?.items?.[0]?.id;

  const { data: spotifyLyricsData, isFetching: isFetchingLyrics } = useGetTrackLyricsQuery(spotifyTrackId, { skip: !spotifyTrackId });
  const { data: recommendationsData, isFetching: isFetchingRecommendations } = useGetTrackRecommendationsQuery(
    { trackId: spotifyTrackId, artistId: spotifySearchData?.tracks?.items?.[0]?.artists?.[0]?.id },
    { skip: !spotifyTrackId }
  );

  // 📌 BACKUP LYRICS FETCHING
  useEffect(() => {
    const fetchBackupLyrics = async () => {
      if (!spotifyLyricsData?.lyrics?.lines?.length && clickedSong) {
        try {
          const artist = clickedSong.attributes.artistName;
          const title = clickedSong.attributes.name;
          const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
          setBackupLyrics(response.data.lyrics);
        } catch (error) {
          console.log('No backup lyrics found.');
          setBackupLyrics(null);
        }
      }
    };
    fetchBackupLyrics();
  }, [spotifyLyricsData, clickedSong]);

  if (isFetchingTopCharts || isFetchingSpotifySearch || isFetchingLyrics || isFetchingRecommendations)
    return <Loader title="Loading song details..." />;

  const relatedSongs = recommendationsData?.tracks?.length > 0
    ? recommendationsData.tracks.map(track => ({
        title: track.name,
        subtitle: track.artists[0]?.name,
        images: { coverart: track.album.images[0]?.url },
        hub: { actions: [{ uri: track.external_urls.spotify }] },
        key: track.id,
      }))
    : topChartsData?.data?.slice(0, 10).map(song => ({
        title: song.attributes.name,
        subtitle: song.attributes.artistName,
        images: { coverart: song.attributes.artwork.url.replace('{w}', '500').replace('{h}', '500') },
        hub: song.attributes.previews?.[0] ? { actions: [{ uri: song.attributes.previews[0].url }] } : { actions: [{ uri: '' }] },
        key: song.id,
      }));

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    const matchedSong = topChartsData?.data?.find(topSong =>
      topSong.attributes.name.toLowerCase() === song.title.toLowerCase()
    );

    if (matchedSong) {
      dispatch(setActiveSong({ song: matchedSong, data: topChartsData?.data, i }));
    } else {
      dispatch(setActiveSong({ song, data: relatedSongs, i }));
    }
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
          ) : spotifyLyricsData?.lyrics?.previewLines?.length > 0 ? (
            spotifyLyricsData.lyrics.previewLines.map((line, i) => (
              <p key={i} className="text-gray-400 text-base my-1">{line.words}</p>
            ))
          ) : backupLyrics ? (
            backupLyrics.split('\n').map((line, i) => (
              <p key={i} className="text-gray-400 text-base my-1">{line}</p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">Sorry, No lyrics found!</p>
          )}
        </div>
      </div>

      <RelatedSongs
        data={relatedSongs || []}
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
