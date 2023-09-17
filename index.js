require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })


app.post('/api/move', (request, response) => {
    console.log(request.body)
    let randomMove = Math.floor(Math.random() * 4)
    console.log(randomMove)
    response.json({move: randomMove})
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})