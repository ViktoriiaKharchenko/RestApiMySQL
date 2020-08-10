
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Router = require('./routes/router')

const app = express()
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db/index');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
db.sequelize.sync();


app.use('/api', Router)

app.listen(process.env.apiPort, () => console.log(`Server running on port ${process.env.apiPort}`))
