const winston=require('winston');

const logger=winston.createLogger({
    level:"development",
    
    format:winston.format.combine(
        winston.format.json(),
        winston.format.splat(),
        winston.format.errors(),
        winston.format.timestamp()
    ),
defaultMeta:"library-system",
transports:[
    new winston.transports.Console(
        winston.format.combine(
            winston.format.simple(),
            winston.format.colorize()
        )
    )
]
})

module.exports=logger