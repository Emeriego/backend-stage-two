const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const organisationRouter = require('./routes/orgRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/api', organisationRouter);

module.exports = app;
