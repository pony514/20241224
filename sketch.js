let player1 = {
  idle: {
    img: null,
    width: 55,
    height: 52,
    frames: 7
  },
  walk: {
    img: null,
    width: 45,
    height: 61,
    frames: 11
  },
  jump: {
    img: null,
    width: 63,
    height: 56,
    frames: 7
  },
  x: 200,
  y: 200,
  currentFrame: 0,
  currentAction: 'idle',
  health: 100
};

let player2 = {
  idle: {
    img: null,
    width: 47,
    height: 59,
    frames: 3
  },
  walk: {
    img: null,
    width: 113,
    height: 43,
    frames: 5
  },
  jump: {
    img: null,
    width: 101,
    height: 70,
    frames: 7
  },
  x: 500,
  y: 200,
  currentFrame: 0,
  currentAction: 'idle',
  health: 100
};

let backgroundImg;
let bullets1 = [];  // player1 的子彈
let bullets2 = [];  // player2 的子彈

function preload() {
  // 載入背景圖片
  backgroundImg = loadImage('background.png');
  
  // 載入各個動作的圖片 - player1
  player1.idle.img = loadImage('player1/idle.png');
  player1.walk.img = loadImage('player1/walk.png');
  player1.jump.img = loadImage('player1/jump.png');
  
  // 載入各個動作的圖片 - player2
  player2.idle.img = loadImage('player2/idle.png');
  player2.walk.img = loadImage('player2/walk.png');
  player2.jump.img = loadImage('player2/jump.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12);
  
  // 調整角色初始位置
  player1.x = width/2 - 200;  // 畫面中間偏左
  player1.y = height/5*4 - 100;
  
  player2.x = width/2 + 50;   // 畫面中間偏右
  player2.y = height/5*4 - 100;
}

function draw() {
  image(backgroundImg, 0, 0, width, height);  // 將背景縮放至畫布大小
  
  // 設定文字樣式
  textSize(100);
  textAlign(CENTER, CENTER);
  fill(255);  // 白色文字
  stroke(0);  // 黑色邊框
  strokeWeight(4);  // 邊框粗細
  text("淡江教科系", width/2, height/4);  // 在畫面中間上方顯示文字
  
  // 設定說明文字樣式
  textSize(20);  // 較小的文字大小
  textAlign(RIGHT, TOP);  // 靠右上對齊
  text("狐狸箭頭左右鍵左右移動，向下鍵發射攻擊，向上鍵回血；青蛙按A鍵向左移動，D鍵向右移動，W鍵回血，S鍵發射攻擊", width - 20, 20);  // 在右上角顯示說明文字
  
  // 繪製 player1 的血量條
  drawHealthBar(player1.x, player1.y - 20, player1.health);
  
  // 繪製 player2 的血量條
  drawHealthBar(player2.x, player2.y - 20, player2.health);
  
  // 檢查 player1 的移動狀態
  if (player1.currentAction === 'jump') {
    player1.x += 5;
  } else if (player1.currentAction === 'walk' && keyIsDown(LEFT_ARROW)) {
    player1.x -= 5;
  }
  
  // 檢查 player2 的移動狀態
  if (player2.currentAction === 'walk') {
    if (keyIsDown(65)) { // 'a' 鍵的 keyCode
      player2.x -= 5;
    } else if (keyIsDown(68)) { // 'd' 鍵的 keyCode
      player2.x += 5;
    }
  }
  
  // 繪製 player1
  let currentAnim1 = player1[player1.currentAction];
  let sx1 = player1.currentFrame * currentAnim1.width;
  image(currentAnim1.img, 
        player1.x, player1.y, 
        currentAnim1.width * 1.5, currentAnim1.height * 1.5,  // 放大1.5倍
        sx1, 0, 
        currentAnim1.width, currentAnim1.height);
  player1.currentFrame = (player1.currentFrame + 1) % currentAnim1.frames;
  
  // 繪製 player2
  let currentAnim2 = player2[player2.currentAction];
  let sx2 = player2.currentFrame * currentAnim2.width;
  image(currentAnim2.img, 
        player2.x, player2.y, 
        currentAnim2.width * 1.5, currentAnim2.height * 1.5,  // 放大1.5倍
        sx2, 0, 
        currentAnim2.width, currentAnim2.height);
  player2.currentFrame = (player2.currentFrame + 1) % currentAnim2.frames;
  
  // 更新和繪製 player1 的子彈
  for (let i = bullets1.length - 1; i >= 0; i--) {
    let bullet = bullets1[i];
    bullet.x += bullet.speed;
    
    // 繪製子彈
    fill(255, 255, 0);  // 黃色子彈
    noStroke();
    ellipse(bullet.x, bullet.y, 10, 10);
    
    // 檢查子彈是否擊中 player2
    if (checkCollision(bullet, player2)) {
      player2.health = Math.max(0, player2.health - 10);
      bullets1.splice(i, 1);
      continue;
    }
    
    // 移除超出畫面的子彈
    if (bullet.x > width) {
      bullets1.splice(i, 1);
    }
  }
  
  // 更新和繪製 player2 的子彈
  for (let i = bullets2.length - 1; i >= 0; i--) {
    let bullet = bullets2[i];
    bullet.x += bullet.speed;
    
    // 繪製子彈
    fill(255, 0, 0);  // 紅色子彈
    noStroke();
    ellipse(bullet.x, bullet.y, 10, 10);
    
    // 檢查子彈是否擊中 player1
    if (checkCollision(bullet, player1)) {
      player1.health = Math.max(0, player1.health - 10);
      bullets2.splice(i, 1);
      continue;
    }
    
    // 移除超出畫面的子彈
    if (bullet.x < 0) {  // 檢查左邊界
      bullets2.splice(i, 1);
    }
  }
}

function keyPressed() {
  // player1 的控制 (箭頭鍵)
  switch(keyCode) {
    case LEFT_ARROW:
      player1.currentAction = 'walk';
      break;
    case UP_ARROW:
      player1.currentAction = 'walk';
      player1.health = Math.min(100, player1.health + 10);  // 增加血量，最高100
      break;
    case RIGHT_ARROW:
      player1.currentAction = 'jump';
      break;
  }
  
  // player2 的控制
  switch(key) {
    case 'a':
    case 'A':
      player2.currentAction = 'walk';
      break;
    case 'w':
    case 'W':
      player2.currentAction = 'walk';
      player2.health = Math.min(100, player2.health + 10);  // 增加血量，最高100
      break;
    case 'd':
    case 'D':
      player2.currentAction = 'walk';
      break;
    case 's':
    case 'S':
      player2.currentAction = 'jump';
      break;
  }
  
  // 重置影格
  if ([UP_ARROW, RIGHT_ARROW].includes(keyCode)) {
    player1.currentFrame = 0;
  }
  if (['w','W','s','S','a','A','d','D'].includes(key)) {
    player2.currentFrame = 0;
  }
  
  // player1 發射子彈
  if (keyCode === DOWN_ARROW) {
    bullets1.push({
      x: player1.x + 50,
      y: player1.y + 30,
      speed: 10  // 向右移動
    });
  }
  
  // player2 發射子彈
  if (key === 's' || key === 'S') {
    bullets2.push({
      x: player2.x - 10,  // 從角色左側發射
      y: player2.y + 30,
      speed: -10  // 向左移動
    });
  }
}

function keyReleased() {
  // player1 放開按鍵回到靜止狀態
  if ([LEFT_ARROW, UP_ARROW, RIGHT_ARROW].includes(keyCode)) {  // 加入 LEFT_ARROW
    player1.currentAction = 'idle';
    player1.currentFrame = 0;
  }
  
  // player2 放開按鍵回到靜止狀態
  if (['w','W','s','S','a','A','d','D'].includes(key)) {  // 加入 a,A,d,D
    player2.currentAction = 'idle';
    player2.currentFrame = 0;
  }
}

// 新增繪製血量條的函數
function drawHealthBar(x, y, health) {
  const barWidth = 100;
  const barHeight = 10;
  
  // 繪製血量條背景（紅色）
  noStroke();
  fill(255, 0, 0);
  rect(x, y, barWidth, barHeight);
  
  // 繪製當前血量（綠色）
  fill(0, 255, 0);
  rect(x, y, barWidth * (health/100), barHeight);
  
  // 繪製血量條邊框
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(x, y, barWidth, barHeight);
}

// 新增碰撞檢測函數
function checkCollision(bullet, player) {
  // 簡單的矩形碰撞檢測
  let currentAnim = player[player.currentAction];
  return bullet.x > player.x && 
         bullet.x < player.x + currentAnim.width * 1.5 &&
         bullet.y > player.y && 
         bullet.y < player.y + currentAnim.height * 1.5;
}

