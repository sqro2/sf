var validator =  {
    init : function(src,callback){
           if(src){
                var urls = src.match(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}/gi);

                if(!(urls && urls.length>0)){
                        callback(false);

                   }else{
                        callback(urls);
                   }              
               }else{
                     callback(false);
               }

          }
}

module.exports = validator;