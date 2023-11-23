import React from "react";

interface ProgressBarProps {
  onChange: (value: number) => void;
  currentTime: number;
  duration: number;
}

export default function ProgressBar({
  onChange,
  currentTime,
  duration,
}: ProgressBarProps) {
  return (
    <div>
      <div className={"layout-flex-end"}>
        <div className={"fs-12"}>
          {Math.ceil(currentTime)} / {Math.ceil(duration)}
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        className={"width-full"}
        onChange={(e) => onChange(duration * Number(e.target.value))}
        value={currentTime && duration ? currentTime / duration : 0}
      />
    </div>
  );
}
