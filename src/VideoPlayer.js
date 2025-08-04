import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({
  url,
  isActive,
  volume,
  playing,
  onReady,
  onBuffer,
  seekTime,
  isAudioSource
}) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (playerRef.current && seekTime !== null && isReady) {
      const current = playerRef.current.getCurrentTime?.() || 0;
      const diff = Math.abs(current - seekTime);
      if (diff > 0.3) {
        playerRef.current.seekTo(seekTime, 'seconds');
      }
    }
  }, [seekTime, isReady]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: isActive ? 'auto' : 'none',
      zIndex: isActive ? 1 : 0
    }}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={isAudioSource ? volume : 0}
        loop
        controls={false}
        width="100%"
        height="100%"
        onReady={() => {
          setIsReady(true);
          onReady();
        }}
        onBuffer={() => onBuffer(true)}
        onBufferEnd={() => onBuffer(false)}
        onError={(e) => console.error("Error en reproductor:", e)}
        config={{
          file: {
            attributes: {
              preload: 'auto'
            },
            forceVideo: true
          }
        }}
      />
    </div>
  );
};

export default VideoPlayer;
