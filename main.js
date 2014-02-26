var goodreads = require('./goodreads');
var twitter = require('./twitter');
var LINQ = require('node-linq').LINQ;

var booksWithTheStoryOf = [];
var booksWithoutTheStoryOf = [];

goodreads.setApiKey("NJqBNUurMVJ5IMT75Y3rQQ");
goodreads.setApiSecret("mqIKx9Hf9RHoAiyaN9CZTaNCdz4WYGljKFG3wukNGSs");

var postNewMemoir = function(){
    
    goodreads.searchForBooks("the story of", null, "title", function(bookResults){

        var bookObjects = bookResults.GoodreadsResponse.search[0].results[0].work;

        booksWithTheStoryOf = new LINQ(bookObjects)
                                    .Where(function(item) { return item.best_book[0].title[0].toLowerCase().indexOf("story of") != -1 })
                                    .SelectMany( function(item) { return item.best_book[0].title[0]; })
                                    .ToArray();

        booksWithoutTheStoryOf = new LINQ(bookObjects)
                                    .Where(function(item) { return item.best_book[0].title[0].toLowerCase().indexOf("story of") == -1 })
                                    .SelectMany( function(item) { return item.best_book[0].title[0]; })
                                    .ToArray();



        console.log("Array length  1: " + booksWithTheStoryOf.length);
        console.log("Array length  2: " + booksWithoutTheStoryOf.length);
        
        var randomStoryOf = booksWithTheStoryOf[Math.floor(Math.random() * booksWithTheStoryOf.length)];

        if(randomStoryOf.indexOf(": The")){
            twitter.postToTwitter(MakeMemoirTitle(true, randomStoryOf));
        }
        else{
            twitter.postToTwitter(MakeMemoirTitle(false, randomStoryOf));
        }
    })
};

var MakeMemoirTitle = function(replacingFirstPart, title){

    var randomWithoutTheStoryOfTitleBro = booksWithoutTheStoryOf[Math.floor(Math.random() * booksWithoutTheStoryOf.length)];
    var theStoryOfSubstring = title.substring(title.indexOf("The Story"), title.length);
    
    return (randomWithoutTheStoryOfTitleBro + ": "  + theStoryOfSubstring);
};

// Try to retweet something as soon as we run the program...
postNewMemoir();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(postNewMemoir, 1000 * 60 * 60);
    
