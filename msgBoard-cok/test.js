var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require("querystring");
var buffer = require("buffer");
var times = 1;
// 创建服务器
function serverHandle(request, response) {
  // 解析请求，包括文件名
  console.log("\n" + times + " times request")
  var pathname = url.parse(request.url).pathname;
  var position = pathname.lastIndexOf(".");
  var textType = pathname.substr(position + 1);
  var sdata = { status: " " };
  var rdata = "";
  var userInfo = {
    action: '',
    username: '',
    password: ''
  };
  // 输出请求的文件名
  console.log("Request for " + pathname);
  if (pathname == "/")
    pathname = "index.html";
  else
    pathname = pathname.substr(1);
  // 从文件系统中读取请求的文件内容
  fs.readFile(pathname, function (err, data) {
    if (err) {
      console.log(err);
      // HTTP 状态码: 404 : NOT FOUND
      // Content Type: text/plain
      response.writeHead(404, { 'Content-Type': 'text/html' });
    }
    else if (textType == "css") {
      response.writeHead(200, { 'Content-Type': 'text/css' });
      // 响应文件内容
      response.write(data.toString());
      response.end();
    }
    else if (textType == "jpg") {
      response.writeHead(200, { 'Content-Type': 'application/x-jpg' });
      // 响应文件内容
      response.write(data);
      response.end();
    }

    //登陆验证请求    
    else if (pathname == "test.js") {
      request.addListener("data", function (chunk) {
        rdata += chunk;
      });
      request.on("end", function () {
        userInfo = qs.parse(rdata);
        // console.log(userInfo.action);
        // console.log(userInfo.username);
        // console.log(userInfo.password);
      

        //登陆
        if (userInfo.action == "login") {
          console.log("request for login")
          console.log("cookies is: " + decodeURI(request.headers.cookie));
          if (fs.existsSync("userdata/" + userInfo.username)) {
            var text = fs.readFileSync("userdata/" + userInfo.username + "/profile.txt", "utf-8");
            var id = qs.parse(text);
            console.log("数据库账号为：" + id.username);
            console.log("数据库密码为：" + id.password);
            console.log("请求账号为：" + userInfo.username);
            console.log("请求密码为：" + userInfo.password);
            if (id.password == userInfo.password) {
              sdata.status = "登陆成功";
              console.log("user: " + userInfo.username + " login successful");
            }
            else
              sdata.status = "密码错误";
          }
          else
            sdata.status = "用户不存在";
        }

        //注册
        else if (userInfo.action == "build") {
          console.log("request for sign up")
          if (fs.existsSync("userdata/" + userInfo.username))
            sdata.status = "该用户已存在，请重新输入";
          else {
            fs.mkdirSync("userdata/" + userInfo.username)
            fs.writeFileSync("userdata/" + userInfo.username + "/profile.txt", rdata, "utf-8");
            sdata.status = "注册成功"
            console.log("user: " + userInfo.username + "sign up successful");
          }
        }

        //提交留言信息
        else if (userInfo.action == "upload") {
          var cont = userInfo.cont;
          var user = userInfo.username;
          var ret = "<hr/>" + "<b>" + user + ":</b>" + "<p>" + cont + "</p>";
          fs.appendFileSync("publicdata.txt", ret, "utf-8");
          sdata.status = "提交成功"
        }

        //加载留言信息
        else if (userInfo.action == "load") {
          var text = fs.readFileSync("publicdata.txt", "utf-8");
          sdata.status = text;
        }

        console.log(sdata.status);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(sdata));
      });
    }

    //HTML页面请求  
    else {
      // HTTP 状态码: 200 : OK
      // Content Type: text/plain
      if (pathname == "html/main.html") {
        console.log("request main.html of cookie is : " + request.headers.cookie);
        var cookie = decodeURI(request.headers.cookie);
        var posit = cookie.indexOf("username");
        var info = cookie.substr(posit);
        var user = qs.parse(info);
        console.log("the decoded cookie is: " + cookie);
        if (fs.existsSync("userdata/" + user.username)) {
          var text = fs.readFileSync("userdata/" + user.username + "/profile.txt", "utf-8");
          var id = qs.parse(text);
          //console.log(id.username);
          //  console.log(id.password);

          if (id.password == user.password) {
            sdata.status = "登陆成功";
            response.writeHead(200, { 'Content-Type': 'text/html' });
            // 响应文件内容
            response.write(data.toString());
            response.end();
          }
          else {
            console.log("request fail");
            response.writeHead(301, { 'Location': '/' });
            response.end();
          }
        }
        else {
          console.log("request fail");
          response.writeHead(301, { 'Location': '/' });
          response.end();
        }
      }
      else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        // 响应文件内容
        response.write(data.toString());
        response.end();
      }
    }
    //  发送响应数据
  });
  times++;
}
var server = http.createServer(serverHandle);
server.listen(80);

// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:80/');