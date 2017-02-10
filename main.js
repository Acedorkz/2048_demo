// 主逻辑

/*by author Ace
*有几个关键点
*1.设置hasConflicted数组来判断是否已经发生碰撞
*  2 2 4 8 -> 4 4 8 而不是 2 2 4 8 -> 16
*2.时间优化算法
*  在寻找空闲坐标时 随机生成并且判断会耗费时间
*  所以设置times times一旦大于50 就人工寻找
*  通过双重循环
*3.为了自适应各种设备
*  将原来的绝对定位的数值转换成百分数
*  这样在各种设备下便可完美展现
*4.触控交互
*  !!!在屏幕坐标系中y是向下的!!!
*  start end 两个坐标
*  判断触控方向 endx-startx endy-starty
*  如果endx-startx大于endy-starty 则为x轴上划动
*  如果endx-startx>0 则向右划动
*  如果endy-starty<0 则向上划动
*5.防止默认的效果 防止滚动条发生移动
*  event.preventDefault();
*/

// 主要的版面 二维数组
var board=new Array();
// 分数
var score=0;

var startx=0;
var starty=0;
var endx=0;
var endy=0;

//是否已经发生碰撞
/*!!防止 2 2 4 8 直接碰撞成16!!*/
//所以设置hasConflicted二维数组
var hasConflicted=new Array();
$(document).ready(function(){
  prepareForMobile();
  newgame();
});

function prepareForMobile(){
  //如果设备屏幕太大，则不采用自适应的方法
  //而是采用原先自己定义的方法
  if(documentWidth>500){
    gridContainerWidth=500;
    cellSpace=20;
    cellSideLength=100;
  }
  $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('padding',cellSpace);
  $('#grid-container').css('board-radius',0.02*gridContainerWidth);

  $('.grid-cell').css('width',cellSideLength);
  $('.grid-cell').css('height',cellSideLength);
  $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame(){
  //初始化棋盘
  init();
  //在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init(){
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      var gridCell=$("#grid-cell-"+i+"-"+j);
      // function getPosTop在support.js中
      //函数用于获取grid-cell的顶部及左部距离
      gridCell.css('top',getPosTop(i,j));
      gridCell.css('left',getPosLeft(i,j));
    }
  }
  for(var i=0;i<4;i++){
    // 使board编程二维数组
    board[i]=new Array();
    hasConflicted[i]=new Array();
    for(var j=0;j<4;j++){
      board[i][j]=0;
      hasConflicted[i][j]=false;
    }
  }
  updateBoardView();
  score=0;
}

function updateBoardView(){
  $(".number-cell").remove();
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
      var theNumberCell=$('#number-cell-'+i+'-'+j);

      if(board[i][j]==0){
        theNumberCell.css('width','0px');
        theNumberCell.css('height','0px');
        theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
        theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
      }
      else{
        theNumberCell.css('width',cellSideLength);
        theNumberCell.css('height',cellSideLength);
        theNumberCell.css('top',getPosTop(i,j));
        theNumberCell.css('left',getPosLeft(i,j));
        theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color',getNumberColor(board[i][j] ));
        theNumberCell.text( board[i][j] );
      }
      hasConflicted[i][j]=false;
    }
  }
  $('.number-cell').css('line-height',cellSideLength+'px');
  $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

//随机生成一个数字
function generateOneNumber(){
  //判断是否有空间
  if(nospace(board))
    return false;

  //随机一个位置
  var randx=parseInt(Math.floor(Math.random()*4));//Math.floor向下取整
                                                  //parseInt强制转换为整型
  var randy=parseInt(Math.floor(Math.random()*4));

  var times=0;
  //检验随机生成的坐标位置是否可用 利用死循环 不断地随机生成坐标及判断

  /*!!利用times来优化随机位置算法 节约寻找空闲坐标的时间!!*/
  while(times<50){
    if(board[randx][randy]==0)
      break;
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    times++;
  }
  //如果times达到50时，人工通过循环寻找空闲坐标
  if(times==50){
    for(var i=0;i<4;i++){
      for(var j=0;j<4;j++){
        if(board[i][j]==0){
          randx=i;
          randy=j;
        }
      }
    }
  }
  //随即一个数字 2或4
  var randNumber=Math.random()<0.5?2:4;//小于0.5的数字则生成2 否则生成4

  //在随机位置显示随机数字
  board[randx][randy]=randNumber;
  showNumberWithAnimation(randx,randy,randNumber);

  return true;
}

$(document).keydown(function(event){
  //防止默认的效果 防止滚动条发生移动

  switch(event.keyCode){
    //键盘代码
    case 37://left
    event.preventDefault();
    if(moveLeft()){
      setTimeout("generateOneNumber()",210);
      setTimeout("isgameover()",300);
    }
      break;
    case 38://up
    event.preventDefault();
    if(moveUp()){
      setTimeout("generateOneNumber()",210);
      setTimeout("isgameover()",300);
    }
      break;
    case 39://right
    event.preventDefault();
    if(moveRight()){
      setTimeout("generateOneNumber()",210);
      setTimeout("isgameover()",300);
    }
      break;
    case 40://down
    event.preventDefault();
    if(moveDown()){
      setTimeout("generateOneNumber()",210);
      setTimeout("isgameover()",300);
    }
      break;
    default:
      break;
  }
});

