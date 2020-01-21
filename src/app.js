require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

const morganSetting = (process.env.NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send(200, "Hello, boilerplate!");
})

module.exports = app;