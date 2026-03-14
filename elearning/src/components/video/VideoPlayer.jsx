import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ src, poster, onEnded }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration || 0);
    const onEnded_ = () => { setPlaying(false); onEnded?.(); };
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded_);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded_);
    };
  }, [onEnded]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [playing]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (playing) { video.pause(); setPlaying(false); }
    else { video.play(); setPlaying(true); }
    resetHideTimer();
  };

  const handleSeek = ([val]) => {
    videoRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolume = ([val]) => {
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const skip = (sec) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + sec));
    setCurrentTime(video.currentTime);
  };

  const changeSpeed = (s) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden group select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
        {!playing && (
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="h-7 w-7 text-white fill-white ml-1" />
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !playing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full mb-3 cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child]:h-1 [&>span:first-child_span]:bg-primary"
        />

        <div className="flex items-center gap-2">
          <button onClick={() => skip(-10)} className="text-white/70 hover:text-white transition-colors p-1">
            <SkipBack className="h-4 w-4" />
          </button>

          <button onClick={togglePlay} className="text-white hover:text-primary transition-colors p-1">
            {playing
              ? <Pause className="h-5 w-5 fill-white" />
              : <Play className="h-5 w-5 fill-white" />}
          </button>

          <button onClick={() => skip(10)} className="text-white/70 hover:text-white transition-colors p-1">
            <SkipForward className="h-4 w-4" />
          </button>

          <span className="text-white text-xs font-mono ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors p-1">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="w-20 hidden sm:block">
            <Slider
              value={[muted ? 0 : volume]}
              max={1}
              step={0.05}
              onValueChange={handleVolume}
              className="[&_[role=slider]]:h-2.5 [&_[role=slider]]:w-2.5 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child]:h-0.5 [&>span:first-child_span]:bg-primary"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white/70 hover:text-white transition-colors text-xs font-semibold px-1.5 py-0.5 rounded border border-white/30 hover:border-white/60">
                {speed}x
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              {PLAYBACK_SPEEDS.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`text-xs ${speed === s ? 'text-primary font-semibold' : ''}`}
                >
                  {s}x {speed === s && '✓'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors p-1">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
