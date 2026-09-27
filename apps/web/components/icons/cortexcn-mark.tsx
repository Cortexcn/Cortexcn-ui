import type { SVGProps } from "react";

/**
 * The Cortexcn mark as a flat vector in currentColor, for large or tinted uses
 * where the tile image in `cortexcn.tsx` does not fit. Drawn on a 3 x 3 grid:
 * two lone corner squares and a diagonal of three joined by rounded bridges.
 */
export function CortexcnMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 3 3"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M.17 0H.83A.17 .17 0 0 1 1 .17V.83A.17 .17 0 0 1 .83 1H.17A.17 .17 0 0 1 0 .83V.17A.17 .17 0 0 1 .17 0Z" />
      <path d="M2.17 2H2.83A.17 .17 0 0 1 3 2.17V2.83A.17 .17 0 0 1 2.83 3H2.17A.17 .17 0 0 1 2 2.83V2.17A.17 .17 0 0 1 2.17 2Z" />
      <path d="M2.17 0H2.83A.17 .17 0 0 1 3 .17V.83A.17 .17 0 0 1 2.83 1H2.32A.32 .32 0 0 0 2 1.32V1.83A.17 .17 0 0 1 1.83 2H1.32A.32 .32 0 0 0 1 2.32V2.83A.17 .17 0 0 1 .83 3H.17A.17 .17 0 0 1 0 2.83V2.17A.17 .17 0 0 1 .17 2H.68A.32 .32 0 0 0 1 1.68V1.17A.17 .17 0 0 1 1.17 1H1.68A.32 .32 0 0 0 2 .68V.17A.17 .17 0 0 1 2.17 0Z" />
    </svg>
  );
}
