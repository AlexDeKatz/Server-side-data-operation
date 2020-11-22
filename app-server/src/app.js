const express = require('express');
const cors = require('cors');
const customerInfoController = require('./controller/customer-info')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', customerInfoController);
app.use('*', (req, res) => {
    res.send('Invalid route')
})

app.listen(5000, () => {
    console.log('Server started at 5000')
})