function createInput(id, label, defaultValue='', placeHolder='') {
  if (!label) {
    label = id.substr(0,1).toUpperCase() + id.substr(1, id.length-1);
  }
  return `<div class="form-group row">
    <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">${label}</label>
    <div class="col-sm-8">
      <input type="number" class="form-control form-control-sm" id="${id}" value="${defaultValue}" placeholder="${placeHolder}">
    </div>
  </div>`;
}

function createDropdown(id, label) {
  if (!label) {
    label = id.substr(0,1).toUpperCase() + id.substr(1, id.length-1);
  }
  return `<div class="form-group row">
    <label for="staticEmail" class="col-sm-4 col-form-label col-form-label-sm">${label}</label>
    <div class="col-sm-8">
      <select class="custom-select my-1 mr-sm-2 form-control form-control-sm" id="${id}">
        <option  value="0">Instant</option>
        <option selected value="10">Very fast</option>
        <option value="50">Fast</option>
        <option  value="250">Normal</option>
        <option value="1000">Slow</option>
        <option value="3000">Very slow</option>
      </select>
    </div>
  </div>`;
}

function createButton(text, onClick) {
  return  $(`<button type="button">${text}</button>`).addClass('btn btn-outline-primary btn-sm btn-block').click(onClick);
}
$(document).ready(function(){
  $("#form1").append(createInput("row", "Row", 30));
  $("#form1").append(createInput("column", "Column", 30));
  $("#form1").append(createDropdown("speed"));
  $("#form1").append(createButton("generate", generate));
})


let boxes = [];
const map = $("#map");
const mapData = {
  col: 10,
  row: 10,
  speed: 0,
  size: 500,
  isGenerating: false,
  hasGenerated: false,
  getBoxSize: function () { return parseInt(mapData.size / Math.max(this.col, this.row));},
}

function createBox(size, row, col) {
  const box = $("<div></div>")
    .addClass("box")
    .css({width: size, height: size, left: size*col, top: size*row})

  box.col = col;
  box.row = row;
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
      newRow < 0 || newRow > mapData.row - 1 ||
      newCol < 0 || newCol > mapData.col - 1 ||
      boxes[getIndex(newCol, newRow)]
    ) {
      return false;
    }

    this.walls[direction] = false;
    this.redrawWalls();
    await traverse(getIndex(newCol, newRow), (direction + 2) % 4);
    return true;
  }
  box.redrawWalls();
  return box;
}

function getIndex(col, row) {
  return row*mapData.col + col;
}
function getPositionByIndex(index) {
  return {
    row: Math.floor(index / mapData.col), 
    col: index % mapData.col,
  };
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate()
{
  if (mapData.isGenerating) {
    return;
  }
  const input = {
    col : parseInt($("#column").val()),
    row : parseInt($("#row").val()),
    speed : parseInt($("#speed").val()),
  } 

  if (isNaN(input.col) || input.col < 1 || input.col * 5 > mapData.size) {
    input.col = parseInt(mapData.size / 30);
  }
  if (isNaN(input.row) || input.corowl < 1 || input.row * 5 > mapData.size) {
    input.row = parseInt(mapData.size / 30);
  }
  
  mapData.isGenerating = true;
  mapData.col = input.col;
  mapData.row = input.row;
  mapData.speed = input.speed;
  $("#pointer").css({width: mapData.getBoxSize()/2, height: mapData.getBoxSize()/2});

  map.css({width: mapData.size, height: mapData.size});
  map.empty();
  boxes = [];
  await traverse(0);
  mapData.isGenerating = false;

}

async function traverse(index, fromDirection) {
  const {row, col} = getPositionByIndex(index);
  $("#pointer").css({top: row*mapData.getBoxSize()+mapData.getBoxSize()*0.25, left: col*mapData.getBoxSize()+mapData.getBoxSize()*0.25});
  const box = createBox(mapData.getBoxSize(), row, col);
  boxes[getIndex(col, row)] = box;

  let directions = [0, 1, 2, 3];
  if (fromDirection !== undefined) {
    box.walls[fromDirection] = false;
    box.redrawWalls();
    directions.splice(fromDirection, 1);
  }

  map.append(box);
  if(mapData.speed > 0) {
    box.toggle({effect: "scale", duration: 0});
    box.toggle({effect: "scale", duration: 200});
    await sleep(mapData.speed);
  }
  while (directions.length > 0) {
    const randIndex = Math.floor(Math.random() * directions.length);
    const direction = directions[randIndex];
    directions.splice(randIndex, 1);
    await box.checkNeighbour(direction);
  }
}