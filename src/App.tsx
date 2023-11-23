import React, { useCallback, useState } from "react";
import "./index.scss";
import videoSrc from "./assets/sample.mp4";
import { AspectRatio, Thumbnail } from "./type";
import { Timeline, Player } from "./Features";
import { useGetThumbnails, useVideoControl } from "./hooks";
import PlayButton from "./Features/PlayButton/PlayButton";
const aspectRatio: AspectRatio = [640, 360];

function App() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const { thumbnails, duration } = useGetThumbnails({
    src: videoSrc,
    aspectRatio,
  });
  const { onClipStart, onClipEnd, onPlay, pause } = useVideoControl({ video });
  return (
    <div className="App">
      <Player src={videoSrc} aspectRatio={aspectRatio} onLoad={setVideo} />
      <div className={"layout-flex-y gap-3"}>
        <PlayButton onClick={onPlay} pause={pause} />
        <div className={"layout-spread-x"}>
          <Timeline
            onClipStart={onClipStart}
            onClipEnd={onClipEnd}
            thumbnails={thumbnails}
            aspectRatio={aspectRatio}
            duration={duration}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
