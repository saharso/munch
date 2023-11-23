import { useEffect, useRef, useState } from "react";
import { AspectRatio, Thumbnail } from "../../type";
import styles from "./Player.module.scss";
import classNames from "classnames";
import { getRatioHeight } from "../../utils";

function wait() {
  return new Promise<unknown>((resolve: (value: unknown) => void) => {
    setTimeout(() => {
      resolve(null);
    }, 36);
  });
}

interface PlayerProps {
  src: string;
  onThumbnailGenerated: (thumbnail: Thumbnail[]) => void;
  aspectRatio: AspectRatio;
  onDone: (done: boolean) => void;
  onLoad: (video: HTMLVideoElement) => void;
}

export default function Player({
  src,
  onThumbnailGenerated,
  aspectRatio,
  onDone,
  onLoad,
}: PlayerProps) {
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");

    const thumbnails: Thumbnail[] = [];
    let startTime = 0;
    const frameSkipMs = 10;

    video.addEventListener("loadedmetadata", async function () {
      onLoad(video);

      for (let i = 1; i <= video.duration; i++) {
        if (i % frameSkipMs === 0) {
          await wait();
          video.currentTime = i;
          captureThumbnail(video.currentTime);
        }
      }
      setDone(true);
      onThumbnailGenerated && onThumbnailGenerated(thumbnails);
    });
    video.addEventListener("timeupdate", function () {});

    function captureThumbnail(time: number) {
      console.log(video.currentTime);
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        getRatioHeight(canvas.width, aspectRatio),
      );

      thumbnails.push({
        time: time as number,
        src: canvas.toDataURL("image/jpeg"),
      });
      console.log(thumbnails);
    }
  }, []);
  return (
    <div>
      {!done && <div className={styles.loading}>loading...</div>}
      <video
        width="640"
        height="360"
        controls
        ref={videoRef}
        style={{ display: "block" }}
        className={classNames(styles.Player, { [styles.loading]: !done })}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
