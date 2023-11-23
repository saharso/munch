import { useEffect, useMemo, useRef, useState } from "react";
import { AspectRatio, Thumbnail } from "../../type";
import styles from "./Player.module.scss";
import classNames from "classnames";
import { getRatioHeight, wait } from "../../utils";
import { blackImage } from "../../const";

interface PlayerProps {
  src: string;
  aspectRatio: AspectRatio;
  onLoad: (video: HTMLVideoElement) => void;
}

export default function Player({ src, aspectRatio, onLoad }: PlayerProps) {
  return (
    <div>
      <video
        width={aspectRatio[0]}
        height={aspectRatio[1]}
        controls
        style={{ display: "block" }}
        className={classNames(styles.Player)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
