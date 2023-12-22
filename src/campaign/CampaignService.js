import axios from "axios";

const baseUrl = '/api/campaign'

export const listCampaign = (token) => axios.get(baseUrl,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const insertCampaign = (token, data) => axios.post(baseUrl,
    data,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const updateCampaign = (token, data) => axios.put(baseUrl,
    data,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })