module.exports = class UdpSocket{
    constructor(HOST,PORT){
        let dgram = require('dgram');

        let socket = dgram.createSocket('udp4');

        socket.bind(PORT);

        this.host = HOST;

        this.port = PORT;

        this.socket = socket;
    }

    get getHost(){
        return this.host;
    }

    get getPort(){
        return this.port;
    }

    send(msg){
        let message = new Buffer(msg);
        
        this.socket.send(message,this.getPort(),this.getHost(),(err) => {
            this.socket.close()
        });
    }
}