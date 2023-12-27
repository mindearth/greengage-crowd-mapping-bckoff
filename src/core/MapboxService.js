import axios from "axios";


const baseUrl = 'https://api.mapbox.com/geocoding/v5/'

export const mapboxGeocodingAddress = (long, lat) => axios.get(`${baseUrl}mapbox.places/${long},${lat}.json?types=address&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)

export const mapboxGeocodingAddressFirst = (long, lat) => {
    return new Promise((resolve, reject) => {
        mapboxGeocodingAddress(long, lat).then((response) => {
            if (response.data.features.length > 0) {
                resolve(response.data.features[0].text)
            } else {
                resolve('')
            }
        }).catch((error) => {
            reject(error)
        })
    })
}