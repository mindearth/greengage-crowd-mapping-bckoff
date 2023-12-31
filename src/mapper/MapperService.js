import axios from "axios";

const baseUrl = '/api/mapper'

export const listMapper = (token) => axios.get(baseUrl,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

export const getMapper = (token, mapperId) => axios.get(`${baseUrl}/${mapperId}`,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })


export const updateMapper = (token, data) => axios.put(`${baseUrl}/${data.id}`,
    data,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
