var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function makeBody(title,list,body, controll){
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${controll}
    ${body}
  </html>
  `;

  return template;
}

function makeList(filelist){
    var list = '<ul>';
    var i = 0;
    while( i < filelist.length) {  //~
      list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i+1;  //~
    }
    list = list + '</ul>';

    return list;
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  var pathname = url.parse(_url,true).pathname;
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('../data', function(error, filelist){  //~
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = makeList(filelist);
          var template = makeBody(title, list, `<h2>${title}</h2>${description}`,
          `<a href ="/create">create</a>
          `);
          response.writeHead(200);
          response.end(template);
        })
    } else {
      fs.readdir('../data',function(error,filelist){
        fs.readFile(`../data/${queryData.id}`,'utf8',function(err,description) {
          var title = queryData.id;
          var list = makeList(filelist);
          var template = makeBody(title,list,`<h2>${title}</h2>${description}`,`
            <a href ="/create">create</a>  <a href = "/update?id=${title}">update</a>
            `);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if(pathname === '/create'){
    fs.readdir('../data', function(error, filelist){  //~
        var title = 'WEB - create';
        var description = 'Hello, Node.js';
        var list = makeList(filelist);
        var template = makeBody(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder ="title"></p>
            <p>
              <textarea name="description" placeholder = "description"></textarea>  <!--여러줄 텍스트입력--!>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,``);
        response.writeHead(200);
        response.end(template);
      });
  } else if(pathname === '/create_process'){
    var body = '';
     request.on('data',function(data){  //event//프로그램 무리 방지를 위해 post방식으로 받으며 조각조각 하나씩 오면 callback으로 데이터를 수신받음.
        body = body + data; //callback이 실행될때마다 data를 받음.
     });
     request.on('end',function(data){ //데이터 수신
       var post = qs.parse(body); //object
       var title = post.title;
       var description = post.description;
       fs.writeFile(`../data/${title}`,description,'utf8',function(err){
            response.writeHead(302,{Location: `/?id=&{title}`});
            response.end();
       })
     });
  } else if (pathname === '/update') {
    fs.readdir('../data',function(error,filelist){
      fs.readFile(`../data/${queryData.id}`,'utf8',function(err,description) {
        var title = queryData.id;
        var list = makeList(filelist);
        var template = makeBody(title,list,`
          <form action="/update_process" method="post">
            <input type = "hidden" name ="id" value ="${title}">
            <p><input type="text" name="title" placeholder ="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder = "description">${description}</textarea>  <!--여러줄 텍스트입력--!>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,`<a href="/create">create</a>
        <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
     request.on('data',function(data){  //event//프로그램 무리 방지를 위해 post방식으로 받으며 조각조각 하나씩 오면 callback으로 데이터를 수신받음.
        body = body + data; //callback이 실행될때마다 data를 받음.
     });
     request.on('end',function(data){ //데이터 수신
       var post = qs.parse(body); //object
       var id = post.id;
       var title = post.title;
       var description = post.description;
       fs.rename(`../data/${id}`,`../data/${title}`,function(err){

       })
     });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
})
app.listen(3000);
