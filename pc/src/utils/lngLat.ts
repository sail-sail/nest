export type LngLat = {
  longitude: number;
  latitude: number;
};

const coordinatePattern = /^\s*([-+]?\d{1,3}(?:\.\d+)?)(?:\s*,\s*|\s+)([-+]?\d{1,3}(?:\.\d+)?)\s*$/;

export function parseCoordinateText(text?: string | null): LngLat | undefined {
  if (!text) {
    return undefined;
  }

  const match = text.trim().match(coordinatePattern);
  if (!match) {
    return undefined;
  }

  const longitude = Number(match[1]);
  const latitude = Number(match[2]);

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return undefined;
  }
  if (longitude < -180 || longitude > 180) {
    return undefined;
  }
  if (latitude < -90 || latitude > 90) {
    return undefined;
  }

  return {
    longitude,
    latitude,
  };
}
