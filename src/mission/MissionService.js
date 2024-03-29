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

export const deleteMission = (token, missionId) => axios.delete(`${baseUrl}/${missionId}`,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const listMissionMapByCampaign = (token, campaignId) => axios.get(`${baseUrl}/map/campaign/${campaignId}`,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const getMissionMap = (token, missionId) => axios.get(`${baseUrl}/map/${missionId}`,
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

export const updateMissionMap = (token, data) => axios.put(`${baseUrl}/map`,
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
    return result
}

function direction(diff) {
    return diff < 0
        ? (diff - 180) % 360 + 180
        : (diff + 180) % 360 - 180
}

export function generateMissionLineStringFromPoint(geometry, dataNav) {
    const result = {
        "type": "FeatureCollection",
        "name": "",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": []
    }

    dataNav.forEach((nav, idx) => {
        result.features.push(
            {
                "type": "Feature",
                "properties": {
                    "length_m": nav.distance,
                    "id": idx,
                    "directions": "",
                    "act_next": nav.description,
                    "descr": "",
                    "action_str": nav.type,
                    "missionID": 2
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        geometry.coordinates[idx],
                        geometry.coordinates[idx + 1],
                    ]
                }
            })


    })

    return result
}