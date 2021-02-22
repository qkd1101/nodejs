// function a() {
//   console.log();
// }

var a = function() {  //익명함수
  console.log('A');
}

function showfunc(callback){
  callback();
}

slowfunc(a);
