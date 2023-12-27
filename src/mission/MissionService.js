import * as turf from "@turf/turf";
import {mapboxGeocodingAddressFirst} from "../core/MapboxService.js";

export function generateMissionHeaderFromPoint(geometry) {
    const line = turf.lineString(geometry.coordinates)
    const length = Math.round(turf.length(line) * 1000)
    const time = Math.round(length / (5 * 1000 / 60))

    return {
        length: length,
        time: time
    }

}

export async function generateMissionFromPoint(geometry) {
    const result = [];
    const length = geometry.coordinates.length;

    for (let i = 0; i < length - 1; i++) {
        let type = ''
        if (i === 0) {
            type = 'start'
        } else {
            type = 'right'
        }

        const features = turf.points([
            geometry.coordinates[i],
            geometry.coordinates[i + 1]
        ]);
        const center = turf.center(features);

        result.push({
            type: type,
            distance: parseInt(turf.distance(turf.point(geometry.coordinates[i]), turf.point(geometry.coordinates[i + 1])) * 1000, 10),
            description: await mapboxGeocodingAddressFirst(center.geometry.coordinates[0], center.geometry.coordinates[1])
        })
    }

    return result
}