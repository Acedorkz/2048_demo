// 主逻辑

// 主要的版面 二维数组
var board=new Array();
// 分数
var score=0;

$(document).ready(function(){
  newgame();
});

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
    for(var j=0;j<4;j++){
      board[i][j]=0;
    }
  }
  updateBoardView();
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
        theNumberCell.css('top',getPosTop(i,j)+50);
        theNumberCell.css('left',getPosLeft(i,j)+50);
      }
      else{
        theNumberCell.css('width','100px');
        theNumberCell.css('height','100px');
        theNumberCell.css('top',getPosTop(i,j));
        theNumberCell.css('left',getPosLeft(i,j));
        theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color',getNumberColor(board[i][j] ));
        theNumberCell.text( board[i][j] );
      }
    }
  }
}

function generateOneNumber(){
  //判断是否有空间
  if(nospace(board))
    return false;

  //随机一个位置
  var randx=parseInt(Math.floor(Math.random()*4));//Math.floor向下取整
                                                  //parseInt强制转换为整型
  var randy=parseInt(Math.floor(Math.random()*4));
  //检验随机生成的坐标位置是否可用 利用死循环 不断地随机生成坐标及判断
  while(true){
    if(board[randx][randy]==0)
      break;
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
  }

  //随即一个数字 2或4
  var randNumber=Math.random()<0.5?2:4;//小于0.5的数字则生成2 否则生成4

  //在随机位置显示随机数字
  board[randx][randy]=randNumber;
  showNumberWithAnimation(randx,randy,randNumber);

  return true;
}
