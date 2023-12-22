import axios from "axios";

export const setAxiosHeaderConfiguration = (token) => {

    axios.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`

        return config;
    }, function (error) {
        return Promise.reject(error);
    });


    axios.interceptors.response.use(function (response) {

        if (response.status === 401) {
            window.location.reload();
        }

        return response;
    }, function (error) {
        return Promise.reject(error);
    });
}
