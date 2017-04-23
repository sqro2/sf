#! /usr/bin/env node

const path          = require("path");
const readline      = require("readline");
const fs            = require("fs");
const os            = require("os");
const claP          = require(path.join(__dirname,'/core_modules/claParser')).init();
const dirH          = require(path.join(__dirname,'/core_modules/dirHandler'));
const urlVl         = require(path.join(__dirname,'/core_modules/urlValidator')).init;
const processor     = require(path.join(__dirname,'/core_modules/processor'));
const logger        = require(path.join(__dirname,'/core_modules/logger.js')).init();

dirH.init();
var rl = readline.createInterface({
         input : process.stdin,
         output: process.stdout,
         terminal:false
})

var rlAssist = {
    getInput : function(){
                 var that = this;
                 rl.question("->enter the path to the file containing urls :\n",function(ans){
                         if(ans.length>0){
                                  that.key = ans;  
                                  that.getConfirm();
                                }else{
                                    that.getInput();
                                }
                    })
       },
    getConfirm :function(){
                  var that = this;
                  rl.question("->press 'y' to continue 'c' to cancel\n",function(ans){
                     switch(ans){
                         case 'y':
                             if(that.isValidSysPath(that.key)){
                                  that.forWard(that.key);
                             }else{
                                  logger.warn("file not found");
                                  that.getInput();
                             }
                             break;
                         case 'c':
                             rl.close();
                             break;
                         default:
                             that.getConfirm();
                     }
                  })
    },
    isValidSysPath : function(path){
                      var fExist = (fs.existsSync(path))?true:false;
                      return(fExist);
    },
    
    isValidUri     : function(path){
                      var success;
                      urlVl(path,function(data){
                            success = (data)?true:false;
                      })
                      return success;
    },
    
    
    forWard     : function(data,target,type){
                   switch(type){
                       case "link":
                           processor.init(data,target);
                           break;
                       case "dir":
                           var payload = fs.readFileSync(data,"utf8");
                               urlVl(payload,function(data){
                                    if(data){
                                        processor.init(data,target);
                                    }else{
                                        logger.error("no urls found");
                                       // rlAssist.getInput();
                                         process.exit(1);
                                    }
                               })
                           break;
                   }
    }
}

var kickStart = function(){
    if(process.argv.length>=3){
       if(claP.dir || claP.link){
           
           if(claP.dir){
                if(rlAssist.isValidSysPath(claP.dir)){
                     var targetDir = claP.project || false;//(process.argv[3])?process.argv[3]:false;
                     rlAssist.forWard(claP.dir,targetDir,"dir"); 
                  }else{
                     logger.warn("file not found");
                     //rlAssist.getInput();  
                      process.exit(1);
                  }              
           }
           
           if(claP.link){
                   if(rlAssist.isValidUri(claP.link)){
                          var targetDir = claP.project || false;//(process.argv[3])?process.argv[3]:false;
                          rlAssist.forWard(claP.link,targetDir,"link");                    
                   }else{
                       logger.warn("invalid url");
                       process.exit(1);
                   }   
           }

       }else{
          logger.verbose("->invalid arguments. Enter sf -h for help\n");
       } 
        
    }else{
       rlAssist.getInput();
    }

}()

