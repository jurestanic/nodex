const winston = require('winston');
require('express-async-errors');

module.exports = function(){
    // handla errore koji su van scopa expressa (sa expressom smo rjesili sami (error middleware i exp-async-errors))
    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    // ovo je isto kao i ovo gore, samo krace i pise ga u drugi transport log 
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'uncaughtEx.log'})
        );

    // kao i gore samo sto handla promise
    process.on('unhandledRejection', (ex) => {
    throw ex; 
    // ovo ce bit uhvaceno sa winston.handleEx sto je napisano iznad
    });

    // dodaje log file i puni ga prilikom errora
    winston.add(winston.transports.File, { filename: 'somefile.log' });

}