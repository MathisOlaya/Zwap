const minimumView = 20; // minimum views for reliable score
const globalMoy = 0.15; // moyenne globale

// Calculating popularity score
export function calcPopularityScore(click: number, like: number) {
  const ratio = like / click;
  return (
    (click / (click + minimumView)) * ratio +
    (minimumView / (click + minimumView)) * globalMoy
  );
}
