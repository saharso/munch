import { useEffect, useRef } from "react";
import { AspectRatio } from "../../type";
import styles from "./Player.module.scss";
import classNames from "classnames";

interface PlayerProps {
  src: string;
  aspectRatio: AspectRatio;
  onLoad: (video: HTMLVideoElement) => void;
}

export default function Player({ src, aspectRatio, onLoad }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("loadeddata", () => {
      onLoad(video);
    });
  }, []);
  return (
    <article className={styles.Wrapper}>
      <div className={classNames("layout-flex-x", styles.VideoContainer)}>
        <video
          ref={videoRef}
          width={aspectRatio[0]}
          height={aspectRatio[1]}
          controls={false}
          style={{ display: "block" }}
          className={classNames(styles.Player)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </article>
  );
}
