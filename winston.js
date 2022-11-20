const winston = require('winston')
const {combine,timestamp,json,prettyPrint} = winston.format

const logger = winston.createLogger({
    level:"debug",
    format:combine(timestamp(),json(),prettyPrint()),
    transports:[new winston.transports.Console()]

})
module.exports=logger

