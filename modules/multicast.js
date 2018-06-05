const EventEmitter = require('events')
const util = require('util')

const globals = require('./config')

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
            
            if(globals.verbose)
                console.log(`\n------\n==> MULTICAST\n==> MESSAGE: ${msg}\n==> FROM: ${info.address}:${info.port}\n------\n`)

            if(msg && msg.indexOf('WHOIS?') >= 0){
                this.emit('whois', msg.toString('ascii'), info)

            } else if (msg && msg.indexOf('IAM!') >= 0) {
                this.emit('iam', msg.toString('ascii'), info)

            } else if (msg && msg.indexOf('ELECTION') >= 0){
                this.emit('election', msg.toString('ascii'), info)

            } else {
                this.emit('message', msg.toString('ascii'), info)    
            }            
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

    whois(id){                
        this.send("WHOIS?" + id ? ':'+id : '', this.port, this.groupAddress,(err) => {
            if(err)
                console.log(err);
        })
    }
    
}

