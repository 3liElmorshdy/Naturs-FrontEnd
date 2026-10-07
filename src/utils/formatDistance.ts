export type DistanceUnit = "mi" | "km";

export const formatDistance = (
  distance: number,
  unit: DistanceUnit,
) => {
  if (!Number.isFinite(distance)) {
    return "";
  }

  // أقل من 10: أظهر decimal واحد، مثل 2.4 mi away
  if (distance < 10) {
    return `${distance.toFixed(1)} ${unit} away`;
  }

  // أكبر من 10: رقم صحيح، مثل 40 mi away
  return `${Math.round(distance)} ${unit} away`;
};