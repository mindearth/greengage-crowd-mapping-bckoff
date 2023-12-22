import axios from "axios";

const baseUrl = '/api/campaign'

export const listCampaign = () => axios.get(baseUrl)