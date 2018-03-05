var topics = ["michael bluth", "george bluth", "lucille bluth", "gob bluth", "lindsay fünke", "buster bluth", "george michael bluth", "maeby fünke", "tobias fünke", "oscar bluth"];

var currIndex = topics.length,
                    temporaryValue, randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currIndex);
                    currIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = topics[currIndex];
                    topics[currIndex] = topics[randomIndex];
                    topics[randomIndex] = temporaryValue;
                }

function renderButtons() {

    $("#button-holder").empty();
    $.each(topics, function(item, value) {
        var btn = $("<button>");
        // Adding a class
        btn.addClass("topic");
        // Adding a data-attribute with a value of the movie at index i
        btn.attr("data-topic", value);
        // Providing the button's text with a value of the movie at index i
        btn.text(value);
        // Adding the button to the HTML
        $("#button-holder").append(btn);
    })
    // Looping through the array of movies
}

// This function handles events where one button is clicked
$("#add-topic").on("click", function() {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box
    var newTopic = $("#topic-input").val().trim().toLowerCase();
    // The movie from the textbox is then added to our array
    if (newTopic != "") {
        topics.push(newTopic);
    }
    // calling renderButtons which handles the processing of our movie array
    renderButtons();
    $("#topic-input").val("");
});

$("#clear-gifs").on("click", function() {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    $("#gif-holder, #magic").empty();
});

$("#start-over").on("click", function() {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    location.reload();
});

$(document).on("click", "button", function() {
    $("#gif-holder").empty();
    // In this case, the "this" keyword refers to the button that was clicked
    var topic = $(this).attr("data-topic");

    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?&api_key=h960leoNLQpERdKx2nmsO7RgvQdUpjZ8&limit=10&rating=pg&q=" +
        topic;

    // Performing our AJAX GET request
    $.get(queryURL).then(function(response) {
        // Storing an array of results in the results variable
        var results = response.data;
        console.log(response);

        // Looping over every result item
        for (var i = 0; i < results.length; i++) {

            var gifDivHolder = $("<div class='item-holder'>");

            // Creating a div with the class "item"
            var gifDiv = $("<div class='item'>");

            // Storing the result item's rating
            var rating = results[i].rating;

            // Creating a paragraph tag with the result item's rating
            var p = $("<p class='item-text'>").text("Rating: " + rating.toUpperCase());

            // Creating an image tag
            var topicImage = $("<img class='gif'>");


            // Giving the image tag an src attribute of a proprty pulled off the
            // result item
            topicImage.attr("src", results[i].images.original_still.url);
            topicImage.attr("data-still", results[i].images.original_still.url);
            topicImage.attr("data-animate", results[i].images.original.url);
            topicImage.attr("data-state", "still");
            topicImage.attr("alt", results[i].title);

            // Appending the paragraph and personImage we created to the "gifDiv" div we created
            gifDiv.append(topicImage);
            gifDivHolder.append(p).append(gifDiv);

            // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
            $("#gif-holder").prepend(gifDivHolder);
        }
        $("#magic").text("Click on the gif to see the magic!");
    });
});

$(document).on("click", ".gif", function() {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

// Calling the renderButtons function at least once to display the initial list of movies
renderButtons();