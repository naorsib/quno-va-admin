'use client';

import { Pause, Play, Volume2, VolumeOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioControlsProps {
  audioSrc: string;
}
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
export function AudioControls({ audioSrc }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line unicorn/no-null
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      if (!Number.isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    updateDuration();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleSliderChange = (newValue: number[]) => {
    const newTime = newValue[0];
    setCurrentTime(newTime);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      <Button
        onClick={togglePlayPause}
        variant="outline"
        size="icon"
        className="bg-white"
      >
        {isPlaying ? (
          <Pause fill="currentColor" className="h-4 w-4" />
        ) : (
          <Play fill="currentColor" className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={handleSliderChange}
        className="hidden"
      />
      <span className="hidden text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      <Button
        onClick={toggleMute}
        variant="outline"
        size="icon"
        className="bg-white"
      >
        {isMuted ? (
          <VolumeOff fill="currentColor" className="h-4 w-4" />
        ) : (
          <Volume2 fill="currentColor" className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
