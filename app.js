$(document).ready(function(){

  async function generate()
  {
    if (maze.data.isGenerating) {
      return;
    }

    const input = {
      col : parseInt($("#column").val()),
      row : parseInt($("#row").val()),
    } 

    if (isNaN(input.col) || input.col < 1 || input.col * 5 > maze.data.size) {
      input.col = parseInt(maze.data.size / 30);
    }
    if (isNaN(input.row) || input.corowl < 1 || input.row * 5 > maze.data.size) {
      input.row = parseInt(maze.data.size / 30);
    }
    
    maze.data.size = Math.min(window.innerHeight, window.innerWidth) - 10;
    maze.data.isGenerating = true;
    maze.data.col = input.col;
    maze.data.row = input.row;
    $("#pointer").css({width: maze.data.getBoxSize()/2, height: maze.data.getBoxSize()/2});

    maze.map.css({width: maze.data.size, height: maze.data.size});
    maze.map.empty();
    maze.boxes = [];
    await maze.traverse(0);
    maze.data.isGenerating = false;
  }

  $("#form1").append(component.createInput("row", "Row", 30));
  $("#form1").append(component.createInput("column", "Column", 30));
  $("#form1").append(component.createDropdown("speed", "Speed", [
    {label: 'Instant', value: 0},
    {label: 'Very fast', value: 10, selected: true},
    {label: 'Fast', value: 500},
    {label: 'Normal', value: 250},
    {label: 'Slow', value: 1000},
    {label: 'Very slow', value: 3000},
  ]));
  $("#form1").append(component.createButton("generate", generate));

  $("#speed").change(function(){
    maze.data.speed = parseInt($("#speed").val());
  }).trigger("change");
})