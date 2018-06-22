var Multicast = require('../modules/multicast.js');
var udpSocket = require('../modules/udpSocket')
var RingElection = require('../modules/ring-election')


// let udp = new udpSocket('127.0.0.1', 8088)
let ring = new RingElection(3)
// ring.callElection()

ring.leaderWho()

ring.on('election', (msg) => {
    ring.callElection()
})

ring.on('deliveryError', (msg) => {
    ring.callElection()
})

ring.on('incommand', () => {
    console.log('\n\n------\n==> MESSAGE: IM IN COMMAND!\n------\n\n')
})

ring.on('process', (data) => {
    
    let token = data.split(':')[0] + ':'    
    data = data.replace(token,'')
    let package = JSON.parse(data)
    
})

setInterval(() => console.log("MEMBERS: ", ring.getMembers()), 2500)

setTimeout(()=> ring.whois(), 20000)