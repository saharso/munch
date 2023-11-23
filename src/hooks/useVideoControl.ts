import { useCallback, useEffect, useRef, useState } from "react";

interface VideoControlProps {
  video: HTMLVideoElement;
}
export default function useVideoControl({ video }: VideoControlProps) {
  const clipEnd = useRef<number>();
  const [pause, setPause] = useState(false);
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

  useEffect(() => {
    if (!video) return;
    video.addEventListener("timeupdate", () => {
      const stopPoint = clipEnd.current;
      if (stopPoint && video.currentTime >= stopPoint) {
        video.pause();
      }
    });
  }, [video]);

  return { onClipStart, onClipEnd, onPlay, pause };
}
