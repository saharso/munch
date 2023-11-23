import { AspectRatio, Thumbnail } from "../../type";
import { TimeBar } from "../index";

interface TimelineProps {
  thumbnails: Thumbnail[];
  aspectRatio: AspectRatio;
  duration: number;
  onClipStart: (startAt: number) => void;
  onClipEnd: (endAt: number) => void;
  currentTime: number;
}

export default function Timeline({
  thumbnails,
  duration,
  onClipStart,
  onClipEnd,
  currentTime,
}: TimelineProps) {
  return (
    <TimeBar
      done={Boolean(thumbnails)}
      duration={duration}
      onClipEnd={onClipEnd}
      onClipStart={onClipStart}
      currentTime={currentTime}
    >
      {thumbnails?.map((thumbnail, index) => (
        <div
          key={thumbnail.time}
          style={{ backgroundImage: `url(${thumbnail.src})` }}
          data-time={thumbnail.time}
        />
      ))}
    </TimeBar>
  );
}
