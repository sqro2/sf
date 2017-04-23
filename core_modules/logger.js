const fs      = require("fs");
const dirH    = require(__dirname+"/dirHandler.js");
const chalk   = require("chalk");

var logModule = {
    init  : function(){
            return this.logger;
            
    },

    logger : {
        verbose : function(msg){
                   console.log(chalk.green("->"+msg+"\n"));
        },
        info : function(msg){
               var log = this.buildMsg("info",msg);
               fs.writeFileSync(dirH.runTime,log,{flag:"a"});
               console.info(chalk.green("->"+msg+"\n"));
        },
        warn : function(msg){
               var log = this.buildMsg("warn",msg);
               fs.writeFileSync(dirH.runTime,log,{flag:"a"});
               console.warn(chalk.yellow("->WARNING: "+msg+"\n"));
        },
        error : function(msg){
               var log = this.buildMsg("error",msg);
               fs.writeFileSync(dirH.runTime,log,{flag:"a"});
               console.error(chalk.red("\n->ERROR: "+msg+"\n"));
        },
        success : function(msg){
               var log = this.buildMsg("success",msg);
               fs.writeFileSync(dirH.runTime,log,{flag:"a"});
               fs.writeFileSync(dirH.out,log,{flag:"a"});
               console.info(chalk.cyan("->"+msg+"\n"));
        },
        
        buildMsg : function(level,msg){
                   var tStamp  = new Date();
                   var jsonStr = '{"level":"'+level+'","message":"'+msg+'","timestamp":"'+tStamp+'"}\n';
                   return(jsonStr);
        }
    }
}

module.exports = logModule;