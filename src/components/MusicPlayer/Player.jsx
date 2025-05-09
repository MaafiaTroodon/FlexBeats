/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react';
import { getPlayableUrl } from '../../utils/getPlayableUrl'; // ✅ Import utility

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

  const audioUrl = getPlayableUrl(activeSong); // ✅ Resolve preview audio URL
  console.log("🎵 Final audio URL:", audioUrl);

  useEffect(() => {
    if (ref.current) {
      if (isPlaying && audioUrl) {
        const playPromise = ref.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error('⚠️ Playback error:', e);
            console.warn('🧠 Problem URL:', audioUrl);
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
      src={audioUrl || ''}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;