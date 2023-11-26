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
interface TrimBarProps {
  done: boolean;
  duration: number;
  onClipStart: (startAt: number) => void;
  onClipEnd: (endAt: number) => void;
  currentTime: number;
}
export default function TrimBar({
  children,
  done,
  duration,
  onClipStart,
  onClipEnd,
  currentTime,
}: PropsWithChildren<TrimBarProps>) {
  const timeBarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement>(null);
  const [clipStart, setClipStart] = useState<number>(0);
  const [clipEnd, setClipEnd] = useState<number>();
  const [dialPosition, setDialPosition] = useState<number>(0);

  useEffect(() => {
    setClipEnd(Math.ceil(duration));
  }, [duration]);

  useEffect(() => {
    if (![duration, currentTime].every(Boolean)) return;
    setDialPosition((currentTime / duration) * 100);
  }, [currentTime, duration]);

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
    let gapBetweenMouseXAndSliderLeft: number = null;
    let gapBetweenMouseXAndSliderRight: number = null;

    slider.style.left = "0";
    slider.style.width = "100%";

    leftHandle.addEventListener("mousedown", (e) => {
      touchLeft = true;
      touchRight = false;
      gapBetweenMouseXAndSliderLeft =
        e.clientX - slider.getBoundingClientRect().left;
    });
    rightHandle.addEventListener("mousedown", (e) => {
      touchLeft = false;
      touchRight = true;
      gapBetweenMouseXAndSliderRight =
        slider.getBoundingClientRect().right - e.clientX;
    });
    timeBar.addEventListener("mousedown", (e) => {
      // prevent right click
      if (e.button !== 0) return;
      originalRight = slider.getBoundingClientRect().right - getLeft(e);
      originalLeft = slider.getBoundingClientRect().left - getLeft(e);
      sliderWidth = !sliderWidth ? slider.offsetWidth : sliderWidth;
    });
    slider.addEventListener("mousedown", (e) => {
      // make sure user intends to drag
      timeout = setTimeout(() => {
        setSliderDimensions = true;
      }, 100);
    });
    document.addEventListener("mouseup", (e) => {
      clearTimeout(timeout);
      timeout = null;
      if (setSliderDimensions) {
        if (clipStart !== null) {
          onClipStart(clipStart);
        }
        if (clipEnd !== null) {
          onClipEnd(clipEnd);
        }
      }
      setSliderDimensions = false;
    });

    timeBar.addEventListener("mousemove", (e) => {
      if (!setSliderDimensions) return;
      if (touchLeft) {
        const pos = getPosition(e) - gapBetweenMouseXAndSliderLeft;
        if (pos < 0) return;
        slider.style.left = pos + "px";
        slider.style.width = `${originalRight - pos}px`;
        const clipStartRatio = pos / timeBar.clientWidth;
        clipStart = Math.floor(clipStartRatio * duration);
        setClipStart(clipStart);
      }
      if (touchRight) {
        const pos = getPosition(e) + gapBetweenMouseXAndSliderRight;
        if (pos > timeBar.clientWidth) return;
        slider.style.width = `${pos - originalLeft}px`;
        const clipEndRatio = pos / timeBar.clientWidth;
        clipEnd = Math.ceil(clipEndRatio * duration);
        setClipEnd(clipEnd);
      }
    });
  }, [done, duration, onClipStart]);

  return (
    <div ref={timeBarRef} className={styles.Container}>
      <div className={styles.TimeBar}>
        {children}
        <div className={styles.Dial} style={{ left: `${dialPosition}%` }} />
      </div>

      {done && (
        <div ref={sliderRef} className={styles.Slider}>
          <div
            ref={leftHandleRef}
            className={classNames(styles.Handle, styles.left)}
          >
            <div className={styles.Tooltip}>
              <span>{clipStart}</span>
            </div>
          </div>
          <div
            ref={rightHandleRef}
            className={classNames(styles.Handle, styles.right)}
          >
            <div className={styles.Tooltip}>
              <span>{clipEnd}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
