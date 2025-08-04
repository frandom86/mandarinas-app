import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import './index.css';
import './App.css';
import VideoControls from './components/VideoControls';

function App() {
  const [activeVideo, setActiveVideo] = useState(1);
  const [targetVideo, setTargetVideo] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [video1Ready, setVideo1Ready] = useState(false);
  const [video2Ready, setVideo2Ready] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && audioRef.current) {
        setAudioTime(audioRef.current.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (targetVideo !== null && !transitioning) {
      setTransitioning(true);
      setTimeout(() => {
        setActiveVideo(targetVideo);
        setTargetVideo(null);
        setTransitioning(false);
      }, 300);
    }
  }, [targetVideo, transitioning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPlaying(false);
      } else {
        setPlaying(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Detectar cambios en fullscreen para sincronizar estado
  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement ||
        null;

      setIsFullscreen(!!fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('msfullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('msfullscreenchange', onFullscreenChange);
    };
  }, []);

  const handleSwitchVideo = () => {
    if (buffering || transitioning) return;
    setTargetVideo(activeVideo === 1 ? 2 : 1);
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const toggleFullscreen = () => {
    const el = document.querySelector('.pantalla-tv');

    if (!el) return;

    // Si no está en fullscreen, pedir fullscreen
    if (!isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      // Si ya está en fullscreen, salir
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col py-8">
      <h1 className="titulo-mandarinas">¡MANDARINAS!</h1>

      <div className="reproductor-container relative">
        <div className="pantalla-tv relative">
          {(!video1Ready || !video2Ready) && (
            <div className="absolute inset-0 flex items-center justify-center text-white z-10">
              Cargando videos...
            </div>
          )}

          <VideoPlayer
            url={`${process.env.PUBLIC_URL}/videos/Video01.mp4`}
            isActive={activeVideo === 1}
            volume={muted ? 0 : volume}
            playing={playing}
            onReady={() => setVideo1Ready(true)}
            onBuffer={setBuffering}
            seekTime={audioTime}
            isAudioSource={true}
          />

          <VideoPlayer
            url={`${process.env.PUBLIC_URL}/videos/Video02.mp4`}
            isActive={activeVideo === 2}
            volume={0}
            playing={playing}
            onReady={() => setVideo2Ready(true)}
            onBuffer={setBuffering}
            seekTime={audioTime}
            isAudioSource={false}
          />

          <VideoControls
            isPlaying={playing}
            onPlayPause={() => setPlaying(!playing)}
            isMuted={muted}
            onMuteToggle={toggleMute}
            onVolumeChange={setVolume}
            volume={volume}
            onFullScreen={toggleFullscreen}
            onSwitchCamera={handleSwitchVideo}
            disableButtons={buffering || transitioning || !(video1Ready && video2Ready)}
          />

          {buffering && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="text-white text-xl">Cargando...</div>
            </div>
          )}
        </div>
      </div>

      <AudioPlayer
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/audio/Mandarina.mp3`}
        playing={playing}
        volume={muted ? 0 : volume}
      />
    </div>
  );
}

export default App;
