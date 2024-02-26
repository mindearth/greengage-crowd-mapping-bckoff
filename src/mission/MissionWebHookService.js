import axios from "axios";

const baseUrl = 'https://api-stage.greengage.dev/webhooks'
const token = import.meta.env.VITE_WEBHOOK_TOKEN

export const notifyCreateMission = (data) => axios.post(baseUrl,
    data,
    {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })

/*
curl --location --request POST 'https://api-stage.greengage.dev/webhooks' \
--header 'Authorization: q4Rqm7KBWitMcu_@' \
--header 'Content-Type: application/json' \
--data-raw '{

"origin":"mindearth",

"data": {

"name":"Test",
"starting_point" : [45.46464374888545, 9.18934835519496],
"description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using <Content here, content here>, making it look like readable English.",
"duration_min": 5,
"distance_mt": 1200
}

}'

 */
