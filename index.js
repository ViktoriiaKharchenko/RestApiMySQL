
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Router = require('./routes/router')

const app = express()
const {apiPort} = require('./config/app')
const db = require('./db/index');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
db.sequelize.sync();


app.use('/api', Router)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
