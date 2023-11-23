import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { ReactComponent as MuteButton } from "../../assets/mic-off.svg";
import styles from "./VolumeBar.module.scss";
import classNames from "classnames";

interface VolumeBarProps {
  onChange: (value: number) => void;
  volume: number;
}
export default function VolumeBar({ onChange, volume }: VolumeBarProps) {
  const toggleMute = useRef<boolean>(true);
  const prevVolume = useRef<number>(volume);
  const handleVolumeChange = useCallback(
    (value: string | number) => {
      const newVolume = parseFloat(value as string);
      onChange(newVolume);
    },
    [onChange],
  );

  return (
    <div className={classNames("layout-flex-y gap-1", styles.VolumeBar)}>
      <button
        className={"norm-button"}
        aria-label={"mute"}
        onClick={() => {
          toggleMute.current
            ? handleVolumeChange(0)
            : handleVolumeChange(prevVolume.current);
          toggleMute.current = !toggleMute.current;
        }}
      >
        <MuteButton stroke={"white"} width={16} height={16} />
      </button>
      <div className={"layout-spread-x"}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          className={"width-full"}
          value={volume}
          onChange={(e) => {
            const value = (e.target as HTMLInputElement).value;
            handleVolumeChange(value);
            prevVolume.current = parseFloat(value);
          }}
        />
      </div>
    </div>
  );
}
