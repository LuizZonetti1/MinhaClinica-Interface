import type { SkeletonProps, SkeletonVariant } from "../../types/components";
import { SkeletonBlock } from "./styles";

export type { SkeletonVariant };
export type { SkeletonProps };

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
