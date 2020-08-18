module.exports = {

    jwt :{
        tokens:{
            access:{
                type:'access',
                expiresIn: '20m',
            },
            refresh:{
                type:'refresh',
                expiresIn: '7d',
            }
        }
    },
    clientUrl: 'localhost3000/'
 };