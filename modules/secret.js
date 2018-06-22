var Big = require('../modules/big')

module.exports = class Secret {
    constructor(exponent, prodPrim, privKey){
        this.exponent = exponent
        this.prodPrim = prodPrim
        this.privKey = privKey
    }

    enc(text){
        return text.split('').map(chr => {            
            let i = chr.charCodeAt(0)
            let z = new Big(i)
            let y =  z.pow(this.exponent).mod(this.prodPrim)
            return String.fromCharCode(y)
        }).join('')
    }

    dec(text){
        return text.split('').map(chr => {
            let y = chr.charCodeAt(0)
            let z = new Big(y)            
            let x = z.pow(this.privKey).mod(this.prodPrim)
            return String.fromCharCode(x)
        }).join('')
    }

}