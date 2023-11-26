import React, { useMemo } from "react";
import getFormattedTime from "../../utils/getFormattedTime";

interface ProgressBarProps {
  onChange: (value: number) => void;
  currentTime: number;
  clipRange: [number, number];
  clippedDuration: number;
}

function getFixed(num: number) {
  return Number(num.toFixed(5));
}

export default function ProgressBar({
  onChange,
  currentTime,
  clipRange,
  clippedDuration,
}: ProgressBarProps) {
  const startAt = clipRange[0];
  const displayRange = useMemo(() => {
    if (!clippedDuration) return "";
    return `${getFormattedTime(
      getFixed(currentTime) - getFixed(clipRange[0]),
    )} / ${getFormattedTime(clippedDuration)}`;
  }, [clippedDuration, clipRange, currentTime]);

  return (
    <div>
      <div className={"layout-flex-end"}>
        <div className={"fs-12"}>{displayRange}</div>
      </div>
      <input
        type="range"
        min={0}
        max={clippedDuration && Math.floor(clippedDuration)}
        step="0.01"
        className={"width-full"}
        onChange={(e) => {
          onChange(Number(e.target.value) + startAt);
        }}
        value={currentTime - startAt}
      />
    </div>
  );
}
