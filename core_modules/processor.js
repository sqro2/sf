const request         = require("request");
const parseHttpHeader = require('parse-http-header');
const fs              = require("fs");
const dirH            = require(__dirname+"/dirHandler.js");
const logger          = require(__dirname+"/logger.js").init();
const randStr         = require("randomstring");
const progressBar     = require("progress");

const processor = {
    init : function(urlArray,target){

           this.urlBuffer = (urlArray.constructor === Array)?urlArray:new Array(urlArray);
           this.queuePointer= 0;
           this.optStat = {errCount:0,succsCount:0,destDir:null};
           this.metaInfo = {};
           this.buildTargetEnv(target);
           this.buildExports();
           this.setEventHandlers.process(this); 
    },
    buildTargetEnv : function(target){
           var currDownDir = (target)?target:"default";
               dirH.setCurrDownDir(currDownDir);  
               this.optStat.destDir = dirH.sessionDownDir;
    },
    buildExports : function(callback){
         // var i;
          var that = this;
          var randId    = randStr.generate(7);
          var getHeader = function(callback){
                  if(that.urlBuffer.length !== that.queuePointer){
                       request.head(that.urlBuffer[that.queuePointer])
                        .on("error",function(err){
                              logger.error(err);
                              that.optStat.errCount+=1;
                                              
                          })
                        .on("response",function(res){
                             if(res.statusCode==200){
                                     res.on("end",function(){
                                        var mDataTemp = {
                                           url          : res.request.uri.href,
                                           bytesWritten :0,
                                           payload      : res.headers,
                                           resume       : (res.headers['accept-ranges']!=='none')?true:false,
                                           range        : "bytes=0-",
                                       }
                                       that.buildMetaData(mDataTemp); 
                                       that.prepReq();                       
                                   })                               
                             }else{
                                 logger.warn("url is not reachable. moving to next");
                                 that.toNext();
                             }
                      })              
                  }else{
                      process.exit();
                  }
           
             }()
    },
    
    getExist : function(callback){

               if(fs.existsSync(this.metaInfo.currOp.absPath)){
                   var tempFileBuf = fs.readFileSync(this.metaInfo.currOp.absPath);
                   const offSet   = parseInt(tempFileBuf.length);
                   this.metaInfo.currOp.bytesWritten = tempFileBuf.length;
                   this.metaInfo.currOp.fOffset = offSet;
                   
                   if(tempFileBuf.length == this.metaInfo.currOp.dataLen){
                      callback({exist:true,code:"00"});
                   }else{
                       this.metaInfo.currOp.range = "bytes="+tempFileBuf.length+"-"
                       callback({exist:true,code:'01'});
                   }
               }else{
                   //console.log(this.metaInfo.currOp.resume);
                   //process.exit();
                   callback({exist:false,code:'11'});
               }
    },
    
    prepReq : function(){
                  var that = this;
                  var wStreamPath = dirH.getCurrDownloadDir(that.metaInfo.currOp.file_type)+"/";
                  var absStreamPath= wStreamPath+this.metaInfo.currOp.file_id;
                  this.metaInfo.currOp.absPath = absStreamPath;

                  that.getExist(function(result){
                        if(result.exist){
                            switch(result.code){
                                case "01":
                                    logger.warn("file is broken. resuming");
                                    that.mkReq();
                                    break;
                                case "00":
                                    logger.warn("file already exists. moving on to next");
                                    that.toNext();
                                    break;
                                    

                            }
                        }else{
                             that.mkReq();
                        }
                  })


    },
    
    buildMetaData : function(data){
                     var urlPaths     = data.url.split("/");
                     var urlEndNode   = urlPaths[urlPaths.length-1];
                     var content_format = ((parseHttpHeader(data.payload['content-type'])[0]).split("/"))[1];
                     var content_type = ((parseHttpHeader(data.payload['content-type'])[0]).split("/"))[0];
                    
                     var content_id   = (parseHttpHeader(data.payload['content-disposition'])['filename'])?parseHttpHeader(data.payload['content-disposition'])['filename']:urlEndNode;
                     var content_len  = parseHttpHeader(data.payload['content-length'])[0];
                     var metaTemp = {
                         url    : data.url,
                         format : content_format,
                         file_id: content_id,
                         file_type: content_type,
                         dataLen: content_len,
                         bytesWritten:data.bytesWritten,
                         resume : data.resume,
                     }
                     this.metaInfo.currOp = metaTemp;
            
                     

    },
    
    mkReq    : function(){
                  var that = this;
                  var cLen = that.metaInfo.currOp.bytesWritten;
                  var packetCount = 0;
                  var writeStream = fs.createWriteStream(that.metaInfo.currOp.absPath,{flags:"a"});
                  var opts = {
                               url : that.metaInfo.currOp.url,
                               headers : {
                                    'Range' : this.metaInfo.currOp.range, 
                                  }
                              }
                  var getOpts = (that.metaInfo.currOp.resume)?opts:that.metaInfo.currOp.url;
                      request.get(getOpts)
                        .on('error',function(err){
                          logger.error(err);
                          that.optStat.errCount+=1;

                        })
                        .on('response',function(res){
                          var log = "downloading "+that.metaInfo.currOp.file_id;
                          logger.info(log);
                          that.setEventHandlers.stream(that.metaInfo.currOp.dataLen);
                          res
                          .on('data',function(chunk){
                                  var packetLen = (cLen>0 && packetCount==0)?chunk.length+that.metaInfo.currOp.fOffset:chunk.length;
                                  that.setEventHandlers.cogs.bar.tick(packetLen);
                                  that.metaInfo.currOp.bytesWritten+=chunk.length;
                                  packetCount+=1;
                                  //console.log(packetCount);
                               })

                           .on('end',function(){
                                var log = "finished writting :"+that.metaInfo.currOp.file_id;
                                that.optStat.succsCount+=1;
                                logger.success(log);
                                that.toNext();
                               })

                           })
                          .pipe(writeStream);             
        
    },
    
    toNext : function(){
               this.queuePointer+=1;
               this.buildExports();
    },
    
    setEventHandlers : {
               
               process : function($this){
                          var that = this;
                          process.on("exit",function(){
                              var grammerProt0 = that.cogs.wordSmith($this.optStat.errCount,"error");
                              var grammerProt1 = that.cogs.wordSmith($this.optStat.succsCount,"operation");
                            
                              var exitLog0 = "download location : "+$this.optStat.destDir;
                              var exitLog1 = "process fininshed with "+$this.optStat.errCount+" "+" "+grammerProt0+" & "+$this.optStat.succsCount+" sucessful "+grammerProt1+"\n";

                              logger.info(exitLog0);
                              logger.info(exitLog1);
                           });    
                          process.on("SIGINT",function(){

                              var errLog = "process was terminated. bytes written : "+$this.metaInfo.currOp.bytesWritten;
                               $this.optStat.errCount+=1;
                               logger.error(errLog);
                               process.exit();
                          })
               },
               stream  : function(len){
                              var bar = new progressBar(' [:bar] :percent :etas', {
                                complete: '=',
                                incomplete: ' ',
                                width: 20,
                                total: parseInt(len)
                              });  
                             this.cogs.bar = bar;
                            
                   },
              cogs : {
                  
                  wordSmith : function(count,word){
                        var wOptimized = (count>1)?word+"s":word;
                        return wOptimized;
                  }
              }
               
              
        },

    
    
        
    
}

module.exports = processor;