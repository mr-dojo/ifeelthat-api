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

app.use(function errorHandler(error, req, res, next) {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: "Server error"}}
  } else {
    console.log(error)
    response = { error: { message: error.message, error}}
  }
  res.status(500).json(response);
})

module.exports = app;