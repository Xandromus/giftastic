var topics = ["nerds", "dorks", "dweebs"];

function renderButtons() {

    $("#button-holder").empty();
    $.each(topics, function(item, value) {
        var a = $("<button>");
        // Adding a class
        a.addClass("topic");
        // Adding a data-attribute with a value of the movie at index i
        a.attr("data-topic", value);
        // Providing the button's text with a value of the movie at index i
        a.text(value);
        // Adding the button to the HTML
        $("#button-holder").append(a);
    })
    // Looping through the array of movies
}

// This function handles events where one button is clicked
$("#add-topic").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box
    var newTopic = $("#topic-input").val().trim();
    // The movie from the textbox is then added to our array
    topics.push(newTopic);

    // calling renderButtons which handles the processing of our movie array
    renderButtons();
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

        // Looping over every result item
        for (var i = 0; i < results.length; i++) {

            // Creating a div with the class "item"
            var gifDiv = $("<div class='item'>");

            // Storing the result item's rating
            var rating = results[i].rating;

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: " + rating);

            // Creating an image tag
            var topicImage = $("<img>");

            // Giving the image tag an src attribute of a proprty pulled off the
            // result item
            topicImage.attr("src", results[i].images.fixed_height.url);

            // Appending the paragraph and personImage we created to the "gifDiv" div we created
            gifDiv.append(p);
            gifDiv.append(topicImage);

            // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
            $("#gif-holder").prepend(gifDiv);

        }
    });
});

// Calling the renderButtons function at least once to display the initial list of movies
renderButtons();