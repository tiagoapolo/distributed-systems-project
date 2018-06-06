const EventEmitter = require('events')
const util = require('util')
const udpSocket = require('../modules/udpSocket')
const Multicast = require('./multicast')
const globals = require('./config')

const onChange = require('./observeObject')

const RingElection = class extends EventEmitter {
    constructor(id){
        
        // Calling the Godfather

        super()

        // Initializing class

        this.members = []
        this.leader = null
        this.id = id                
        this.membersObservable = null
        this.electionTimeout = null
        this.leaderEmitter = null

        this.socket  = new udpSocket()
        this.multicast = new Multicast(globals.mainHostGA, globals.mainPortGA) 
        
        // Registering events

        this.multicast.on('whois', (whois, info) => {
            this.multicast.send('IAM!:'+this.id+':'+this.socket.host+':'+this.socket.port)            
        })

        this.multicast.on('leader', (leader, info) => {
            this.leader = parseInt(leader.split(':')[1])
        })

        // this.socket.on('message', (msg) => {
        //     console.log(`PROCESS ${this.id} => ${msg}`)
        // })

        this.socket.on('election', (msg, info) => {    
            this.socket.send('OK', info.address, info.port)                
            this.emit('election', msg)
        })

        this.socket.on('ok', (msg, info) => {
            this.membersObservable = null    
            clearTimeout(this.electionTimeout)       
            this.emit('ok', msg)
        })

        this.leaderEmitter = setInterval(() => {
            if(this.leader && this.leader == this.id){
                this.multicast.send('LEADER!:'+this.id)
            }
        }, 10000)

    }
    
    addMember(member){
        
        if(member.id <= this.id) return;

        if(this.membersObservable && !this.membersObservable.find((storedMember) => { return (storedMember.id === member.id) })){
            this.membersObservable.push(member) 
            this.membersObservable.sort((a, b) => b.id - a.id)
        }            
    }

    callElection(){

        this.electionTimeout = setTimeout(() => { this.leader = this.id; }, 5000)

        this.membersObservable = onChange(this.members, (added) => {
            if(this.socket){
                this.socket.send('ELECTION!', added.address, added.port)
            }               
        })
        
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

    

}

module.exports = RingElection