//触控方式捕捉 touchstart touchend
/*event.touches是一个数组 多个指头的触摸坐标*/
document.addEventListener('touchstart',function(event){
  startx=event.touches[0].pageX;
  starty=event.touches[0].pageY;
});
//当发生点击事件时 也会产生deltax=0,deltay=0
document.addEventListener('touchend',function(event){
  endx=event.changedTouches[0].pageX;
  endy=event.changedTouches[0].pageY;
  var deltax=endx-startx;
  var deltay=endy-starty;
  //当deltax,deltay小于某设备的某一个阈值时，不认为用户想进行划动操作
  //可能是点击操作
  //所以直接返回 不进行移动操作
  if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
    return;
  //x方向上进行
  if(Math.abs(deltax)>=Math.abs(deltay)){
    if(deltax>0){
      //move right
      if(moveRight()){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
    else{
      //move left
      if(moveLeft()){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }
  //y方向上进行
  else{
    if(deltay>0){
      //move down
      if(moveDown()){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
    else{
      //move up
      if(moveUp()){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }
});




//判断游戏是否结束
function isgameover(){
  //既棋盘已被全盘占满 并且 没有移动的空间即没有相邻的两个格子相同
  if(nospace(board)&&nomove(board)){
    gameover();
  }
}

//gameover
function gameover(){
  alert("GameOver^");
}
//moveLeft
function moveLeft(){
  //首先判断是否能够向左移动
  if(!canMoveLeft(board))
    return false;
  //其次 开始移动 moveLeft
  //1.落脚位置是否为空
  //2.落脚位置数字和待判定数字是否相同
  //3.移动路径中是否有障碍物
  for(var i=0;i<4;i++){
    //j从1开始 只考虑右3列
    for(var j=1;j<4;j++){
      if(board[i][j]!=0){
        //i,j左侧的所有元素 i,k
        for(var k=0;k<j;k++){
          //function noBlockHorizontal 在移动路径中无障碍
          if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
            //move
            showMoveAnimation(i,j,i,k);
            board[i][k]=board[i][j];
            board[i][j]=0;
            continue;
          }
          //并且没有发生过碰撞
          else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
            //move
            showMoveAnimation(i,j,i,k);
            //add
            board[i][k]*=2;
            board[i][j]=0;
            //add score
            score+=board[i][k];
            updateScore(score);

            hasConflicted[i][k]=true;
            continue;
          }
        }
      }
    }
  }
  //刷新
  //等待200ms 先让移动的动画完成 然后再刷新页面
  setTimeout("updateBoardView()",200);
  return true;
}

//moveUp
function moveUp(){
  if(!canMoveUp(board))
    return false;
  //只考虑下部3列
  /*!!先确定j循环 再确定i循环!!*/
  for(var j=0;j<4;j++){
    for(var i=1;i<4;i++){
      if(board[i][j]!=0){
        //i,j上侧的所有元素i,k
        for(var k=0;k<i;k++){
          //function noBlockHorizontal 在移动路径中无障碍
          if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
            showMoveAnimation(i,j,k,j);
            board[k][j]=board[i][j];
            board[i][j]=0;
            continue;
          }
          else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[j][k]){
            //move
            showMoveAnimation(i,j,k,j);
            //add
            board[k][j]*=2;
            board[i][j]=0;
            //add score
            score+=board[k][j];
            updateScore(score);

            hasConflicted[j][k]=true;
            continue;
          }
        }
      }
    }
  }
  //刷新
  //等待200ms 先让移动的动画完成 然后再刷新页面
  setTimeout("updateBoardView()",200);
  return true;
}

//moveRight
function moveRight(){
  if(!canMoveRight(board))
    return false;

  //只考虑左部3列
  for(var i=0;i<4;i++){
    for(var j=2;j>=0;j--){
      if(board[i][j]!=0){
        //i,j右侧所有元素i,k
        for(var k=3;k>j;k--){
          if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
            showMoveAnimation(i,j,i,k);
            board[i][k]=board[i][j];
            board[i][j]=0;
            continue;
          }
          else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[j][k]){
            showMoveAnimation(i,j,i,k);
            board[i][k]*=2;
            board[i][j]=0;
            //add score
            score+=board[i][k];
            updateScore(score);

            hasConflicted[j][k]=true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;
}

//moveDown
function moveDown(){
  if(!canMoveDown(board))
    return false;
  for(var j=0;j<4;j++){
    //只考虑上侧3行
    for(var i=2;i>=0;i--){
      if(board[i][j]!=0){
        for(var k=3;k>i;k--){
          if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
            showMoveAnimation(i,j,k,j);
            board[k][j]=board[i][j];
            board[i][j]=0;
            continue;
          }
          else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[i][k]){
            showMoveAnimation(i,j,k,j);
            board[k][j]*=2;
            board[i][j]=0;
            //add score
            score+=board[k][j];
            updateScore(score);

            hasConflicted[i][k]=true;
            continue;
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;
}
