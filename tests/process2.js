var Multicast = require('../modules/multicast.js');
var udpSocket = require('../modules/udpSocket')
var RingElection = require('../modules/ring-election')


// let udp = new udpSocket('127.0.0.1', 8088)
let ring = new RingElection(2)


ring.on('election', (msg) => {
    ring.callElection()
})

ring.on('deliveryError', (msg) => {
    ring.callElection()
})
