import { PropsWithChildren, useEffect, useRef, useState } from "react";
import styles from "./TrimBar.module.scss";
import classNames from "classnames";

function getLeft(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;
  return target.getBoundingClientRect().left;
}
function getPosition(e: MouseEvent) {
  return e.clientX - getLeft(e);
}
function getTimeRatio(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;
  return getPosition(e) / target.clientWidth;
}

interface TrimBarProps {
  done: boolean;
  duration: number;
  onClipStart: (startAt: number) => void;
  onClipEnd: (endAt: number) => void;
}
export default function TrimBar({
  children,
  done,
  duration,
  onClipStart,
  onClipEnd,
}: PropsWithChildren<TrimBarProps>) {
  const timeBarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (![duration, done, onClipStart].every(Boolean)) return;

    const timeBar = timeBarRef.current;
    const slider = sliderRef.current;
    const leftHandle = leftHandleRef.current;
    const rightHandle = rightHandleRef.current;
    let timeout: NodeJS.Timeout;
    let setSliderDimensions = false;
    let sliderWidth: number = null;
    let touchLeft = false;
    let touchRight = false;
    let originalRight: number = null;
    let originalLeft: number = null;
    let clipStart: number = null;
    let clipEnd: number = null;

    slider.style.left = "0";
    slider.style.width = "100%";

    leftHandle.addEventListener("mousedown", (e) => {
      touchLeft = true;
      touchRight = false;
    });
    rightHandle.addEventListener("mousedown", (e) => {
      touchLeft = false;
      touchRight = true;
    });
    timeBar.addEventListener("mousedown", (e) => {
      // prevent right click
      if (e.button !== 0) return;
      originalRight = slider.getBoundingClientRect().right - getLeft(e);
      originalLeft = slider.getBoundingClientRect().left - getLeft(e);
      // make sure user intends to drag
      timeout = setTimeout(() => {
        setSliderDimensions = true;
        sliderWidth = !sliderWidth ? slider.offsetWidth : sliderWidth;
      }, 100);
    });
    document.addEventListener("mouseup", (e) => {
      clearTimeout(timeout);
      timeout = null;
      setSliderDimensions = false;
      if (clipStart !== null) {
        onClipStart(clipStart);
        clipStart = null;
      }
      if (clipEnd !== null) {
        onClipEnd(clipEnd);
        clipEnd = null;
      }
    });

    timeBar.addEventListener("mousemove", (e) => {
      if (!setSliderDimensions) return;
      if (touchLeft) {
        const left = getPosition(e);
        slider.style.left = left + "px";
        slider.style.width = `${originalRight - left}px`;
        originalLeft = slider.getBoundingClientRect().left - getLeft(e);
        const clipStartRatio = getPosition(e) / timeBar.clientWidth;
        clipStart = clipStartRatio * duration;
      }
      if (touchRight) {
        const left = getPosition(e);
        slider.style.width = `${left - originalLeft}px`;
        originalRight = slider.getBoundingClientRect().right - getLeft(e);
        const clipEndRatio = getPosition(e) / timeBar.clientWidth;
        clipEnd = clipEndRatio * duration;
      }
    });
  }, [done, duration, onClipStart]);

  return (
    <div ref={timeBarRef} className={styles.Container}>
      <div className={styles.TimeBar}>{children}</div>
      {done && (
        <div ref={sliderRef} className={styles.Slider}>
          <div
            ref={leftHandleRef}
            className={classNames(styles.Handle, styles.left)}
          />
          <div
            ref={rightHandleRef}
            className={classNames(styles.Handle, styles.right)}
          />
        </div>
      )}
    </div>
  );
}
