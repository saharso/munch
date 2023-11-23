import { AspectRatio, Thumbnail } from "../../type";
import { TimeBar } from "../index";
import { useState } from "react";

interface TimelineProps {
  thumbnails: Thumbnail[];
  aspectRatio: AspectRatio;
  done: boolean;
  duration: number;
}

export default function Timeline({
  thumbnails,
  done,
  duration,
}: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(0);
  console.log(duration);
  return (
    <TimeBar currentTime={currentTime} done={done} duration={duration}>
      {thumbnails.map((thumbnail, index) => (
        <div
          key={thumbnail.time}
          style={{ backgroundImage: `url(${thumbnail.src})` }}
          data-time={thumbnail.time}
        />
      ))}
    </TimeBar>
  );
}
