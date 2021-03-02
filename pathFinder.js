const pathFinder = {
  createHero: function (size, col, row) {
    $(".hero").remove();
    const hero = $('<div>🦸</div>')
      .addClass('hero')
      .appendTo(maze.map)
      .css({width: size, height: size, left: size*col, top: size*row, lineHeight: size+'px'})
      .click(function() {
        hero.destroy();
      })
    hero.size = size;
    hero.col = col;
    hero.row = row;

    hero.visited = [];
    hero.foodPath = [];
    hero.queue = [];
    hero.fromIndex = [];
    hero.isFindingPath = false;
    hero.requestCancel = false;
    hero.destroy = async function() {
      maze.hero = null;
      if (hero.isFindingPath) {
        hero.requestCancel = true;
        while (hero.isFindingPath) {
          await helper.sleep(10);
        }
        hero.requestCancel = false;
      }
      hero.resetStat();
      this.remove();
    }
    hero.resetStat = function() {
      $(".food-check,.food-path").removeClass("food-check").removeClass("food-path");
      hero.visited = [];
      hero.foodPath = [];
      hero.queue = [];
      hero.fromIndex = [];
    }
    hero.catchFood = async function() {
      if(hero.requestCancel) {
        return;
      }

      if (hero.isFindingPath) {
        hero.requestCancel = true;
        while (hero.isFindingPath) {
          await helper.sleep(10);
        }
        hero.requestCancel = false;
      }

      hero.isFindingPath = true;
      hero.resetStat();
      
      await hero.checkFood(hero.col, hero.row, undefined, ++hero.travelId);
      await hero.move();
      hero.isFindingPath = false;
    };
    hero.checkFood = async function(col, row, fromIndex) {
      const index = helper.getIndex(col, row);
      if (hero.visited[index] || hero.requestCancel) {
        return false;
      }

      hero.visited[index] = true;
      hero.fromIndex[index] = fromIndex;

      if (maze.foods[index]) {
        hero.queue = [];
        hero.foodPath.push(index);
        hero.getPath(index);
        for (let i = 0; i < hero.foodPath.length; i++) {
          const pathBox = maze.boxes[hero.foodPath[i]];
          pathBox.removeClass("food-check");
          pathBox.addClass("food-path");
        }

        return true;
      }
      
      const box = maze.boxes[index];
      box.addClass("food-check");

      if ( ! box.walls[0]) {
        hero.queue.push([box.col, box.row - 1, index]);
      }
      if ( ! box.walls[1]) {
        hero.queue.push([box.col + 1, box.row, index]);
      }
      if ( ! box.walls[2]) {
        hero.queue.push([box.col, box.row + 1, index]);
      }
      if ( ! box.walls[3]) {
        hero.queue.push([box.col - 1, box.row, index]);
      }

      const pathFinderSpeed = parseInt($("#pathFinderSpeed").val());
      if(pathFinderSpeed > 0) {
        await helper.sleep(10);
      }
      
      while (hero.queue.length > 0 && ! hero.requestCancel) {
        const curr = hero.queue.shift();
        await hero.checkFood(curr[0], curr[1], curr[2]);
      }

    };
    hero.getPath = function (index) {
      if (hero.fromIndex[index]) {
        hero.foodPath.push(hero.fromIndex[index]);
        hero.getPath(hero.fromIndex[index]);
      }
    };
    hero.move = async function () {
      while (hero.foodPath.length > 0 && ! hero.requestCancel) {
        const index = hero.foodPath.pop();
        const pos = helper.getPositionByIndex(index);
        if (maze.foods[index]) {
          maze.foods[index].destroy();
        }
        hero.col = pos.col;
        hero.row = pos.row;
        hero.css({left: hero.size*pos.col, top: hero.size*pos.row});
        await helper.sleep(100);
      }
      maze.catchFood();
    };


    maze.hero = hero;
    maze.catchFood();
    return hero;
  },
  createFood: function (size, col, row) {
    const emojis = [
      '🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏',
      '🍐','🍑','🍒','🍓','🥝','🍅','🥥','🥑','🍆','🥔',
      '🥕','🌽','🌶️','🥒','🥬','🥦','🧄','🧅','🍄','🥜',
      '🌰','🍞','🥐','🥖','🥨','🥯','🥞','🧇','🧀','🍖',
      '🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯',
      '🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧈',
      '🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠',
      '🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦪',
      '🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫',
      '🍬','🍭','🍮','🍯',
    ];
    const food = $(`<div>${emojis[Math.floor(Math.random() * emojis.length)]}</div>`)
      .addClass('food')
      .appendTo(maze.map)
      .css({width: size, height: size, left: size*col, top: size*row, lineHeight: size+'px'})
      .click(function() {
        food.destroy();

      })

    food.destroy = function () {
      delete maze.foods[helper.getIndex(food.col, row)];
      maze.catchFood();
      food.remove();
    };
    food.size = size;
    food.col = col;
    food.row = row;
    maze.foods[helper.getIndex(col, row)] = food;
    maze.catchFood();
    
    return food;
  },
}