const express = require('express');
require('dotenv').config();
const cors = require('cors');

const database = require('./database');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ORIGIN : 'http://localhost:4000',
}));

app.use('/api', require('./routes'));

app.all('*', function (req, res) {
    res.status(404).send('Not found!');
});

if (process.env.NODE_ENV !== 'production') {
    database.createDbTables();
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server is listening on port ' + port);
});
