module.exports = function init(groupAddress, PORT){
    var dgram = require('dgram');

    var server = dgram.createSocket({
        type: "udp4",
        reuseAddr: true
    });

    server.bind(PORT,function(){
        server.setBroadcast(true);
        server.setMulticastTTL(128);
        server.addMembership(groupAddress);
    });

    return server;
}

