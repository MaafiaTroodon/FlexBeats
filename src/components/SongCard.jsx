// SongCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    const audio = document.getElementById('custom-audio');
    if (audio) {
      audio.pause();
    }
    dispatch(playPause(false));
  };

  const handlePlayClick = async () => {
    const audio = document.getElementById('custom-audio') || (() => {
      const a = document.createElement('audio');
      a.id = 'custom-audio';
      document.body.appendChild(a);
      return a;
    })();

    const songUrl = song?.hub?.actions?.[0]?.uri;

    // If the song is the same and already playing, toggle pause
    if (activeSong?.key === song.key && isPlaying) {
      audio.pause();
      dispatch(playPause(false));
      return;
    }

    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));

    if (songUrl) {
      audio.src = songUrl;
      try {
        await audio.play();
      } catch (err) {
        console.error('Playback error:', err);
      }
    } else {
      console.warn('❌ No preview available for this track');
    }
  };

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.key === song.key ? 'flex' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img
          alt="song_img"
          src={song.images?.coverart}
          className="w-full h-full rounded-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${song?.key}`}>
            {song.title}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={song.artists ? `/artists/${song?.artists[0]?.adamid}` : '/top-artists'}>
            {song.subtitle}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
