import React from "react";

interface ProgressBarProps {
  onChange: (value: number) => void;
  currentTime: number;
  clipRange: [number, number];
}

export default function ProgressBar({
  onChange,
  currentTime,
  clipRange,
}: ProgressBarProps) {
  return (
    <div>
      <div className={"layout-flex-end"}>
        <div className={"fs-12"}>
          {Math.ceil(currentTime)} / {Math.ceil(clipRange[1])}
        </div>
      </div>
      <input
        type="range"
        min={clipRange[0]}
        max={clipRange[1]}
        step="0.01"
        className={"width-full"}
        onChange={(e) => onChange(clipRange[1] * Number(e.target.value))}
        value={currentTime && clipRange[1] ? currentTime / clipRange[1] : 0}
      />
    </div>
  );
}
