// Import necessary modules
const Tile = require('./tile'); // Adjust the path as needed
const Grid = require('./grid'); // Adjust the path as needed

// Define the calculator functions
function calculateNextMove(grid) {
  // Try each available move and calculate the corresponding heuristic score
//   const moveScores = {
//     up: calculateScoreAfterMove(grid, 'up'),
//     right: calculateScoreAfterMove(grid, 'right'),
//     down: calculateScoreAfterMove(grid, 'down'),
//     left: calculateScoreAfterMove(grid, 'left'),
//   };

  const moveScores = [calculateScoreAfterMove(grid,0), calculateScoreAfterMove(grid,1),calculateScoreAfterMove(grid,2),calculateScoreAfterMove(grid,3)]

  // Find the best move with the highest score
  const bestMove = findBestMove(moveScores);

  return bestMove;
}

function calculateScoreAfterMove(originalGrid, moveDirection) {
  // Clone the original grid to avoid modifying it
  const grid = new Grid(originalGrid);

  console.log(moveDirection)

  // Simulate the move
  if (grid.move(moveDirection)) {
    // Calculate the heuristic score based on your scoring scheme
    const score = calculateHeuristicScore(grid);
    return score;
  }

  // Return a low score if the move is invalid
  return -1;
}

function calculateHeuristicScore(grid) {
    let valueScore = 0;
    let smoothScore = 0;
    let emptyScore = 0;
    let finalScore = 0;
  
    // Use grid.cells to access the actual grid data
    const cells = grid.cells;
  
    for (let x = 0; x < grid.size; x++) {
      for (let y = 0; y < grid.size; y++) {
        const tile = cells[x][y];
  
        if (tile) {
          // Access tile properties like tile.value
          valueScore += tile.value * Math.pow(2, (x + 1) * (y + 1));
  
          if (x > 0 && cells[x - 1][y] && cells[x - 1][y].value === tile.value) {
            smoothScore += tile.value;
          }
  
          if (y > 0 && cells[x][y - 1] && cells[x][y - 1].value === tile.value) {
            smoothScore += tile.value;
          }
        } else {
          emptyScore += 2;
        }
      }
    }
  
    finalScore = valueScore / Math.pow(2, 7) + 2 * (smoothScore + emptyScore);
  
    return finalScore;
  }

function findBestMove(moveScores) {
  // Find and return the move with the highest score
  let bestMove = null;
  let highestScore = -1;

  for (const move in moveScores) {
    if (moveScores[move] > highestScore) {
      bestMove = move;
      highestScore = moveScores[move];
    }
  }

  console.log('bestMove:' + bestMove + ", highestScore: " + highestScore)

  return bestMove;
}

// Export the calculateNextMove function
module.exports = {
  calculateNextMove,
};