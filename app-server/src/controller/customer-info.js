const express = require('express');
const dbConnector = require('../utility/db-connect')
const support = require('../utility/support')

const customerInfoController = express.Router();

customerInfoController.get('/customer-info', async (req, res, next) => {
    const { pageNumber, pageSize, filter, sortOrder, sortKey } = req.query;
    console.log("Req: ", req.query)
    let initialPos = 0;
    let customerInfo = [];
    let requiredData = []
    try {
        const response = await dbConnector.fetchDatafromDB();
        if (filter) {
            customerInfo = support.filterData(response.data, filter)
        } else {
            customerInfo = [...response.data]
        }
        initialPos = parseInt(pageNumber, 10) * parseInt(pageSize, 10);
        if (customerInfo.length) {
            // requiredData = customerInfo.slice(initialPos, initialPos + parseInt(pageSize, 10)).sort((obj1, obj2) => {
            //     let compareResult = 0;
            //     if (obj1[sortKey] < obj2[sortKey]) {
            //         compareResult = -1
            //     } else if (obj1[sortKey] > obj2[sortKey]) {
            //         compareResult = 1
            //     }
            //     return compareResult * ((sortOrder === "asc") ? 1 : -1)
            // });
            const pageData = support.pageData(customerInfo, pageNumber, pageSize);
            requiredData = support.sortData(pageData, sortKey, sortOrder);
        }
        res.status(200).json({ result: requiredData, totalItems: customerInfo.length });
    } catch (err) {
        res.status(500).json({ error: 'Some error in DB' });
    }
})

module.exports = customerInfoController;