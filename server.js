// launch server
const express = require('express');
const cors = require('cors');
const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});