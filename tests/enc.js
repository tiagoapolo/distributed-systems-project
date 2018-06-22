var Secret = require('../modules/secret')

let secret = new Secret(11, 259, 59)
let ee = secret.enc('abacate xuxu')
let vv = secret.dec(ee)

console.log(ee)
console.log(vv)