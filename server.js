var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

const SerialPort = require('serialport')
const LidarPacket = require('../node_modules/neato-lidar/lib/index.js').LidarPacket


var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            fs.readFile(__dirname + '/index.html', function(error, data){
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


function sendVector(socket, angle, radius){
  socket.emit('msg', {'content': 'sending vector'});
  socket.emit('v', {'a': angle, 'r': radius});
}

server.listen(8001);
io.listen(server);

var listener = io.listen(server);
listener.sockets.on('connection', function(socket){

  console.log("client connected at: ", new Date());

  socket.emit('msg', {'content': 'hey there'});

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

  var serial;
  socket.on('conn', function(data){
    console.log("received request to connect to serial");
    serial = connectSerial(socket);

    serial.on('data', function (data) {
      data = new Uint8Array([0xFA].concat(data.slice(0, 21)))
      socket.emit('msg', {'err': data})

      try {
        let lp = new LidarPacket(data)
        lp.measures
          .filter((m) => !m.invalid)
          .forEach((m) => sendVector(socket, m.index, m.distance))
      } catch (e) {
        console.error(e)
        //socket.emit('msg', {'err': data})
      }
    })
  });
});


function connectSerial(socket){
  const serial = new SerialPort('/dev/tty.usbserial-AH06NJYB', {
    baudrate: 115200,
    parser: SerialPort.parsers.byteDelimiter([0xfa])
  });

  socket.emit('msg', {'content': 'serial connected'});

  return serial;
}

function established(socket){
  socket.emit('connected to serial');
}

function control(socket, cmd){
  switch(cmd.direction){
    case 'f':
      console.log("forward "+ cmd.speed);
      socket.emit('msg', {'content': 'forward ho!'});
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
