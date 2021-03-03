var isMouseDown = false;
$(document).mousedown(function() {
  isMouseDown = true;
}).mouseup(function() {
  isMouseDown = false;  
});

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
    maze.foods = [];
    maze.hero && await maze.hero.destroy();

    $("#form2").fadeOut(0);
    await maze.traverse(0);
    $("#form2").fadeIn(500);
    $("#pointer").css({width:0, height: 0});

    maze.data.isGenerating = false;
  }

  // $("#form1").parent().prepend(component.createInput("mousePosition", "position").find("input").removeAttr("type"));

  $("#form1").append(component.createInput("row", "Row", 20));
  $("#form1").append(component.createInput("column", "Column", 20));
  $("#form1").append(component.createDropdown("speed", "Generate Speed", [
    {label: 'Instant', value: 0},
    {label: 'Very fast', value: 10, selected: true},
    {label: 'Fast', value: 50},
    {label: 'Normal', value: 250},
    {label: 'Slow', value: 1000},
    {label: 'Very slow', value: 3000},
  ]));
  $("#form1").append(component.createButton("Generate maze", generate));
  $("#speed").change(function(){
    maze.data.speed = parseInt($("#speed").val());
  }).trigger("change");

  $("#form2").append(component.createDropdown("clickAction", "Click Action", [
    {label: 'Place hero', value: "PLACE_HERO"},
    {label: 'Place food', value: "PLACE_FOOD"},
    {label: 'Change wall', value: "CHANGE_WALL"},
  ]));
  
  $("#form2").append(component.createBoxBorderDropDown());

  $("#form2").append(component.createDropdown("pathFinderSpeed", "Path finder speed", [
    {label: 'Instant', value: 0, selected: true},
    {label: 'Very fast', value: 1, selected: true},
    {label: 'Fast', value: 10},
    {label: 'Normal', value: 50},
    {label: 'Slow', value: 250},
    {label: 'Very slow', value: 1000},
  ]));

  $("#form2").append(component.createButton("Remove all walls", () => {
    if (maze.data.isGenerating) {
      return;
    }
    for (let i = 0; i < maze.boxes.length; i++) {
      const box = maze.boxes[i];
      if ( ! box) {
        continue;
      }
      box.walls = [false, false, false, false];
      box.rebuildEdgeWalls();
      maze.boxes[i].redrawWalls();
    }
  }));
  $("#form2").append(component.createButton("Random Place Hero", () => {
    $("#clickAction").val("PLACE_HERO");
    if (maze.boxes.length > 0) {
      maze.boxes[Math.floor(Math.random() * maze.boxes.length)].trigger("mousedown").trigger("mouseup");
    }
  }));
  $("#form2").append(component.createButton("Random Place Food", () => {
    $("#clickAction").val("PLACE_FOOD");
    if (maze.boxes.length > 0) {
      maze.boxes[Math.floor(Math.random() * maze.boxes.length)].trigger("mousedown").trigger("mouseup");
    }
  }));
  $("#form2").append(component.createButton("Find path", () => maze.hero.catchFood()));
  $("#form2").append(component.createButton("Stop", () => maze.hero && maze.hero.stopCatchFood()));
  $("#form2").append(component.createCheckBox("autoFindPath", "Auto find path").change(function(){
    if ($("#autoFindPath").prop("checked")) {
      maze.catchFood();
    }
  }));
  $("#form2").hide();
  
  generate();
})