var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(8001);
io.listen(server);

var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
  console.log("client connected at: ", new Date());

   //recieve client data
  socket.on('client_data', function(data){
    // process.stdout.write(data.ctrl);
    console.log(data.ctrl);
  });

  // receive control signal
  socket.on('ctrl', function(data){
    // process.stdout.write(data.ctrl);
    control(socket, data);
  });
});

function control(socket, cmd){
  switch(cmd.direction){
    case 'f':
      console.log("forward "+ cmd.speed);
      sendVector(socket, 270, 200);
      break;
    case 'b':
      console.log("backward "+ cmd.speed);
      sendVector(socket, 90, 200);
      break;
    case 'r':
      console.log("right "+ cmd.speed);
      sendVector(socket, 0, 200);
      break;
    case 'l':
      console.log("left "+ cmd.speed);
      sendVector(socket, 180, 200);
      break;
    case 'stop':
      console.log("stop "+ cmd.speed);
      break;
  }
}

function sendVector(socket, angle, radius){
  socket.emit('v', {'a': angle, 'r': radius});
}
