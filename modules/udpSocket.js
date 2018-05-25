module.exports = class UdpSocket{
    constructor(HOST,PORT){
        let dgram = require('dgram');

        let socket = dgram.createSocket('udp4');

        socket.bind(PORT);

        this.host = HOST;

        this.port = PORT;

        this.socket = socket;
    }

    get host(){
        return this.host;
    }

    get port(){
        return this.port;
    }

    send(msg){
        let message = new Buffer(msg);
        
        this.socket.send(message,this.port(),this.host(),(err) => {
            this.socket.close()
        });
    }
}