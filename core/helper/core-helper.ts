export function getDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371000; // 🌍 Earth radius in meters
    const toRad = (x: number) => (x * Math.PI) / 180; // convert degrees → radians

    // step 1: differences
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    // step 2: apply Haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    // step 3: central angle
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // step 4: distance
    return R * c; // meters
}


