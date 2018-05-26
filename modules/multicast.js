module.exports = class Multicast{
    
    constructor(groupIpAddress, PORT){
        
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
        
        // @todo: Definir uma maneira de definir a ação deste evento fora do módulo
        this.server.on('message',(msg,info) => {
            console.log(msg.toString('ascii'));
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

