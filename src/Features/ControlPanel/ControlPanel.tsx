import { ReactComponent as PlayIcon } from "../../assets/play.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause.svg";
import { ReactComponent as VolumeIcon } from "../../assets/volume.svg";
import styles from "./ControlPanel.module.scss";
import classNames from "classnames";
import { VolumeBar } from "../index";
import React, { useState } from "react";

interface PlayButtonProps {
  onClick: (pause: boolean) => void;
  pause: boolean;
  onVolumeChange: (value: number) => void;
  volume: number;
}
export default function ControlPanel({
  onClick,
  pause,
  onVolumeChange,
  volume,
}: PlayButtonProps) {
  const [showVolume, setShowVolume] = useState<boolean>(false);
  return (
    <div className={styles.ControlPanel}>
      <div className={"layout-flex-y gap-1"}>
        <button
          className={classNames("norm-button", styles.PlayButton)}
          onClick={() => onClick(!pause)}
        >
          {pause ? (
            <PauseIcon
              className={styles.PlayIcon}
              preserveAspectRatio={"none"}
              stroke={"white"}
            />
          ) : (
            <PlayIcon
              className={classNames(styles.PlayIcon, styles.play)}
              preserveAspectRatio={"none"}
              stroke={"white"}
            />
          )}
        </button>
        <button
          className={classNames("norm-button", styles.PlayButton)}
          onClick={() => {
            setShowVolume((prev) => !prev);
          }}
        >
          <VolumeIcon
            className={styles.PlayIcon}
            stroke={"white"}
            preserveAspectRatio={"none"}
          />
        </button>
      </div>
      {showVolume && (
        <div className={styles.VolumeBarContainer}>
          <VolumeBar onChange={onVolumeChange} volume={volume} />
        </div>
      )}
    </div>
  );
}
