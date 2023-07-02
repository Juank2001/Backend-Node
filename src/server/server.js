const express = require('express')
const app = express();
const http = require('http')
const routes = require('../routes/routes')
const bodyparser = require('body-parser')
const cors = require('cors');
const rateLimit = require('express-rate-limit')
const passport = require('passport');


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	standardHeaders: true, 
	legacyHeaders: false,
})

require('../middleware/passport')

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(limiter)
app.use(passport.initialize());

routes(app)


let server = http.createServer(app)
module.exports = server

