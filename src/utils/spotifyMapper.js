export const mapSpotifyTrackToSong = (item, index = 0) => {
  const track = item?.data || item || {};
  const artist = track?.artists?.items?.[0];
  const artistName = artist?.profile?.name || 'Unknown Artist';
  const cover =
    track?.albumOfTrack?.coverArt?.sources?.[0]?.url ||
    track?.albumOfTrack?.coverArt?.sources?.[1]?.url ||
    '';

  return {
    key: track?.id || `${track?.name || 'track'}-${index}`,
    title: track?.name || 'Unknown Title',
    subtitle: artistName,
    images: { coverart: cover },
    hub: { actions: [] },
    url: null,
    artists: artist?.uri
      ? [{ adamid: artist.uri.split(':').pop() }]
      : [],
  };
};
