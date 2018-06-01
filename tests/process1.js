var Multicast = require('../modules/multicast');
var udpSocket = require('../modules/udpSocket')

// let multicastSocket = new Multicast('224.0.0.1',42280);

// setInterval(function(){
//     multicastSocket.send("Eu sou o alpha");
// },2000);

let udp = new udpSocket('127.0.0.1', 3333)

udp.on('message', (msg) => {
    console.log('Vai fiii: ', msg)
})