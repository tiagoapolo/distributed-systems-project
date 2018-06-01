const EventEmitter = require('events')

module.exports = class UdpSocket extends EventEmitter {
    
    constructor(HOST,PORT){

        super()

        let dgram = require('dgram');
        let socket = dgram.createSocket('udp4');

        socket.on('message', (msg, rinfo) => {
            console.log(`Socket got message from: ${rinfo.address}:${rinfo.port}`);
            this.emit('message', msg.toString('ascii'))
        });

        socket.on('listening', () => {
            const address = socket.address();
            console.log(`Socket listening ${address.address}:${address.port}`);
        });

        socket.bind(PORT)

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

    send(msg, host, port){
        let message = new Buffer(msg);
        
        this.socket.send(message, port, host,(err) => {
            this.socket.close()
        });
    }
}