export const CHICAGO_COORDINATES = {
  latitude: 41.8781,
  longitude: -87.6298,
} as const;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;
const normalizeDegrees = (degrees: number) => ((degrees % 360) + 360) % 360;

export interface SolarPosition {
  azimuth: number;
  elevation: number;
  edgeX: number;
  edgeY: number;
  rayAngle: number;
  daylight: number;
}

function smoothstep(start: number, end: number, value: number) {
  const amount = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return amount * amount * (3 - 2 * amount);
}

export function getSolarPosition(date: Date): SolarPosition {
  const julianDate = date.getTime() / 86_400_000 + 2_440_587.5;
  const daysSinceJ2000 = julianDate - 2_451_545;
  const meanLongitude = normalizeDegrees(280.46 + 0.9856474 * daysSinceJ2000);
  const meanAnomaly = normalizeDegrees(357.528 + 0.9856003 * daysSinceJ2000);
  const eclipticLongitude = normalizeDegrees(
    meanLongitude +
      1.915 * Math.sin(toRadians(meanAnomaly)) +
      0.02 * Math.sin(toRadians(2 * meanAnomaly)),
  );
  const obliquity = 23.439 - 0.0000004 * daysSinceJ2000;
  const rightAscension = normalizeDegrees(
    toDegrees(
      Math.atan2(
        Math.cos(toRadians(obliquity)) * Math.sin(toRadians(eclipticLongitude)),
        Math.cos(toRadians(eclipticLongitude)),
      ),
    ),
  );
  const declination = Math.asin(
    Math.sin(toRadians(obliquity)) * Math.sin(toRadians(eclipticLongitude)),
  );
  const siderealTime = normalizeDegrees(
    280.46061837 + 360.98564736629 * daysSinceJ2000 + CHICAGO_COORDINATES.longitude,
  );
  const hourAngle = toRadians(normalizeDegrees(siderealTime - rightAscension + 180) - 180);
  const latitude = toRadians(CHICAGO_COORDINATES.latitude);
  const elevation = Math.asin(
    Math.sin(latitude) * Math.sin(declination) +
      Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
  );
  const azimuth = normalizeDegrees(
    toDegrees(
      Math.atan2(
        -Math.sin(hourAngle),
        Math.tan(declination) * Math.cos(latitude) -
          Math.sin(latitude) * Math.cos(hourAngle),
      ),
    ),
  );

  const directionX = Math.sin(toRadians(azimuth));
  const directionY = -Math.cos(toRadians(azimuth));
  const edgeScale = 1 / Math.max(Math.abs(directionX), Math.abs(directionY));

  return {
    azimuth,
    elevation: toDegrees(elevation),
    edgeX: 50 + 50 * directionX * edgeScale,
    edgeY: 50 + 50 * directionY * edgeScale,
    rayAngle: toDegrees(Math.atan2(-directionY, -directionX)),
    daylight: smoothstep(-6, 12, toDegrees(elevation)),
  };
}

export function formatChicagoTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}
