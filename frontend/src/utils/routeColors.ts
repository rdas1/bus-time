// Curated palette: saturated, dark enough for white text (WCAG AA contrast ≥ 4.5:1),
// and visually distinct from one another.
const ROUTE_COLOR_PALETTE = [
  '#0039a6', // blue
  '#c8102e', // red
  '#00763d', // green
  '#d4600a', // orange
  '#5f259f', // purple
  '#007a8a', // teal
  '#933b00', // brown
  '#9e1b5e', // magenta
  '#1a6b2a', // dark green
  '#004b8d', // navy
];

/** Returns a consistent color for a given route short name (e.g. "M101"). */
export function getRouteColor(routeShortName: string): string {
  if (!routeShortName) return ROUTE_COLOR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < routeShortName.length; i++) {
    hash = (hash * 31 + routeShortName.charCodeAt(i)) & 0x7fffffff;
  }
  return ROUTE_COLOR_PALETTE[hash % ROUTE_COLOR_PALETTE.length];
}
