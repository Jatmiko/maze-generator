const helper = {
  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  getIndex: function(col, row) {
    return row*maze.data.col + col;
  },
  getPositionByIndex: function(index) {
    return {
      row: Math.floor(index / maze.data.col), 
      col: index % maze.data.col,
    };
  },
}