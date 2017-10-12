console.log('js connected')

//changeable variables
var mazeGrid = 128;
var mazeSize = 6;
// const colorOpen = 'rgb(156, 177, 191)';
const colorOpen = 'rgb(255, 255, 255)';
const colorPossible = 'rgb(24, 65, 105)';
// const colorClosed = 'rgb(19, 49, 77)';
const colorClosed = 'rgb(0,0,0)';

//initialization variables
var mazeBox = document.getElementById('mazeBox');
var mazeBtn = document.getElementById('mazeBtn');
var stepBtn = document.getElementById('stepBtn')
var mazeArr = [];
var possibleArr = [];

const LEFT = 0;
const UP = 1;
const RIGHT = 2
const DOWN = 3;
const oneAround = [[0, -1, LEFT], [-1, 0, UP], [0, 1, RIGHT], [1, 0, DOWN]]

makeMaze();

//start the maze
mazeBtn.addEventListener("click", function() {
    let startY = randomBetween(2, mazeGrid-3);
    let startX = randomBetween(2, mazeGrid-3);
    for(let i = 0; i < 4; i++){
      addPossible(startY + oneAround[i][0], startX + oneAround[i][1], oneAround[i][2])
    }
    mazeArr[startY][startX].style.backgroundColor = colorOpen;
    console.log(startY + " , " + startX)
    console.log(possibleArr)
    var loop = setInterval(step, 5)

    function step() {
      if(possibleArr.length <= 0){
        clearInterval(loop)
      } else {
        //1 - pick random from possibles
        let randPos = randomBetween(0, possibleArr.length -1)
        //2- check is pick IS possible
        let isGood = false;
        let newY = possibleArr[randPos][0]
        let newX = possibleArr[randPos][1]
        let side = possibleArr[randPos][2]
        isGood = checkPossibleA(newY, newX, side)
        if (isGood) {
          //3 - change ONE spaces to open
          mazeArr[newY][newX].style.backgroundColor = colorOpen;
          //4 - remove from possibleArr
          possibleArr.splice(randPos, 1)
          //5 - update possibleArr
          for(let p = 0; p < 4; p++){
            //check sides around pos A
            let isPosAGood = checkPossibleA(newY + oneAround[p][0], newX + oneAround[p][1],  + oneAround[p][2])
            if(isPosAGood){
              addPossible(newY + oneAround[p][0], newX + oneAround[p][1],  + oneAround[p][2])
            }
          }
        } else {
          //NOT POSSIBLE
          //remove and change color to colorClosed
          mazeArr[newY][newX].style.backgroundColor = colorClosed;
          possibleArr.splice(randPos, 1)
        }
      }
    }
})



// mazeArr[startY][startX].style.backgroundColor


function makeMaze() {
  mazeBox.style.height = (mazeGrid * mazeSize) + "px";
  mazeBox.style.width = (mazeGrid * mazeSize) + "px";
  for(let y = 0; y < mazeGrid; y++) {
    mazeArr[y] = [];
    for(let x = 0; x < mazeGrid; x++){
      let tempDiv = document.createElement('div');
      tempDiv.style.backgroundColor = colorClosed;
      tempDiv.style.width = mazeSize + "px";
      tempDiv.style.height = mazeSize + "px";
      mazeArr[y][x] = tempDiv
      mazeBox.appendChild(tempDiv);
    }
  }
  console.log(mazeArr);
}

function checkPossibleA(y, x, side) {
//check inside mazeGrid
  if(y < 0 || y >= mazeGrid || x < 0 || x >= mazeGrid){
    return false;
  }
  if(mazeArr[y][x].style.backgroundColor == colorOpen){
    return false;
  }
//1-count open sides of possible position
  let open = [];
  let newY = 0;
  let newX = 0;
  let nextPos = oppositeSide(side)
  for(let i = 0; i < 4; i++){
    newY = y + oneAround[i][0];
    newX = x +oneAround[i][1];
    if(newY > -1 && newY < mazeGrid && newX > -1 && newX < mazeGrid) {
      if(mazeArr[newY][newX].style.backgroundColor == colorOpen){
        open.push(oneAround[i][2])
      }
    }
  }
  if(open.length == 1 && open[0] == nextPos){
  //2 - passed
    return true;
    // console.log("passed A")
    // let isBGood = checkPossibleB(y + oneAround[side][0], x + oneAround[side][1]);
    // if(isBGood){
    //   console.log("passed B")
    //   return true;
    // } else {
    //   return false;
    // }
  } else {
  //failed, not possible, remove and start over
    return false;
  }
}

function checkPossibleB(y, x) {
//check inside mazeGrid
  if(y < 0 || y >= mazeGrid || x < 0 || x >= mazeGrid){
    return false;
  }
  let open = 0;
  let newY = 0;
  let newX = 0;
  for(let i = 0; i < 4; i++){
    newY = y + oneAround[i][0];
    newX = x +oneAround[i][1];
    if(newY > -1 && newY < mazeGrid && newX > -1 && newX < mazeGrid) {
      if(mazeArr[newY][newX].style.backgroundColor == colorOpen){
        open++
      }
    }
  }
  if(open == 0) {
    return true;
  } else {
    return false;
  }
}

function addPossible(y, x, side) {
  possibleArr.push([y, x, side])
  mazeArr[y][x].style.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  //mazeArr[y][x].style.backgroundColor = colorPossible;
}

function oppositeSide(side) {
  switch (side) {
    case LEFT:
      return RIGHT;
      break;
    case UP:
      return DOWN;
      break;
    case RIGHT:
      return LEFT;
      break;
    case DOWN:
      return UP;
      break;
  }
}

function randomBetween(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
