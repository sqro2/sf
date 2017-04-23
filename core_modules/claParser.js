const cla = require("command-line-args");

var claP = {
    init : function(){
           this.setOptions();
           var clo = cla(this.optDef,{partial:true});
           return clo;
    },
    setOptions: function(){
           var optDef = [
               {name:"link",alias:"l",type:String},
               {name:"dir",alias:"d",type:String},
               {name:"project",alias:"p",type:String}
               
           ];
           this.optDef = optDef;
    }
}

module.exports = claP;