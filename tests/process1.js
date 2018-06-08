var Multicast = require('../modules/multicast');
var udpSocket = require('../modules/udpSocket')
var RingElection = require('../modules/ring-election')

// let udp = new udpSocket()
let ring = new RingElection(1)

ring.callElection()
ring.on('election', (msg) => {
    ring.callElection()
})

// ring.on('leader', (msg) => {
//     console.log('Leader is ' msg)
// })

// setInterval(() => {
//     console.log(ring.getMembers())
// }, 2000)

setTimeout(() => {
    ring.sendToLeader({message: 'doido'})
}, 18000)

// setInterval(() => {
//     ring.callElection()
// }, 5000)

