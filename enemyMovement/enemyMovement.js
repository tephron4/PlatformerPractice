var tileSize;
var map;
var player;
var enemies = [];

function setup() {
  createCanvas(1280,640);
  background('#000000');
  tileSize = 32;
  noSmooth();
  map = {
    height:10,
    width:20,
    tileMap:[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,5,5,5,5,5,5,5,5,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,3,
             2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
             4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
  };
  player = {
    playerColor:'#FFFF00',
    height:32,
    width:32,
    jumping:true,
    x:144,
    y:0,
    x_velocity:0,
    y_velocity:0,
    lastx:144,
    lasty:0
  };
  initializeEnemies();
}


function draw() {
  scale(2);
  drawMap();
  drawEnemies();
  moveEnemies();
  stroke(player.playerColor);
  fill(player.playerColor);
  rect(player.x,player.y,player.width,player.height);
  playerMovement();
}

function drawMap(){
  for(i=0;i<map.width*map.height;i++){
    let x = i % map.width;
    let y = Math.floor(i / map.width);
    if(map.tileMap[i] === 0){
      stroke('#000000');
      fill('#000000');
      rect(x*tileSize,y*tileSize,tileSize,tileSize);
    }
    else if(map.tileMap[i] === 1 || map.tileMap[i] === 4){
      stroke('#FF0000');
      fill('#FF0000');
      rect(x*tileSize,y*tileSize,tileSize,tileSize);
    }
    else if(map.tileMap[i] === 2 || map.tileMap[i] === 3){
      stroke('#FFFFFF');
      fill('#FFFFFF');
      rect(x*tileSize,y*tileSize,tileSize,tileSize);
    }
    else if(map.tileMap[i] === 5){
      stroke('#FF00FF');
      fill('#FF00FF');
      rect(x*tileSize,y*tileSize,tileSize,tileSize);
    }
  }
}

function playerMovement(){
  if(keyIsDown(LEFT_ARROW)){
    player.x_velocity -= 0.75;
  }
  if(keyIsDown(UP_ARROW) && !player.jumping && player.y_velocity === 0){
    player.y_velocity -= 20;
    player.jumping = true;
  }
  if(keyIsDown(RIGHT_ARROW)){
    player.x_velocity += 0.75;
  }
  
  player.y_velocity += 1.25;
  
  player.lastx = player.x;
  player.lasty = player.y;
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  
  player.x_velocity *= 0.8;
  player.y_velocity *= 0.9;
  
  if(player.x > width){
    player.x = 0; 
  }
  if(player.x < 0){
    player.x = width; 
  }
  
  playerCollisions();
  //console.log('out of collisions');
}
  
function initializeEnemies(){
  enemies = [
    e1={
      height:32,
      width:32,
      x:224,
      y:96,
      x_velocity:0.75,
      y_velocity:1,
      lastx:34,
      lasty:240,
      lowerBound:192,
      upperBound:416
    },
    e2={
      height:32,
      width:32,
      x:460,
      y:240,
      x_velocity:0.75,
      y_velocity:1,
      lastx:460,
      lasty:240,
      lowerBound:450,
      upperBound:576
    }
  ];
}
  
function drawEnemies(){
  stroke('#00FF00');
  fill('#00FF00');
  for(i=0;i<enemies.length;i++){
    rect(enemies[i].x,enemies[i].y,enemies[i].width,enemies[i].height);
  }
}
  
function moveEnemies(){
  for(i=0;i<enemies.length;i++){
      enemies[i].lastx = enemies[i].x;
      enemies[i].lasty = enemies[i].y;
      enemies[i].x += enemies[i].x_velocity;
      enemies[i].y += enemies[i].y_velocity;
      enemyCollisions(enemies[i]);
      keepInPlace(enemies[i]);
  }
}
  
function keepInPlace(enemy){
  if(enemy.x < enemy.lowerBound){
    enemy.x = enemy.lowerBound;
    enemy.x_velocity *= -1;
  }
  else if(enemy.x > enemy.upperBound){
    enemy.x = enemy.upperBound;
    enemy.x_velocity *= -1;
  }
}

function enemyCollisions(enemy){
  let left_x = floor(enemy.x/tileSize);
  let top_y = floor(enemy.y/tileSize);
  let right_x = left_x + 1;
  let bottom_y = top_y + 1;
  
  let topLeft = map.tileMap[top_y * map.width + left_x];
  let topRight = map.tileMap[top_y * map.width + right_x];
  let bottomLeft = map.tileMap[bottom_y * map.width + left_x];
  let bottomRight = map.tileMap[bottom_y * map.width + right_x];
  
  if(topLeft != 0){
    switch(topLeft){
      case 2:
        if(rightCollision(enemy,left_x)){
          enemy.x_velocity = 0.75;
        }
        break;
      default:
        break;
    }
  }
  if(topRight != 0){
    switch (topRight){
      case 3:
        if(leftCollision(enemy,right_x)){
          enemy.x_velocity = -0.75; 
        }
        break;
      default:
        break;
    }
  }
  if(bottomLeft != 0){
    switch (bottomLeft){
      case 2:
        if(rightCollision(enemy,left_x)){
          enemy.x_velocity = 0.75; 
        }
        break;
      case 4:
      case 5:
        topCollision(enemy,bottom_y);
        break;
      default:
        break;
    }
  }
  if(bottomRight != 0){
    switch (bottomRight){
      case 3:
        if(leftCollision(enemy,right_x)){
          enemy.x_velocity = -0.75; 
        }
        break;
      case 4:
      case 5:
        topCollision(enemy,bottom_y);
        break;
      default:
        break;
    }
  }
}

function playerCollisions(){
  //console.log('in collisions');
  //print('x = ' + player.x);
  //print('y = ' + player.y);
  let left_x = floor(player.x / tileSize);
  //print('left_x = ' + left_x);
  let top_y = floor(player.y / tileSize);
  //print('top_y = ' + top_y);
  
  let right_x = left_x + 1;
  //print('right_x = ' + right_x);
  let bottom_y = top_y + 1;
  //print('bottom_y = ' + bottom_y);
  
  //print(top_y * xTiles);
  //print(top_y * xTiles + left_x);
  let topLeft = map.tileMap[top_y * map.width + left_x];
  //print('topLeft = ' + topLeft);
  let topRight = map.tileMap[top_y * map.width + right_x];
  //print('topRight = ' + topRight);
  let bottomLeft = map.tileMap[bottom_y * map.width + left_x];
  //print('bottomLeft = ' + bottomLeft);
  let bottomRight = map.tileMap[bottom_y * map.width + right_x];
  //print('bottomRIght = ' + bottomRight);
  
  if(topLeft != 0){
    switch (topLeft){
      case 2:
        rightCollision(player,left_x);
        break;
      default:
        break;
    }
  }
  if(topRight != 0){
    switch (topRight){
      case 3:
        leftCollision(player,right_x);
        break;
      default:
        break;
    }
  }
  if(bottomLeft != 0){
    switch (bottomLeft){
      case 2:
        rightCollision(player,left_x);
        break;
      case 4:
      case 5:
        topCollision(player,bottom_y);
        break;
      default:
        break;
    }
  }
  if(bottomRight != 0){
    switch (bottomRight){
      case 3:
        leftCollision(player,right_x);
        break;
      case 4:
      case 5:
        topCollision(player,bottom_y);
        break;
      default:
        break;
    }
  }
}
  
function leftCollision(object,column){
  if(object.x_velocity > 0){
    var left = column * tileSize;
    print(left);
    
    if(object.x + 32 > left && object.lastx + 32 <= left){
      
      object.x_velocity = 0;
      object.x = left - tileSize - 0.001;
      object.x = left - tileSize - 0.001;
      
      return true;
    }
  }
  return false;
}

function rightCollision(object,column){
  if(object.x_velocity < 0){
    
    var right = (column + 1) * tileSize;
    //print('right = ' + right);
    //print('x = ' + player.x);
    //print('lastx = ' + player.lastx);
    
    if(object.x < right && object.lastx >= right){
      
      object.x_velocity = 0;
      object.x = right + 0.001;
      object.lastx = right + 0.001;
      //print('right collision');
      
      return true;
    }
  }
  return false;
}

function topCollision(object,row){
  if(object.y_velocity >= 0){
    
    //print('row = ' + row);
    var top = row * tileSize;
    //print('top = ' + top);
    
    if(object.y + tileSize > top && object.lasty + tileSize <= top){
      
      object.jumping = false;
      object.y_velocity = 0;
      //print('y_velocity = ' + player.y_velocity);
      object.y = top - tileSize - 0.001;
      //print('y = ' + player.y);
      object.lasty = top - tileSize - 0.001;
      //print('lasty = ' + player.lasty);
      
      //console.log('top collision');
      return true;
    }
  }
  return false;
}
