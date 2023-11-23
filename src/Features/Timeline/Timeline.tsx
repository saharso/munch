import { AspectRatio, Thumbnail } from "../../type";
import { TimeBar } from "../index";
import { useState } from "react";

interface TimelineProps {
  thumbnails: Thumbnail[];
  aspectRatio: AspectRatio;
  duration: number;
}

export default function Timeline({ thumbnails, duration }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <TimeBar
      currentTime={currentTime}
      done={Boolean(thumbnails)}
      duration={duration}
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
