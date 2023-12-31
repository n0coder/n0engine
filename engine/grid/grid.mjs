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
          this.grid[i][j] = null;
        }
      }
    }
    shift(item,x,y) {
      this.grid[item.y][item.x] = this.grid[y][x]
      item.x = x;
      item.y = y;
      this.grid[y][x] = item;
    }
    get boundingBox() {
      const width = this.cols * this.tileSize;
      const height = this.rows * this.tileSize;
      const x = this.x;
      const y = this.y;
      return { x: x, y: y, w: width, h: height };
    }
  
    get gridCenter() {
      const centerX = this.x + (this.rows * this.tileSize) / 2;
      const centerY = this.y + (this.cols * this.tileSize) / 2;
      return { x: centerX, y: centerY };
    }
  
    // Additional methods for searching and updating the grid
  }
  