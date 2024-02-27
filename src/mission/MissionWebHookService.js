import axios from "axios";

const baseUrl = 'https://api-stage.greengage.dev/webhooks'
const token = import.meta.env.VITE_WEBHOOK_TOKEN

export const notifyCreateMission = (data) => axios.post(baseUrl,
    data,
    {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    })
