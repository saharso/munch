import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface VideoControlProps {
  video: HTMLVideoElement;
}

const defaultVolume = 0.5;
function exceedClipEnd(
  clipEnd: MutableRefObject<number>,
  video: HTMLVideoElement,
) {
  return clipEnd.current && video.currentTime >= clipEnd.current;
}

export default function useVideoControl({ video }: VideoControlProps) {
  const clipEnd = useRef<number>();
  const [pause, setPause] = useState(false);
  const [volume, steVolume] = useState(defaultVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [clipRange, setClipRange] = useState<[number, number]>([0, 0]);
  const [clippedDuration, setClippedDuration] = useState<number>();

  const onClipStart = useCallback(
    (startAt: number) => {
      if (!video) return;
      video.currentTime = startAt;
      setClipRange((prev) => [startAt, prev[1]]);
    },
    [video],
  );
  const onClipEnd = useCallback(
    (endAt: number) => {
      clipEnd.current = endAt;
      setClipRange((prev) => [prev[0], endAt]);
    },
    [video],
  );
  const onPlay = useCallback(
    (play: boolean) => {
      if (!video || exceedClipEnd(clipEnd, video)) return;
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
    setClipRange([0, video.duration]);
    video.volume = defaultVolume;
    video.addEventListener("timeupdate", () => {
      if (exceedClipEnd(clipEnd, video)) {
        video.pause();
      }
      setCurrentTime(video.currentTime);
    });
  }, [video]);

  useEffect(() => {
    if (![clipRange, video].every(Boolean)) return;
    setClippedDuration(clipRange[1] - clipRange[0]);
  }, [clipRange, video]);

  return {
    onClipStart,
    clipRange,
    onClipEnd,
    onPlay,
    pause,
    onVolumeChange,
    volume,
    currentTime,
    onCurrentTimeChange,
    clippedDuration,
  };
}
