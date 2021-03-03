const maze = {
  boxes: [],
  foods: [],
  hero: null,
  map: $("#map"),
  catchFood: () => {
    let count = 0;
    for (let i = 0; i < maze.foods.length; i++) {
      if (maze.foods[i]) {
        count++;
      }
    }
    
    if (maze.hero) {
      if (count > 0) {
        maze.hero.catchFood();
      } else {
        maze.hero.resetStat();
      }
    }
  },
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

    box.rebuildEdgeWalls = function() {
      if (box.row == 0) {
        box.walls[0] = true;
      }
      if (box.col == maze.data.col-1) {
        box.walls[1] = true;
      }
      if (box.row == maze.data.row-1) {
        box.walls[2] = true;
      }
      if (box.col == 0) {
        box.walls[3] = true;
      }
    }
    box.redrawWalls = function() {
      const borderText = '1px solid #ecf0f1';
      box.css({
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
    box.handleClick = async function() {
      const value = $("#clickAction").val();
      if (value === 'PLACE_HERO') {
        maze.hero && await maze.hero.destroy();
        maze.hero = pathFinder.createHero(box.size, box.col, box.row);
      }
      if (value === 'PLACE_FOOD') {
        pathFinder.createFood(box.size, box.col, box.row);
      }
      if (value === 'CHANGE_WALL') {
        const walls = $("#wallType").data("walls");
        if ( ! walls || maze.data.isGenerating) {
          return;
        }
        box.walls = [...walls];
        box.rebuildEdgeWalls();

        if (box.row > 0) {
          const neighbourBox = maze.boxes[helper.getIndex(box.col, box.row - 1)];
          neighbourBox.walls[2] = box.walls[0];
          neighbourBox.redrawWalls();
        }
        if (box.col < maze.data.col - 1) {
          const neighbourBox = maze.boxes[helper.getIndex(box.col + 1, box.row)];
          neighbourBox.walls[3] = box.walls[1];
          neighbourBox.redrawWalls();
        }
        if (box.row < maze.data.row - 1) {
          const neighbourBox = maze.boxes[helper.getIndex(box.col, box.row + 1)];
          neighbourBox.walls[0] = box.walls[2];
          neighbourBox.redrawWalls();
        }
        if (box.col > 0) {
          const neighbourBox = maze.boxes[helper.getIndex(box.col - 1, box.row)];
          neighbourBox.walls[1] = box.walls[3];
          neighbourBox.redrawWalls();
        }
        box.redrawWalls();
      }
    }
    box.mousedown(box.handleClick);
    box.mouseenter(function() {
      if(isMouseDown) {
        box.handleClick();
      }
    })
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