var goodreads = require('./goodreads');
var twitter = require('./twitter');
var LINQ = require('node-linq').LINQ;

var booksWithTheStoryOf = [];
var booksWithoutTheStoryOf = [];

goodreads.setApiKey("NJqBNUurMVJ5IMT75Y3rQQ");
goodreads.setApiSecret("mqIKx9Hf9RHoAiyaN9CZTaNCdz4WYGljKFG3wukNGSs");

var GetBookTitles = function(query){
    var bookObjects = [];
    
    aggregateBookObjects(0, 5, function(results) { postNewMemoir(results) });
    
    function aggregateBookObjects(min, max, next){
        if(min < max){
            // There are approximagely 3479 pages of data from this search on goodreads currently 
            var randomPage = Math.floor(Math.random() * 3475);
            
            goodreads.searchForBooks(query, randomPage, "title", function(bookResults){
                var resultObjects = bookResults.GoodreadsResponse.search[0].results[0].work;
                bookObjects = bookObjects.concat(resultObjects);
                //console.log("book objects count: " + bookObjects.length);
                
                aggregateBookObjects(min + 1, max, next);
            });
        }
        else{
            next(bookObjects);
        }
    }
};

var postNewMemoir = function(bookObjects, query){
    
    booksWithTheStoryOf = new LINQ(bookObjects)
                                .Where(function(item) { return typeof item !== 'undefined'; } )
                                .Where(function(item) { return item.best_book[0].title[0].toLowerCase().indexOf("story of") != -1; })
                                .Where(function(item) { return item.best_book[0].title[0].indexOf(":") == -1 })
                                .SelectMany( function(item) { return item.best_book[0].title[0]; })
                                .SelectMany(function(item) { return item.substring(item.toLowerCase().indexOf("the story of"), item.length); }) 
                                .ToArray();

    booksWithoutTheStoryOf = new LINQ(bookObjects)
                                .Where(function(item) { return typeof item !== 'undefined'; } )
                                .Where(function(item) { return item.best_book[0].title[0].toLowerCase().indexOf("the story of") == -1 })
                                .Where(function(item) { return item.best_book[0].title[0].indexOf(":") == -1 })
                                .SelectMany( function(item) { return item.best_book[0].title[0]; })
                                .ToArray();



    //console.log("Array length  1: " + booksWithTheStoryOf.length);
    //console.log("Array length  2: " + booksWithoutTheStoryOf.length);

    var withoutStoryOfString = booksWithoutTheStoryOf[Math.floor(Math.random() * booksWithoutTheStoryOf.length)];
    var storyOfString = booksWithTheStoryOf[Math.floor(Math.random() * booksWithTheStoryOf.length)];
    
    //console.log(MakeMemoirTitle(withoutStoryOfString, storyOfString));
    twitter.postToTwitter(MakeMemoirTitle(withoutStoryOfString, storyOfString));        
};

var MakeMemoirTitle = function(blank, theStoryOf){
    return (blank + ": "  + theStoryOf);
};

// Try to retweet something as soon as we run the program...
//GetBookTitles("The Story of");
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 15 = 0.25 hour --> 1000 * 60 * 15
setInterval(function(){ GetBookTitles("The Story of")}, 1000 * 60 * 15);
    
