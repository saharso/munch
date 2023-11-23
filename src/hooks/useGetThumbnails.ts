import { useEffect, useMemo, useState } from "react";
import { AspectRatio, Thumbnail } from "../type";
import { getRatioHeight, wait } from "../utils";
import { blackImage } from "../const";

interface GetThumbnailsProps {
  src: string;
  aspectRatio: AspectRatio;
}

export default function useGetThumbnails({
  src,
  aspectRatio,
}: GetThumbnailsProps) {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>();
  const tempVideo = useMemo(() => {
    const video = document.createElement("video");
    video.innerHTML = `<source src="${src}" type="video/mp4" />`;
    video.width = aspectRatio[0];
    video.height = aspectRatio[1];
    return video;
  }, [aspectRatio]);

  useEffect(() => {
    if (![tempVideo, aspectRatio].some(Boolean)) return;
    const video = tempVideo;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const thumbnails: Thumbnail[] = [];
    const frameSkipMs = 10;

    video.addEventListener("loadedmetadata", async function () {
      for (let i = 1; i <= video.duration; i++) {
        if (i % frameSkipMs === 0) {
          video.currentTime = i;
          await wait();
          captureThumbnail(video.currentTime);
        }
      }
      video.currentTime = video.duration;
      await wait();
      captureThumbnail(video.currentTime);

      setThumbnails(thumbnails);
    });

    function captureThumbnail(time: number) {
      canvas.width = video.width;
      canvas.height = video.height;
      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        getRatioHeight(canvas.width, aspectRatio),
      );
      const src = canvas.toDataURL("image/jpeg");

      if (!src.includes(blackImage)) {
        thumbnails.push({
          time: time as number,
          src,
        });
      }
    }
  }, [tempVideo, aspectRatio]);

  return { thumbnails, duration: tempVideo?.duration };
}
