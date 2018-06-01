var Multicast = require('../modules/multicast.js');
var udpSocket = require('../modules/udpSocket')


// let multicastSocket = new Multicast('224.0.0.1',42280);

// setInterval(function(){
//     multicastSocket.send("Eu sou o beta");
// },2000);

// multicastSocket.on('message', (msg) => {
//     console.log('\nRecebi: ', msg)
// })

let udp = new udpSocket('127.0.0.1', 4444)
udp.send('oi', '127.0.0.1', 3333)