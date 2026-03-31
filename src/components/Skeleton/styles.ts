import styled, { keyframes } from "styled-components";
import { theme } from "../../themes/themes";
import type { SkeletonVariant } from "./index";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const resolveSize = (value: number | string | undefined, fallback: string) => {
  if (value === undefined) return fallback;
  if (typeof value === "number") return `${value}px`;
  return value;
};

type SkeletonStyleProps = {
  $width?: number | string;
  $height?: number | string;
  $radius?: number | string;
  $variant: SkeletonVariant;
};

export const SkeletonBlock = styled.span<SkeletonStyleProps>`
  display: block;
  width: ${({ $width }) => resolveSize($width, "100%")};
  height: ${({ $height, $variant }) =>
    resolveSize($height, $variant === "text" ? "0.95rem" : "16px")};
  border-radius: ${({ $variant, $radius }) =>
    $variant === "circle" ? "50%" : resolveSize($radius, "8px")};
  background: ${theme.colors.surfaceMuted};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.48) 50%,
      transparent 100%
    );
    animation: ${shimmer} 1.35s ease-in-out infinite;
  }
`;
