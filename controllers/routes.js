// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");

var app = express.Router();
// Require all models
var db = require("../models");

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/section/sports").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
            .children("a")
            .attr("href");
        // result.blurb = $(this)
        //     .children("p")
        //     .text();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log("results" + dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete.. <a href='/'>home page</a>" );
    });
  });

// Route for getting all Articles from the db
  app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(data) {
        var hbsObject = {
          scrapes: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  
//Deletes Article
app.delete("/articles/:id", function (req, res) {

  console.log("id:"+req.params.id);
  db.Article.findByIdAndRemove(req.params.id, function (err) {
    if (err)
      res.send(err);
    else
      res.json({ message: 'Deleted!' });
  });
 });


 //Deletes All Articles
//Deletes Article
app.get("/deleteall", function (req, res) {
  db.Article.remove({}, function (err, response) {
    if (err)
      res.send(err);
    else
    console.log('collection removed'); 
    res.send(response);
  });

  db.Note.remove({}, function (err, response) {
    if (err)
      res.send(err);
    else
    console.log('collection removed'); 
    res.send(response);
  });
  
//   db.drop({}, function(err) { 
//     console.log('collection removed') 
//  });
  // db.drop({})
  //        .then(function(dbArticle) {
  //           res.json(dbArticle);
  //           })
  //            .catch(function(err) {
  //            res.json(err);
  //           })
    });


 //Changes the Saved Field
 app.post("/articles/saved/:id", function (req, res) {
    db.Article.findByIdAndUpdate({_id: req.params.id}, { saved: true })
     .then(function(dbArticle) {
       res.json(dbArticle);
     })
     .catch(function(err) {
       res.json(err);
     })
  });


//  app.get("/deleteall", function(req, res) {
//       console.log("DELETE ALL BUTTON");
//      db.Article.remove({})
//       .then(function(dbArticle) {
//          res.json(dbArticle);
//          })
//           .catch(function(err) {
//           res.json(err);
//          })
//      });


//Gets the Saved Articles
  app.get("/saved", function(req, res) {
    db.Article.find({saved:true})
    .then(function(data) {
      var hbsObject = {
        scrapes: data
      };
      console.log("SAVED DATA:" + hbsObject);
      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    })
  })


  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

  module.exports = app;