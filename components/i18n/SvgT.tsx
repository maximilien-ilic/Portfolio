import type { Text } from './T';

/* T for SVG text: two <tspan>s instead of <span>s (a <span> isn't valid
   inside <text>). The same CSS rule hides the inactive language. */
export default function SvgT({ fr, en }: Text) {
  return (
    <>
      <tspan data-l="fr">{fr}</tspan>
      <tspan data-l="en">{en}</tspan>
    </>
  );
}
