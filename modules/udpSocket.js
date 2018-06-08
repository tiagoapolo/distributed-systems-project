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

            if(msg && msg.indexOf('ELECTION!') >= 0){
                this.emit('election', msg.toString('ascii'),info)

            } else if(msg && msg.indexOf('OK') >= 0) {
                this.emit('ok', msg.toString('ascii'),info)

            } else if (msg && msg.indexOf('PROCESS') >= 0){
                this.emit('process', msg.toString('ascii'),info)

            } else {
                this.emit('message', msg.toString('ascii'),info)
            }
            
        });


        socket.on('listening', () => {
            
            const address = socket.address();

            this.host = address.address;

            this.port = address.port;
            if(globals.verbose)
                console.log(`Socket listening ${address.address}:${address.port}`);
        });

        socket.bind(PORT)

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
        
        if(globals.verbose)
            console.log(`\n------\n==> SOCKET\n==> MESSAGE: ${msg}\n==> SENDING: ${this.host}:${this.port}\n------\n`)

        this.socket.send(message, port, host,(err) => {
            // this.socket.close()
        });
    }
}