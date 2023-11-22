import { AspectRatio } from "../type";

export default function getRatioHeight(
  width: number,
  aspectRation: AspectRatio,
) {
  const ratio = aspectRation[0] / aspectRation[1];
  return width / ratio;
}
