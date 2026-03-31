import type { HTMLAttributes } from "react";
import { SkeletonBlock } from "./styles";

export type SkeletonVariant = "rect" | "text" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  variant?: SkeletonVariant;
}

export const Skeleton = ({
  width,
  height,
  radius,
  variant = "rect",
  ...props
}: SkeletonProps) => {
  return (
    <SkeletonBlock
      aria-hidden="true"
      $width={width}
      $height={height}
      $radius={radius}
      $variant={variant}
      {...props}
    />
  );
};
