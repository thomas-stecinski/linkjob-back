// launch server
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/router'); 

app.use(express.json());
app.use(cors());

app.use('/api', router);

dotenv.config();
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log('Connection has been etablished successfully');
    })
    .catch((error) => {
        console.error('Unable to connect database: ', error);
    });


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});