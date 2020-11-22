const axios = require('axios').default;

const baseURL = 'http://localhost:3000/customer_info';

const dbConnector = {

    fetchDatafromDB: () => {
        return axios.get(baseURL)
    },

    addDataToDB: (params) => {
        return axios.post(baseURL, params)
    },

    updateDataInDB: (id, params) => {
        return axios.put(`${baseURL}/${id}`, params)
    },

    deleteDataInDB: (id) => {
        return axios.delete(`${baseURL}/${id}`)
    }
}

module.exports = dbConnector;