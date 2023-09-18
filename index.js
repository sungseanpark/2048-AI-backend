require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

const Calculator = require('./models/calculator')

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })


  app.post('/api/move', (request, response) => {
    try {
      // Parse the grid state from the request body
      const gridState = request.body.grid.cells;

      // console.log(gridState)
  
      // Calculate the next move using your calculator
      const bestMove = Calculator.calculateNextMove(gridState);

      // console.log(bestMove)
  
      // Send the calculated move as a response
      response.json({ move: bestMove });
    } catch (error) {
      // Handle any errors that may occur during the calculation
      console.error(error);
      response.status(500).json({ error: 'An error occurred during move calculation' });
    }
  });


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})