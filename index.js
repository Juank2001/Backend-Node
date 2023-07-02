const app = require('./src/server/server')

let port = process.env.PORT || 4000
app.listen(port, () => {
    console.log('Server is running on port: ', port)
})