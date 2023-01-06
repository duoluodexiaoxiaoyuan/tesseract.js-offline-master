var http = require('http');
var fs = require('fs')
var server = http.createServer(function(req, res){
    var readStream = fs.createReadStream(__dirname + '/one.html', 'utf-8');

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    readStream.pipe(res); // 管道方式发送 html 内容到客户端
});

server.listen(8888, '127.0.0.1'); // 监听本机上的 8888 端口

console.log('server is listening 8888');