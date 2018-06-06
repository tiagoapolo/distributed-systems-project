'use strict';

module.exports = (object, onChange) => {
    const handler = {
        
        get(target, property, receiver) {
            try {
                return new Proxy(target[property], handler);
            } catch (err) {
                return Reflect.get(target, property, receiver);
            }
        },
        defineProperty(target, property, descriptor) {

            console.log('\n==> defineProperty', { target: target, property: property, descriptor: descriptor })

            if(property === 'length' && descriptor.value > 0) onChange(target[descriptor.value-1]);
            return Reflect.defineProperty(target, property, descriptor);
        },
        deleteProperty(target, property) {


            // console.log('\n==> deleteProperty')

            if(property === 'length') console.log('\n==> DELETEIIIII\n')
            return Reflect.deleteProperty(target, property);
        }
    };

    return new Proxy(object, handler);
};