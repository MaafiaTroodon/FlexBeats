import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSongsBySearchQuery } from '../redux/services/shazamCore';
import { useGetTracksBySearchQuery } from '../redux/services/spotify';
import { Loader, Error, SongCard } from '../components';
import { getPlayableUrl } from '../utils/getPlayableUrl';
import { mapSpotifyTrackToSong } from '../utils/spotifyMapper';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);
  const shazamError = error || data?.error;

  const { data: spotifyData, isFetching: isFetchingSpotify, error: spotifyError } = useGetTracksBySearchQuery(
    { query: searchTerm, limit: 20 },
    { skip: !shazamError && !data }
  );

  const rawHits = data?.data?.tracks?.hits || [];

  const songs = rawHits
    .map((hit, i) => {
      const track = hit.track || hit;

      const url = getPlayableUrl(track);

      return {
        key: track.key || `${track.heading?.title}-${i}`,
        title: track.heading?.title || track.title,
        subtitle: track.heading?.subtitle || track.subtitle,
        images: {
          coverart: track.images?.default || track.images?.coverart,
        },
        artists: track.artists || [],
        url,
      };
    })
    .filter((song) => song.url?.includes('http') && song.images?.coverart);

  const spotifySongs = (spotifyData?.tracks?.items || []).map(mapSpotifyTrackToSong);
  const displaySongs = songs.length ? songs : spotifySongs;

  if (isFetching || (shazamError && isFetchingSpotify) || (!songs.length && isFetchingSpotify)) {
    return <Loader title={`Searching "${searchTerm}"...`} />;
  }

  if ((shazamError && spotifyError) || !displaySongs.length) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Showing results for <span className="font-black">{searchTerm}</span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {displaySongs.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={displaySongs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
