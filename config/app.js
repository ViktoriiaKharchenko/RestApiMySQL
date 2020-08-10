module.exports = {
    apiPort: 3002,
    jwt :{
        secret : 'secKey',
        tokens:{
            access:{
                type:'access',
                expiresIn: '2m',
            },
            refresh:{
                type:'refresh',
                expiresIn: '3m',
            }
        }
    },

    mysqlpass:'RootSecPass1'
};