import React, { useCallback, useState } from "react";
import "./index.scss";
import videoSrc from "./assets/ForBiggerEscapes.mp4";
import { AspectRatio } from "./type";
import { Timeline, Player, ControlPanel } from "./Features";
import { useGetThumbnails, useVideoControl } from "./hooks";
import styles from "./App.module.scss";
import classNames from "classnames";
import ProgressBar from "./Features/ProgressBar/ProgressBar";

const aspectRatio: AspectRatio = [640, 360];

function App() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const { thumbnails, duration } = useGetThumbnails({
    src: videoSrc,
    aspectRatio,
  });
  const {
    onClipStart,
    onClipEnd,
    onPlay,
    onVolumeChange,
    onCurrentTimeChange,
    isPlay,
    volume,
    currentTime,
    clipRange,
    clippedDuration,
  } = useVideoControl({ video });
  return (
    <div className={classNames("App", styles.AppLayout)}>
      <Player src={videoSrc} aspectRatio={aspectRatio} onLoad={setVideo} />
      <div>
        <div className={"row-8"}>
          <ProgressBar
            currentTime={currentTime}
            onChange={onCurrentTimeChange}
            clipRange={clipRange}
            clippedDuration={clippedDuration}
          />
        </div>
        <div className={"layout-flex-y gap-3"}>
          <ControlPanel
            onClick={onPlay}
            pause={isPlay}
            onVolumeChange={onVolumeChange}
            volume={volume}
          />
          <div className={"layout-spread-x"}>
            <Timeline
              onClipStart={onClipStart}
              onClipEnd={onClipEnd}
              thumbnails={thumbnails}
              aspectRatio={aspectRatio}
              duration={duration}
              currentTime={currentTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
