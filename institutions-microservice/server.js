const express = require('express');
const bodyParser = require('body-parser');
const institutionRouter = require('./route/institutions');
const { PORT } = require('./constant');
const inMemDB = require('./db/db')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use('/institutions', institutionRouter)

inMemDB.connect()

app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
})