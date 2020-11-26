const express = require('express');
const dbConnector = require('../utility/db-connect');
const support = require('../utility/support');
const { v4: uuidv4 } = require('uuid');

const customerInfoController = express.Router();

customerInfoController.get('/customer-info', async (req, res, next) => {
    const { pageNumber, pageSize, filter, sortOrder, sortKey } = req.query;
    // let initialPos = 0;
    let customerInfo = [];
    let requiredData = []
    try {
        const response = await dbConnector.fetchDatafromDB();
        if (filter) {
            customerInfo = support.filterData(response.data, filter)
        } else {
            customerInfo = [...response.data]
        }
        // initialPos = parseInt(pageNumber, 10) * parseInt(pageSize, 10);
        if (customerInfo.length) {
            const pageData = support.pageData(customerInfo, pageNumber, pageSize);
            requiredData = support.sortData(pageData, sortKey, sortOrder);
        }
        res.status(200).json({ result: requiredData, totalItems: customerInfo.length });
    } catch (err) {
        res.status(500).json({ error: 'Some error in DB' });
    }
})

customerInfoController.post('/customer-info', async (req, res, next) => {
    const payload = { ...req.body, record_no: uuidv4() }
    try {
        await dbConnector.addDataToDB(payload);
        res.status(201).send({ message: 'Customer added successfully' })
    } catch (err) {
        res.status(500).json({ error: 'Some error in DB' });
    }
})

module.exports = customerInfoController;