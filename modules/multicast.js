module.exports = function init(groupAddress){
    var dgram = require('dgram');

    var server = dgram.createSocket({
        type: "udp4",
        reuseAddr: true
    });

    server.bind();

    server.setBroadcast(true);
    server.setMulticastTTL(128);
    server.addMembership(groupAddress);

    return server;
}

