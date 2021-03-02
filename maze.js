const maze = {
  boxes: [],
  foods: [],
  hero: null,
  map: $("#map"),
  data: {
    col: 10,
    row: 10,
    speed: 0,
    size: 200,
    isGenerating: false,
    hasGenerated: false,
    getBoxSize: function () { return parseInt(maze.data.size / Math.max(this.col, this.row));},
  },
  createBox: function (size, row, col) {
    const box = $("<div></div>")
      .addClass("box")
      .css({width: size, height: size, left: size*col, top: size*row})

    box.mouseenter(function() {
      $("#mousePosition").val(box.row+","+ box.col);
    })
    box.col = col;
    box.row = row;
    box.size = size;
    box.walls = [true, true, true, true]; //top right btm left
    box.redrawWalls = function() {
      const borderText = '1px solid #ecf0f1';
      this.css({
        borderTop:    box.walls[0] ? borderText : "",
        borderRight:  box.walls[1] ? borderText : "",
        borderBottom: box.walls[2] ? borderText : "",
        borderLeft:   box.walls[3] ? borderText : "",
      })
    }
    box.checkNeighbour = async function (direction) {
      if (direction < 0 || direction > 3) {
        return false;
      }
      let newCol = this.col;
      let newRow = this.row;
      if (direction === 0) newRow -= 1;
      if (direction === 1) newCol += 1;
      if (direction === 2) newRow += 1;
      if (direction === 3) newCol -= 1;

      if (
        newRow < 0 || newRow > maze.data.row - 1 ||
        newCol < 0 || newCol > maze.data.col - 1 ||
        maze.boxes[helper.getIndex(newCol, newRow)]
      ) {
        return false;
      }

      this.walls[direction] = false;
      this.redrawWalls();
      await maze.traverse(helper.getIndex(newCol, newRow), (direction + 2) % 4);
      return true;
    }
    box.redrawWalls();
    box.handleClick = function() {
      const value = $("#clickAction").val();
      if (value === 'PLACE_HERO') {
        maze.hero = pathFinder.createHero(box.size, box.col, box.row);
      }
      if (value === 'PLACE_FOOD') {
        pathFinder.createFood(box.size, box.col, box.row);
      }
    }
    box.click(box.handleClick);
    box.appendTo(maze.map)

    return box;
  },
  traverse: async function (index, fromDirection) {
    const {row, col} = helper.getPositionByIndex(index);
    $("#pointer").css({top: row*maze.data.getBoxSize()+maze.data.getBoxSize()*0.25, left: col*maze.data.getBoxSize()+maze.data.getBoxSize()*0.25});
    const box = maze.createBox(maze.data.getBoxSize(), row, col);
    maze.boxes[helper.getIndex(col, row)] = box;

    let directions = [0, 1, 2, 3];
    if (fromDirection !== undefined) {
      box.walls[fromDirection] = false;
      box.redrawWalls();
      directions.splice(fromDirection, 1);
    }

    if(maze.data.speed > 0) {
      box.toggle({effect: "scale", duration: 0});
      box.toggle({effect: "scale", duration: 200});
      await helper.sleep(maze.data.speed);
    }
    while (directions.length > 0) {
      const randIndex = Math.floor(Math.random() * directions.length);
      const direction = directions[randIndex];
      directions.splice(randIndex, 1);
      await box.checkNeighbour(direction);
    }
  }
}