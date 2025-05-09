/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react';

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        const playPromise = ref.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error('⚠️ Playback error:', e);
            console.warn('🧠 Problem URL:', activeSong?.url);
          });
        }
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, activeSong]);

  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (ref.current) ref.current.currentTime = seekTime;
  }, [seekTime]);

  return (
    <audio
      ref={ref}
      src={activeSong?.url || ''}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;