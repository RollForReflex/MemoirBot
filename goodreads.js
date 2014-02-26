var request = require('request');
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser();

var baseURL = "http://www.goodreads.com/",
    devKey = "",
    devSecret = "";

exports.setApiKey = function(apiKey){
    if(apiKey){
        devKey = apiKey;
    }
};

exports.setApiSecret = function(apiSecret){
    if(apiSecret){
        devSecret = apiSecret;
    }
};

exports.configure = function(apiKey, apiSecret){
    exports.setApiKey(apiKey);
    exports.setApiSecret(apiSecret);
};

exports.searchForBooks = function(query, page, field, callback){
    
    if(!devKey || !devSecret)
        throw new Error("API Key required to make requests. Call setApiKey and/or setSecretKey first");
    
    var pageParam = "", 
        fieldParam = "";
    
    if(page){
        pageParam = "&page=" + page;  
    }
    
    if(field){
        fieldParam = "&search[" + field + "]";
    }
    
    //console.log("dev key is: " + devKey);
    
    exports.sendRequest(baseURL + "search.xml?q=" + encodeURI(query) + "&key=" + devKey + pageParam + fieldParam,
                        function(body){
                            xmlParser.parseString(body, function(err, result){
                                callback(result);
                            });
                        }, function(err){
                            console.log("Error occured sending request: " + err);
                        });
};

exports.sendRequest = function(requestUrl, onSuccessCallback, onErrorCallback){
    request(requestUrl, function(error, response, body){
        if(error && onErrorCallback){
            onErrorCallback(err);
        }
        
        switch(response.statusCode){
            case 200:
                onSuccessCallback(body);
                break;
            case 401:
                throw new Error("Call to " + requestUrl + " returned a 401 (unauthorized)");
                break;
            case 404:
                throw new Error("Call to " + requestUrl + " returned a 404 (not found)");
                break;
            default:
                throw new Error("Call to " + requestUrl + " returned an unknown error");
                break;
        }
        
    });    
}



