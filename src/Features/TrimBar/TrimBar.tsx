import { PropsWithChildren } from "react";
import styles from "./TrimBar.module.scss";
export default function TrimBar({ children }: PropsWithChildren) {
  return <div className={styles.TimeBar}>{children}</div>;
}
