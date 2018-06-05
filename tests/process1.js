var Multicast = require('../modules/multicast');
var udpSocket = require('../modules/udpSocket')
var RingElection = require('../modules/ring-election')

let udp = new udpSocket('127.0.0.1', 8081)
let ring = new RingElection(20)

setInterval(() => {


    console.log(ring.getMembers())
}, 2000)


setInterval(() => {
    ring.callElection()
}, 10000)