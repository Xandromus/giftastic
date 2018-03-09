(function() {

    $(document).ready(function() {

        // disable hover in touch devices so that click events work
        if (!("ontouchstart" in document.documentElement)) {
            document.documentElement.className += "no-touch";
        }

        // VARIABLES

        // declare array of characters and music
        var topics = ["michael bluth", "george bluth", "lucille bluth", "gob bluth", "lindsay fünke", "buster bluth", "george michael bluth", "maeby fünke", "tobias fünke", "oscar bluth"];

        var theme = new Audio("assets/audio/adtheme.mp3");

        // shuffle array of characters so that the buttons are in a different order each time
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

        // BUTTON CREATION

        // function to render the character buttons, including new ones
        function renderButtons() {

            // empty the button area on each new render
            $("#button-holder").empty();

            // loop through the characters in the array and create their buttons
            $.each(topics, function(item, value) {
                var btn = $("<button>");

                // add a class
                btn.addClass("topic");

                // add a data-attribute with a value of the character name at each index and use it for the button text
                btn.attr("data-topic", value);
                btn.text(value);

                // add each button to the button area
                $("#button-holder").append(btn);
            })
        }

        // CLICK FUNCTIONS

        // function to add new topics
        $("#add-topic").on("click", function(event) {

            // stop the form submit
            event.preventDefault();

            // take the user input, trim the white space around the input, and make sure that the input is all lower case
            var newTopic = $("#topic-input").val().trim().toLowerCase();

            // push the new topic into the array of topics as long as it isn't empty or a repeat character
            if ((newTopic !== "") && (topics.indexOf(newTopic) === -1)) {
                topics.push(newTopic);
            }

            // re-render the buttons, including the new button
            renderButtons();

            // remove the user input from the input after the click event
            $("#topic-input").val("");
        });


        // function to clear out the gif area
        $("#clear-gifs").on("click", function(event) {

            // stop the form submit
            event.preventDefault();

            // clear the gif area
            $("#gif-holder, #magic").empty();
        });


        // function to reload the page
        $("#start-over").on("click", function() {

            // stop the form submit
            event.preventDefault();

            //reload page
            location.reload();
        });


        // API call to display gifs
        $(document).on("click", "button", function() {

            // empty gif area before adding new ones
            $("#gif-holder").empty();

            // declare variable to hold name of character from button
            var topic = $(this).attr("data-topic");

            // create variable to hold API url, including a limit of 50, a pg rating, and the character name from the button
            var queryURL = "https://api.giphy.com/v1/gifs/search?&api_key=h960leoNLQpERdKx2nmsO7RgvQdUpjZ8&limit=50&rating=pg&q=" +
                topic;

            // AJAX GET request
            $.get(queryURL).then(function(response) {

                // Storing an array of 50 results in the results variable
                var results = response.data;

                // initialize array to hold 10 of the 50 results
                var randomArray = [];

                // create 10 unique random numbers between 0 and 49 and push them into the array as long as there are no repeats
                while (randomArray.length < 10) {
                    var random = (Math.floor(Math.random() * results.length));
                    if (randomArray.indexOf(random) === -1) {
                        randomArray.push(random);
                    }
                }

                // loop through the results 10 times using the 10 random numbers in the random array to create the gifs
                for (var i = 0; i < randomArray.length; i++) {

                    // create container div for item
                    var gifDivHolder = $("<div class='item-holder'>");

                    // create a div with the class "item"
                    var gifDiv = $("<div class='item'>");

                    // store the result item's rating
                    var rating = results[randomArray[i]].rating;

                    // create a paragraph tag with the result item's rating in upper case
                    var p = $("<p class='item-text'>").text("Rating: " + rating.toUpperCase());

                    // create an image tag
                    var topicImage = $("<img class='gif'>");

                    // give the image tag src attributes for its initial image, its still image, and its animate image, add initial state of still, and add alt tag 
                    topicImage.attr("src", results[randomArray[i]].images.original_still.url);
                    topicImage.attr("data-still", results[randomArray[i]].images.original_still.url);
                    topicImage.attr("data-animate", results[randomArray[i]].images.original.url);
                    topicImage.attr("data-state", "still");
                    topicImage.attr("alt", results[randomArray[i]].title);

                    // append the gif to the itme div, then append the rating and item div to the item container
                    gifDiv.append(topicImage);
                    gifDivHolder.append(p).append(gifDiv);

                    // prepend each gif to the gif area
                    $("#gif-holder").prepend(gifDivHolder);
                }

                // add instructions to start and stop gifs
                $("#magic").text("(click to start/stop gif)");
            });
        });

        // click event to start music on first and only first character button click
        $(document).one("click", "button", function() {
            theme.play();
        });

        // function to start and stop gifs
        $(document).on("click", ".gif", function() {

            // set variable to hold image animate state
            var state = $(this).attr("data-state");

            // if the clicked image's state is still, update its src attribute to what its data-animate value is.
            // then, set the image's data-state to animate
            // else set src to the data-still value
            if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
            } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
            }
        });

        // call the renderButtons function at least once to display the initial list of characters
        renderButtons();
    });
})();