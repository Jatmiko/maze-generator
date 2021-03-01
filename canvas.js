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
        <option selected value="0">Instant</option>
        <option value="10">Very fast</option>
        <option value="50">Fast</option>
        <option value="250">Normal</option>
        <option value="1000">Slow</option>
        <option value="3000">Very slow</option>
      </select>
    </div>
  </div>`;
}

function createButton(text, onClick) {
  return  $(`<a>${text}</a>`).addClass('btn btn-primary btn-lg active btn-sm').click(onClick);
}
$(document).ready(function(){
  $("form").append(createInput("row", "Row", 15));
  $("form").append(createInput("column", "Column", 25));
  $("form").append(createDropdown("speed", "Speed", 400, "animation speed"));
  $("form").append(createButton("generate", generate));
})


let boxes = [];
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const canvasData = {
  col: 10,
  row: 10,
  speed: 0,
  size: 500,
  getBoxSize: function () {
    return parseInt(canvasData.size / Math.max(this.col, this.row));
  },
}


function Box (size, row, col) {
  this.size = size;
  this.row = row;
  this.col = col;

  this.walls = [true, true, true, true]; //top right btm left
  this.draw = function () {
    ctx.fillStyle = "#3498db";
    ctx.fillRect(this.size*this.col, this.size*this.row, this.size, this.size);
    this.drawBorder();
  }
  this.drawBorder = function()
  {
    const topLeft = [this.size*this.col, this.size*this.row];
    const topRight = [this.size*this.col+this.size-1, this.size*this.row];
    const bottomRight = [this.size*this.col+this.size-1, this.size*this.row+this.size-1];
    const bottomLeft = [this.size*this.col, this.size*this.row+this.size-1];

    ctx.fillStyle='#F00';
    ctx.beginPath();
    if (this.walls[0]) {
      ctx.moveTo(topLeft[0], topLeft[1]);
      ctx.lineTo(topRight[0], topRight[1]);
    }
    if (this.walls[1]) {
      ctx.moveTo(topRight[0], topRight[1]);
      ctx.lineTo(bottomRight[0], bottomRight[1]);
    }
    if (this.walls[2]) {
      ctx.moveTo(bottomLeft[0], bottomLeft[1]);
      ctx.lineTo(bottomRight[0], bottomRight[1]);
    }
    if (this.walls[3]) {
      ctx.moveTo(topLeft[0], topLeft[1]);
      ctx.lineTo(bottomLeft[0], bottomLeft[1]);
    }
    ctx.stroke();

  }
  this.checkNeighbour = async function (direction) {
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
      newRow < 0 || newRow > canvasData.row - 1 ||
      newCol < 0 || newCol > canvasData.col - 1 ||
      boxes[getIndex(newCol, newRow)]
    ) {
      return false;
    }

    this.walls[direction] = false;
    this.draw();
    await traverse(getIndex(newCol, newRow), (direction + 2) % 4);
    return true;
  }
}

function getIndex(col, row) {
  return row*canvasData.col + col;
}
function getPositionByIndex(index) {
  return {
    row: Math.floor(index / canvasData.col), 
    col: index % canvasData.col,
  };
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate()
{
  const input = {
    col : parseInt($("#column").val()),
    row : parseInt($("#row").val()),
    speed : parseInt($("#speed").val()),
  } 

  // if (isNaN(input.col) || input.col < 1 || input.col * 3 > canvasData.size) {
  //   input.col = parseInt(canvasData.col / 10);
  // }
  // if (isNaN(input.row) || input.corowl < 1 || input.row * 3 > canvasData.size) {
  //   input.row = parseInt(canvasData.row / 10);
  // }
  
  canvasData.col = input.col;
  canvasData.row = input.row;
  canvasData.speed = input.speed;
  $("#pointer").css({width: canvasData.getBoxSize(), height: canvasData.getBoxSize()});

  ctx.canvas.width = canvasData.size;
  ctx.canvas.height = canvasData.size;
  ctx.clearRect(0, 0, canvasData.size, canvasData.size); //clear canvas
  boxes = [];
  await traverse(0);
}

async function traverse(index, fromDirection) {
  const {row, col} = getPositionByIndex(index);
  $("#pointer").css({top: row*canvasData.getBoxSize(), left: col*canvasData.getBoxSize()});
  const box = new Box(canvasData.getBoxSize(), row, col);
  boxes[getIndex(col, row)] = box;

  if(canvasData.speed > 0) {
    await sleep(canvasData.speed);
  }
  let directions = [0, 1, 2, 3];
  if (fromDirection !== undefined) {
    box.walls[fromDirection] = false;

    directions.splice(fromDirection, 1);
  }
  box.draw();

  while (directions.length > 0) {
    const randIndex = Math.floor(Math.random() * directions.length);
    const direction = directions[randIndex];
    directions.splice(randIndex, 1);
    await box.checkNeighbour(direction);
  }
  box.draw();

}