import { useCallback, useEffect, useRef, useState } from "react";

interface VideoControlProps {
  video: HTMLVideoElement;
}

const defaultVolume = 0.5;
export default function useVideoControl({ video }: VideoControlProps) {
  const clipEnd = useRef<number>();
  const [pause, setPause] = useState(false);
  const [volume, steVolume] = useState(defaultVolume);
  const [currentTime, setCurrentTime] = useState(0);

  const onClipStart = useCallback(
    (startAt: number) => {
      if (!video) return;
      video.currentTime = startAt;
    },
    [video],
  );
  const onClipEnd = useCallback(
    (endAt: number) => {
      clipEnd.current = endAt;
    },
    [video],
  );
  const onPlay = useCallback(
    (play: boolean) => {
      if (!video) return;
      if (!play) {
        video.pause();
      } else {
        void video.play();
      }
      setPause(play);
    },
    [video],
  );

  const onVolumeChange = useCallback(
    (volume: number) => {
      steVolume(volume);
      video.volume = volume;
    },
    [video],
  );

  const onCurrentTimeChange = useCallback(
    (time: number) => {
      video.currentTime = time;
    },
    [video],
  );

  useEffect(() => {
    if (!video) return;
    video.volume = defaultVolume;
    video.addEventListener("timeupdate", () => {
      const stopPoint = clipEnd.current;
      if (stopPoint && video.currentTime >= stopPoint) {
        video.pause();
      }
      setCurrentTime(video.currentTime);
    });
  }, [video]);

  return {
    onClipStart,
    onClipEnd,
    onPlay,
    pause,
    onVolumeChange,
    volume,
    currentTime,
    onCurrentTimeChange,
  };
}
