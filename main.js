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

// function updateBoardView(){
//   $(".number-cell").remove();
//   for(var i=0;i<4;i++){
//     for(var j=0;j<4;j++){
//       $(".grid-container").append("<div class="number-cell"
//       id="number-cell"+i+"-"+j></div>")
//       var theNumberCell=$("#number-cell"+i+"-"+j);
//
//       if(board[i][j]==0){
//         theNumberCell.css('width','0px');
//         theNumberCell.css('height','0px');
//         theNumberCell.css('top',getPosTop(i,j)+50);
//         theNumberCell.css('left',getPosLeft(i,j)+50);
//       }
//       else{
//         theNumberCell.css('width','100px');
//         theNumberCell.css('height','100px');
//         theNumberCell.css('top',getPosTop(i,j));
//         theNumberCell.css('left',getPosLeft(i,j));
//         theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
//         theNumberCell.css('color',getNumberColor(board[i][j]));
//         theNumberCell.text(board[i][j]);
//       }
//     }
//   }
// }
