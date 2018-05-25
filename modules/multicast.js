module.exports = class Multicast{
    
    constructor(groupAddress, PORT){
        let dgram = require('dgram');
    
        let server = dgram.createSocket({
            type: "udp4",
            reuseAddr: true
        });
    
        server.bind(PORT,function(){
            server.setBroadcast(true);
            server.setMulticastTTL(128);
            server.addMembership(groupAddress);
        });
    
        this.server = server;
    }

    get server(){
        return this.server;
    }
    
}

