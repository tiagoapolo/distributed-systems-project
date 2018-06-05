const Multicast = require('./multicast')
const globals = require('./config')

const RingElection = class {
    constructor(id){
        
        this.members = []
        this.leader = null
        this.id = id        

        this.multicast = new Multicast(globals.mainHostGA, globals.mainPortGA)        

        this.multicast.on('whois', (whois, info) => {
            this.multicast.send('IAM!:'+this.id, info.address, info.port)            
        })

    }
    
    addMember(member){
        
        if(member <= this.id) return;

        if(!this.members.find((storedMember) => { return (storedMember === member) })){
            this.members.push(member) 
            this.members.sort((a, b) => b - a)
        }            
    }

    callElection(){
        
        this.multicast.on('iam', (iam, info) => {
            this.addMember(parseInt(iam.split(':')[1]))
        })
        
        this.callMembers()
        // this.members.filter(member =>  member.id > this.id).map((member) => {                         
        // this.multicast.send('WHOIS?:'+45)             
        // })
    }

    callMembers(){
        this.multicast.send('WHOIS?')             
    }
    
    getMembers(){
        return this.members
    }

}

module.exports = RingElection

