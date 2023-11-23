import { ReactComponent as PlayIcon } from "../../assets/play.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause.svg";
import styles from "./PlayButton.module.scss";
import classNames from "classnames";

interface PlayButtonProps {
  onClick: (pause: boolean) => void;
  pause: boolean;
}
export default function PlayButton({ onClick, pause }: PlayButtonProps) {
  return (
    <button
      className={classNames("norm-button", styles.PlayButton)}
      onClick={() => onClick(!pause)}
    >
      {pause ? (
        <PauseIcon className={styles.PlayIcon} preserveAspectRatio={"none"} />
      ) : (
        <PlayIcon
          className={classNames(styles.PlayIcon, styles.play)}
          preserveAspectRatio={"none"}
        />
      )}
    </button>
  );
}
