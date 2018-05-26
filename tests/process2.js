var Multicast = require('../modules/multicast.js');

let multicastSocket = new Multicast('224.0.0.1',42280);

setInterval(function(){
    multicastSocket.send("Eu sou o beta");
},2000);