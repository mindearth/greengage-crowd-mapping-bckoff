import * as turf from "@turf/turf";
import {mapboxGeocodingAddressFirst} from "../core/MapboxService.js";
import axios from "axios";

const baseUrl = '/api/mission'

export const listMission = (token) => axios.get(baseUrl,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const getMission = (token, missionId) => axios.get(`${baseUrl}/${missionId}`,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
export const insertMissionMap = (token, data) => axios.post(`${baseUrl}/map`,
    data,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

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
    let bearing = 0;
    let bearingLast = 0;

    for (let i = 0; i < length - 1; i++) {
        let type = ''

        bearingLast = bearing
        bearing = turf.bearing(turf.point(geometry.coordinates[i]), turf.point(geometry.coordinates[i + 1]))
        console.log(bearingLast, bearing)
        const distance = turf.distance(turf.point(geometry.coordinates[i]), turf.point(geometry.coordinates[i + 1])) * 1000

        const features = turf.points([
            geometry.coordinates[i],
            geometry.coordinates[i + 1]
        ]);
        const center = turf.center(features);

        if (i === 0) {
            type = 'start'
        } else {
            const dir = direction(bearing - bearingLast)
            if (dir >= -165 && dir <= -15) {
                type = 'left'
            } else if (dir >= 15 && dir <= 165) {
                type = 'right'
            } else {
                type = 'straight'
            }
        }

        result.push({
            type: type,
            angle: direction(bearing - bearingLast),
            x: {bearing: bearing, bearingLast: bearingLast},
            distance: Math.round(distance),
            description: await mapboxGeocodingAddressFirst(center.geometry.coordinates[0], center.geometry.coordinates[1])
        })
    }

    console.log(result)
    return result
}

function direction(diff) {
    return diff < 0
        ? (diff - 180) % 360 + 180
        : (diff + 180) % 360 - 180
}