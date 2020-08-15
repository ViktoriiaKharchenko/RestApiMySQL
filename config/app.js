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
    }



    // apiPort: 3002,
    // //mongoUri: 'mongodb://127.0.0.1:27017/EntSiteDatabase',
    // jwtSecret: 'secKey',
    // mysqlpass:'MakeMoreRobots'
 };