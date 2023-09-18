const Tile = require('./tile'); // Adjust the path as needed

function Grid(previousState) {
  this.size = 4;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  console.log(cellState)

  return {
    size: this.size,
    cells: cellState
  };
};

//Simulate move
Grid.prototype.move = function (direction) {
  // Define the vectors for each direction
  const vectors = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  // Get the vector for the specified direction
  const vector = vectors[direction];

  // Initialize variables to track whether the grid has moved or merged
  let moved = false;

  // Traverse the grid cells in the specified direction
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      const cell = this.cells[x][y];

      if (cell) {
        let currentX = x;
        let currentY = y;

        while (true) {
          // Calculate the next cell's coordinates in the specified direction
          const nextX = currentX + vector.x;
          const nextY = currentY + vector.y;

          // Check if the next cell is within the grid bounds
          if (
            nextX >= 0 &&
            nextX < this.size &&
            nextY >= 0 &&
            nextY < this.size
          ) {
            const nextCell = this.cells[nextX][nextY];

            // Check if the next cell is empty (available)
            if (!nextCell) {
              // Move the current cell to the next cell
              this.cells[nextX][nextY] = cell;
              this.cells[currentX][currentY] = null;
              cell.updatePosition({ x: nextX, y: nextY });
              moved = true;
            }
            // Check if the next cell has the same value and can be merged
            else if (
              nextCell.value === cell.value &&
              !nextCell.mergedFrom
            ) {
              // Merge the two cells into one
              const newValue = cell.value * 2;
              const mergedTile = new Tile(
                { x: nextX, y: nextY },
                newValue
              );
              mergedTile.mergedFrom = [cell, nextCell];

              // Update the grid
              this.cells[currentX][currentY] = null;
              this.cells[nextX][nextY] = mergedTile;
              cell.updatePosition({ x: nextX, y: nextY });

              // Set mergedFrom to prevent further merges
              nextCell.mergedFrom = mergedTile;
              moved = true;

              // Update the score here if needed
              // Example: GameManager.score += newValue;

              // Check for win condition here if needed
              // Example: if (newValue === 2048) GameManager.won = true;
            } else {
              // Exit the loop if the next cell is not empty or cannot be merged
              break;
            }
          } else {
            // Exit the loop if the next cell is outside the grid bounds
            break;
          }

          // Move to the next cell in the same direction
          currentX = nextX;
          currentY = nextY;
        }
      }
    }
  }

  return moved;
};

module.exports = Grid;