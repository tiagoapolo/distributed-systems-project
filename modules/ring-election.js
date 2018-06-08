const EventEmitter = require('events')
const util = require('util')
const udpSocket = require('../modules/udpSocket')
const Multicast = require('./multicast')
const globals = require('./config')
const onChange = require('./observeObject')

const electionTimeout = 5000
const messageTimeout = 10000

const RingElection = class extends EventEmitter {
    constructor(id){
        
        // Calling the Godfather

        super()

        // Initializing class

        this.members = []
        this.leader = null
        this.id = id                
        this.membersObservable = null
        this.messageTimeout = null
        this.leaderEmitter = null

        this.socket  = new udpSocket()
        this.multicast = new Multicast(globals.mainHostGA, globals.mainPortGA) 
        
        // Registering events

        this.multicast.on('whois', (whois, info) => {
            this.multicast.send('IAM!:'+this.id+':'+this.socket.host+':'+this.socket.port)            
        })

        this.multicast.on('leader', (leader, info) => {
            
            this. leader = {}
            let splitted = leader.split(':')
            
            this.leader.id = parseInt(splitted[1])
            this.leader.address = parseInt(splitted[2])
            this.leader.port = parseInt(splitted[3])

        })

        this.multicast.on('leaderwho', (msg, info) => {
            console.log('\n\nCALLED WHOO')
            this.leader ? this.multicast.send('LEADER!:'+this.leader.id+':'+this.leader.address+':'+this.leader.port) : null
        })

        this.socket.on('election', (msg, info) => {          
            this.socket.send('OK', info.address, info.port)                
            this.emit('election', msg)
        })

        this.socket.on('ok', (msg, info) => {
            this.membersObservable = null    
            this.members = []
            clearTimeout(this.messageTimeout)                  
            this.emit('ok', msg)
        })

        this.socket.on('process', (msg, info) => {
            console.log(`\n------\n==> RECEIVED RESPONSE\nFROM: ${this.leader.address}:${this.leader.port}\n------\n`)
            this.socket.send('OK', info.address, info.port)      
            this.emit('process', msg, info)
        })
        

    }
    
    addMember(member){
        
        if(member.id <= this.id) return;

        if(this.membersObservable && !this.membersObservable.find((storedMember) => { return (storedMember.id === member.id) })){
            this.membersObservable.push(member) 
            this.membersObservable.sort((a, b) => b.id - a.id)
        }            
    }

    callElection(){

        this.leader = null    

        this.membersObservable = onChange(this.members, (added) => {
            if(this.socket){
                this.socket.send('ELECTION!', added.address, added.port)
            }               
        })

        this.messageTimeout = setTimeout(() => {             
            this.leader = this.id; this.multicast.send('LEADER!:'+this.id+':'+this.socket.host+':'+this.socket.port); 
        }, electionTimeout)

        this.multicast.on('iam', (iam, info) => {
            let member = iam.split(':')
            this.addMember({ id: parseInt(member[1]), address: member[2], port: parseInt(member[3]) })
        })
        
        this.whois()
        
    }

    whois(){
        this.multicast.send('WHOIS?')             
    }
    
    getMembers(){
        return this.membersObservable
    }    

    sendToLeader(object){
        if(!this.leader)
            return false
        
        this.socket.send("PROCESS:"+JSON.stringify(object), this.leader.address, this.leader.port)
        console.log(`\n------\n==> WAITING RESPONSE\nFROM: ${this.leader.address}:${this.leader.port}\nTIMEOUT: ${messageTimeout} ms\n------\n`)

        this.messageTimeout = setTimeout(() => { this.emit('election') }, messageTimeout)
    }

    leaderWho(){
        this.multicast.send('LEADERWHO')
    }

}

module.exports = RingElection

