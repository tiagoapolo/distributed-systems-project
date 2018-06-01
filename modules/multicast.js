const EventEmitter = require('events')
const util = require('util')

module.exports = class Multicast extends EventEmitter {
    
    constructor(groupIpAddress, PORT){
    
        super()

        this.groupAddress = groupIpAddress;
        this.port = PORT
        let dgram = require('dgram');
    
        let server = dgram.createSocket({
            type: "udp4",
            reuseAddr: true
        });
    
        server.bind(PORT,function(){
            server.setBroadcast(true);
            server.setMulticastTTL(128);
            server.addMembership(groupIpAddress);
        });
        
        this.server = server;
        
        this.server.on('message',(msg,info) => {
            this.emit('message', msg.toString('ascii'))       
        })
        
    }

    get getServer(){
        return this.server;
    }

    get getGroupAddress(){
        return this.groupAddress;
    }

    get getPort(){
        return this.port;
    }

    set setServer(socket){
        this.server = socket;
    }

    set setGroupAddress(groupIpAddress){
        this.groupAddress = groupIpAddress;
    }

    set setPort(PORT){
        this.port = PORT;
    }

    
    send(msg){
        let message = new Buffer(msg);
        
        this.server.send(message,this.port,this.groupAddress,(err) => {
            if(err)
                console.log(err);
        });
    }
    
}

