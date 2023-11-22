import { useEffect, useRef, useState } from "react";
import { Thumbnail } from "../../type";
import styles from "./Player.module.scss";
import classNames from "classnames";

interface PlayerProps {
  src: string;
  onThumbnailGenerated: (thumbnail: Thumbnail[]) => void;
}

export default function Player({ src, onThumbnailGenerated }: PlayerProps) {
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");

    const thumbnails: Thumbnail[] = [];
    let startTime = 0;
    let done = false;
    const frameSkipMs = 5;

    video.addEventListener("loadedmetadata", function () {
      function recursion() {
        if (startTime < video.duration) {
          video.currentTime = startTime += frameSkipMs;
          requestAnimationFrame(recursion);
        } else {
          video.currentTime = 0;
          done = true;
        }
      }
      recursion();
    });
    video.addEventListener("seeked", function () {
      captureThumbnail(video.currentTime);
    });

    function captureThumbnail(time: number) {
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      thumbnails.push({
        time: time as number,
        src: canvas.toDataURL("image/jpeg"),
      });
      if (done) {
        onThumbnailGenerated && onThumbnailGenerated(thumbnails);
        setDone(true);
      }
    }
  }, []);
  return (
    <div>
      {!done && (
        <canvas
          ref={canvasRef}
          width="640"
          height="360"
          style={{ display: "none" }}
        />
      )}
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
