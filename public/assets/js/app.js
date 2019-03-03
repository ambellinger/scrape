
//Get all the articles for the home page and for the saved article page
$.getJSON("/articles", function (data) {

  for (var i = 0; i < data.length; i++) {
    
    if (data[i].saved) {
    // Display the apropos information on the page
    $("#savedarticles").append("<div class='alert alert-primary'> <a href='https://www.nytimes.com" + data[i].link + "' target='_blank'>" +  data[i].title + "</a>"
    + "<button class='deletebtn btn btn-light' data-id='" + data[i]._id + "'  > Delete Article </button>" 
    + "<button type='button' data-id='" + data[i]._id + "' class='notesbtn btn btn-primary ' data-toggle='modal' data-target='#exampleModal'> Note</button>" 
    + "   "  + "</div>");
  } else  {
    
     // Display the apropos information on the page
     $("#articles").append("<p class='alert alert-primary' data-id='"+ data[i]._id+ "'> <a href='" + data[i].link + "' target='_blank'>" +  data[i].title + "</a>"
     + "<button class='deletebtn btn btn-light' data-id='" + data[i]._id + "' > Delete Article.. </button>" 
     + "<button class='savedbtn btn btn-info' data-id='" + data[i]._id + "'  > Save Article </button>" );
    }
  }
  });
  
  function getNotes() {
    $.getJSON("/allnotes", function(data) {
  
      $("#notes").append("<p class='previousNotes'> Previous Notes</p> <ul class='list-group list-group-flush'>");
      // For each note...
      for (var i = 0; i < data.length; i++) {
        // ...populate #results with a p-tag that includes the note's title and object id
        $("#notes").append(" <li class='list-group-item data-entry'  p id='previousNotes'  ' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
          data[i]._id + ">" + data[i].title + "</span><button class='btn btn-info deletenote'  > Delete Note </button></p></li>");
  }
    });
  };
  
  //NOTES
  // Whenever someone clicks a p tag
  $(document).on("click", ".notesbtn", function () {
    // $(".modal").show();
    // // <!-- Modal -->
    // alert("hi");
    // Empty the notes from the note section
     $("#notes").empty();
     getNotes();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
  
        console.log(data);
  
  
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
  
        // for (var i = 0; i < data.length; i++) {
        //   // Display the apropos information on the page
        //   $("#notes").append("Previous Notes" );
        // }
  
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' placeholder='Title of Note'>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Write Your Note Here'>" + "Write Your Note Here"+ "</textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");
      
  
      
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // alert("hi");
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
        
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
         $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  
  
  // When you click the delete button
  $(document).on("click", ".deletebtn", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
   //alert(thisId );
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "DELETE",
      url: "/delete/" + thisId
  
    })
      // With that done
      .then(function (data) {
      location.reload(); 
      });
  
    });
  
  // When you click the save article button
  $(document).on("click", ".savedbtn",   function () {
    //alert("saved button was clicked");
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
     $.ajax({
       method: "POST",
       url: "/articles/saved/" + thisId
  
     })
       // With that done
       .then(function (data) {
         location.reload(); 
  
       });
    });
  
  
  // When you click the delete all articles button
  $(document).on("click", ".deleteall", function () {
    console.log("clicked delete all button");
  
    $.ajax({
      method: "GET",
      dataType: "json",
      url: "/deleteall",
  
      success: function(response) {
        $("#articles").empty();
        $("#savedarticles").empty();
        $("#notes").empty();
      }
    })
        .then(function (data) {
          console.log("ajax call went thru")
       // location.reload(); 
        });
  
    });
  
  
  $(document).on("click", ".deletenote", function() {
      // Save the p tag that encloses the button
      var thisId = $(this).attr("data-id");
      console.log(thisId);
      // Make an AJAX GET request to delete the specific note
      // this uses the data-id of the p-tag, which is linked to the specific note
      $.ajax({
        type: "DELETE",
        url: "/delete/" + thisId,
      // })
      // With that done
  
        // // On successful call
        success: function(response) {
          console("Success")
           // Remove the p-tag from the DOM
           //thisId.remove();
           // Clear the note and title inputs
           $("#note").val("");
           $("#title").val("");
           // Make sure the #action-button is submit (in case it's update)
           $("#action-button").html("<button id='make-new'>Submit</button>");
        }
       })
       
       .then(function (data) {
        location.reload(); 
        });
     });