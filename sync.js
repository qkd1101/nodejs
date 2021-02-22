var fs = require('fs');

//readfile sync
/*
console.log('A');
var result = fs.readFileSync('sample.txt','utf8')
console.log(result);
*/

console.log('A');
fs.readFile('sample.txt','utf8', function(err,result){
  console.log(result);
});
