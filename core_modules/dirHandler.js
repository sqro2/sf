const fs = require("fs");
const os = require("os");

var homeDir = os.homedir();
var appRootDir = homeDir+"/sfDownloader";


var dirHandler = {
       init : function(){
              this.appRoot = appRootDir;
              this.homeDir = homeDir;
              this.makeDir(appRootDir);
              this.makeDir(appRootDir+"/downloads");
              this.makeDir(appRootDir+"/logs");
              this.makeFile(appRootDir+"/logs/runtime.log");
              this.makeFile(appRootDir+"/logs/out.log");
              this.downloadDir = appRootDir+"/downloads/";
              this.runTime = appRootDir+"/logs/runtime.log";
              this.out  = appRootDir+"/logs/out.log";
       },
       setCurrDownDir : function(path){
              this.makeDir(this.downloadDir+path);  
              this.sessionDownDir = this.downloadDir+path+"/";
       },
       makeDir : function(path){
                 if(!fs.existsSync(path)){
                     fs.mkdirSync(path);
                 }
       },
       makeFile : function(path){
                 if(!fs.existsSync(path)){
                      fs.writeFileSync(path,"#000#\n");
                 }
       },
       getCurrDownloadDir : function(typeInfo){
                 switch(typeInfo.toLowerCase()){
                     case "image":
                         var imgDir = this.sessionDownDir+"Images"; 
                         this.makeDir(imgDir);
                         return imgDir;
                         break;
                     case "text":
                         var docDir = this.sessionDownDir+"Docs"; 
                         this.makeDir(docDir);
                         return docDir;
                         break;
                     case "video":
                         var vidDir = this.sessionDownDir+"Videos";
                         this.makeDir(vidDir);
                         return vidDir;
                         break;
                     case "audio":
                         var audDir = this.sessionDownDir+"Music";
                         this.makeDir(audDir);
                         return audDir;
                         break;
                     case "application":
                         var audDir = this.sessionDownDir+"Apps";
                         this.makeDir(audDir);
                         return audDir;
                         break;
                     default:
                         var othDir = this.sessionDownDir+"Other";
                         this.makeDir();
                         return othDir;
                         
                         
                 }      
       }
}

module.exports = dirHandler;