# webbot
A little project with a few goals:

1. Learn about Node and Socket.io
2. Communicate with and receive data from a Neato Lidar.
3. Control a robot with JS.
4. ??

## Hardware Connection
I took a Lidar (Piccolo Laser Distance Sensor) out of a Neato XV Signature Pro vaccuum and wanted to see if I could do something else with it.

Wiring looks something like this:
1. <a target="_blank" href="https://www.amazon.com/gp/product/B00N4MCS1A/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00N4MCS1A&linkCode=as2&tag=ballweg0a-20&linkId=edf9ce5c43a9a87815517cd837f752d8">Micro USB FTDI Basic Breakout Module (3.3V/5V)</a><img src="//ir-na.amazon-adsystem.com/e/ir?t=ballweg0a-20&l=am2&o=1&a=B00N4MCS1A" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
2. Dupont jumper wires or JST connectors
3. Neato Lidar
4. Some kind of 3 volt power supply (or PWM setup) to drive the motor.

![Neato Lidar connected](https://github.com/ballweg/webbot/raw/master/Serial%20Connection.jpg "1. FTDI, 2. Serial Interface, 3. Neato Lidar, 4. 3v DC power for motor.")

## Software Dependencies

I'm trying to do this all with JS. Which means node and npm should be installed and familiar. Key libraries are:

- [neato-lidar](https://www.npmjs.com/package/neato-lidar)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [serialport](https://www.npmjs.com/package/serialport)

## Further Reading/My References

- [Node.js Tutorial with Socket.io - Daniel Nill](http://danielnill.com/nodejs-tutorial-with-socketio)
- [Drawing on Canvas - Eloquent Javascript](https://eloquentjavascript.net/16_canvas.html)

