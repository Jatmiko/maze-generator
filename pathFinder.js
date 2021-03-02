const pathFinder = {
  createHero: function (size, col, row) {
    $(".hero").remove();
    const hero = $('<div>🦸</div>')
      .addClass('hero')
      .appendTo(maze.map)
      .css({width: size, height: size, left: size*col, top: size*row, lineHeight: size+'px'})
      .click(function() {
        this.remove();
      })
    hero.size = size;
    hero.col = col;
    hero.row = row;

    hero.visited = [];
    hero.foodPath = [];
    hero.queue = [];
    hero.fromIndex = [];

    hero.catchFood = async function() {
      hero.visited = [];
      hero.foodPath = [];
      hero.queue = [];
      hero.fromIndex = [];
      $(".food-check,.food-path").removeClass("food-check").removeClass("food-path");
      await hero.checkFood(hero.col, hero.row);
      if (hero.foodPath.length == 0) {
        $(".food-check,.food-path").removeClass("food-check").removeClass("food-path");
      }
    };
    hero.checkFood = async function(col, row, fromIndex) {
      const index = helper.getIndex(col, row);
      if (hero.visited[index]) {
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
      await helper.sleep(10);
      
      while (hero.queue.length > 0) {
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
    
    return hero;
  },
  createFood: function (size, col, row) {
    const emojis = ['🍇','🍈','🍉 ','🍊 ','🍋 ','🍌 ','🍍 ','🥭 ','🍎  ','🍏  ','🍐 ','🍑 ','🍒 ','🍓 ','🫐','🥝  ','🍅 ','🫒 ','🥥 ','🥑 ','🍆 ','🥔 ','🥕 ','🌽 ','🌶️','🫑','🥒 ','🥬  ','🥦 ','🧄 ','🧅 ','🍄 ','🥜 ','🌰 ','🍞 ','🥐 ','🥖  ','🫓 ','🥨 ','🥯 ','🥞 ','🧇 ','🧀  ','🍖   ','🍗  ','🥩   ','🥓 ','🍔 ','🍟  ','🍕 ','🌭  ','🥪 ','🌮 ','🌯 ','🫔 ','🥙  ','🧆 ','🥚 ','🍳 ','🥘    ','🍲   ','🫕 ','🥣   ','🥗  ','🍿 ','🧈 ','🧂 ','🥫  ','🍱  ','🍘  ','🍙  ','🍚  ','🍛  ','🍜  ','🍝 ','🍠   ','🍢 ','🍣 ','🍤  ','🍥    ','🥮  ','🍡 ','🥟 ','🥠  ','🥡  ','🦪 ','🍦   ','🍧  ','🍨  ','🍩 ','🍪 ','🎂  ','🍰 ','🧁 ','🥧 ','🍫  ','🍬 ','🍭 ','🍮 ','🍯'];
    const food = $(`<div>${emojis[Math.floor(Math.random() * emojis.length)]}</div>`)
      .addClass('food')
      .appendTo(maze.map)
      .css({width: size, height: size, left: size*col, top: size*row, lineHeight: size+'px'})
      .click(function() {
        maze.foods[helper.getIndex(food.col, row)] = undefined;
        this.remove();
      })
    food.size = size;
    food.col = col;
    food.row = row;
    maze.foods[helper.getIndex(col, row)] = food;
    return food;
  },
}