const EventEmitter = require('events')
const globals = require('./config')

module.exports = class UdpSocket extends EventEmitter {
    
    constructor(HOST,PORT){

        super()

        let dgram = require('dgram');
        let socket = dgram.createSocket('udp4');

        socket.on('message', (msg, info) => {

            if(globals.verbose)
                console.log(`\n------\n==> SOCKET\n==> MESSAGE: ${msg}\n==> FROM: ${info.address}:${info.port}\n------\n`)

            this.emit('message', msg.toString('ascii'))
        });

        socket.on('listening', () => {
            const address = socket.address();

            if(globals.verbose)
                console.log(`Socket listening ${address.address}:${address.port}`);
        });

        if(PORT)
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