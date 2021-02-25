var http = require('http');
var fs = require('fs');
var url = require('url');
var Body = require('./lib/Body2.js');
var qs = require('querystring');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  var pathname = url.parse(_url,true).path;
  if(pathname === '/') {
    if(queryData.id === undefined) {  //home
      fs.readdir(`../data`,function(err,filelist){
        var title = 'Welcome';
        var description = 'Hello Node.js';
        var list = Body.makeList(filelist);
        var template = Body.makeBody(title,list,`<h2>${title}</h2>${description}`,`
          <a href = "/create">create</a>
          `);
        response.writeHead(200);
        response.end(template);
      })
    } else {
      fs.readdir(`../data`,function(err,filelist){
        fs.readFile(`../data/${queryData.id}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = Body.makeList(filelist);
          var template = Body.makeBody(title,list,`<h2>${title}</h2>${description}`,`
            <a href ="/create">create</a>  <a href = "/update?id=${title}">update</a> //~
            <form action ="delete" method ="post">
              <input type = "hidden" name="id" value="${title}"/> <!--Post--!> <!--queryData.id--!>
              <input type = "submit" value="delete_process">
            </form>
          `);
          response.writeHead(200);
          response.end(template);
        })
      })
    }
  } else if(pathname === '/create') {
    fs.readdir('../data',function(err,filelist){
      var title = 'WEB - create';
      var list = Body.makeList(filelist);
      var template = Body.makeBody(title,list,`
        <form action = "/create_process" method = "post">
          <p> <input type = "text" name = "title" placeholder="title"></p>
          <p>
            <textarea name = "description" placeholder = "description"></textarea>
          </p>
          <p> <input type = "submit" value = "제출"> </p>
        </form>
        `,``);
        response.writeHead(200);
        response.end(template)
    })
  } else if(pathname === '/create_process') {
    var body = '';

    request.on('data',function(data){
      body = body+data;
    });

    request.on('end',function(){  //받아올 data가 없을때 실행되는 함수.
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.appendFile(`../data/${title}`,description,'utf8',function(err){
        response.writeHead(302,{Location: `/?id=${title}`});
        response.end();
      })
    });
  } else if(pathname === '/update'){
    fs.readdir('../data',function(err,filelist){
      fs.readFile(`../data/${queryData.id}`,'utf8',function(err,description){
      var title = 'WEB - create';
      var list = Body.makeList(filelist);
      var template = Body.makeBody(title,list,`
        <form action = "/update_process" method = "post">
          <input type = "hidden" name = "id" value = "${title}">
          <p> <input type = "text" name = "title" placeholder="title"></p>
          <p>
            <textarea name = "description" placeholder = "description"></textarea>
          </p>
          <p> <input type = "submit" value = "제출"> </p>
        </form>
        `,``);
        response.writeHead(200);
        response.end(template);
    })
  })
  } else if(pathname === '/update_process'){
    var body = '';

    request.on('data',function(data){
      body = body+data;
    });

    request.on('end',function(){  //받아올 data가 없을때 실행되는 함수.
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`../data/${id}`,`../data/${title}`,function(err){
          fs.writeFile(`../data/${title}`,description,'utf8',function(err){
          response.writeHead(302,{Location: `/?id=${title}`});
          response.end();
        })
      })
    });
  } else if(pathname === '/delete_process'){
    var body = '';
    request.on('data',function(data){
      body = body+data;
    });
    request.on('end',function(){  //받아올 data가 없을때 실행되는 함수.
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`../data/${id}`,function(err){
        if(err){
          console.log(err);
          return ;
        }
        response.writeHead(302,{Location: `/`});
        response.end();
      })
    });
  } else{ //error
      response.writeHead(404)
      response.end('Not Found');
    }
})
app.listen(3010);
