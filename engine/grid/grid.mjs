//why make a different grid from world grid?
//world grid isn't good for tetris or tic tac toe type games
export class Grid {
    constructor(tileSize, rows, cols, x,y) {
      this.tileSize = tileSize;
      this.rows = rows;
      this.cols = cols;
      this.x = x;
      this.y = y;
      this.grid = null;
    }
  
    init() {
      this.grid = new Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        this.grid[i] = new Array(this.cols);
        for (let j = 0; j < this.cols; j++) {
          this.grid[i][j] = i * this.cols + j;
        }
      }
    }

    get boundingBox() {
      const width = this.columns * this.tileSize;
      const height = this.rows * this.tileSize;
      const x = this.x;
      const y = this.y;
      return { x, y, width, height };
    }
  
    get gridCenter() {
      const centerX = this.x + (this.rows * this.tileSize) / 2;
      const centerY = this.y + (this.columns * this.tileSize) / 2;
      return { x: centerX, y: centerY };
    }
  
    // Additional methods for searching and updating the grid
  }
  