import axios from "axios";

const baseUrl = '/api/campaign'

export const listCampaign = (token) => axios.get(baseUrl,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })