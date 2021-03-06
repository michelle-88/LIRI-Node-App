require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// Store 3rd argument entered into CLI as variable which we will use in switch
var command = process.argv[2];

// Variable storing user song input for spotify command
// Slice process.argv array starting at 3 index and join the resulting new array to form a string for the API query
var songInput = process.argv.slice(3).join(" ");

// Variable storing user input for OMDB and Bands In Town APIs
// Slice process.argv array starting at 3 index and join the resulting new array with '+' symbol for queryUrl
var axiosInput = process.argv.slice(3).join("+");

// Function that will be called when user inputs spotify-this-song command
function spotifyThis(input) {

    // If user does not input a song after the command, the program will default to show info for The Sign by Ace of Base
    if(songInput == "") {
        input = "The Sign Ace of Base";
    }

// Use search method from spotify node module to make a call to spotify API
spotify
  .search({ type: 'track', query: input, limit: 5 })
  .then(function(response) {
    console.log("");
    console.log("=====================================");
    console.log("");
    console.log(`Displaying song information for ${songInput.toUpperCase()}...`);        
    console.log("");
    console.log("=====================================");

    // Loop through the 5 results in the response
    for(var i = 0; i < response.tracks.items.length; i++){
        // Grab specific data from the Spotify API response
        let artist = response.tracks.items[i].artists[0].name;
        let song = response.tracks.items[i].name;
        let album = response.tracks.items[i].album.name;
        let link = response.tracks.items[i].external_urls.spotify;
        
        // Display song data in console
        console.log("");
        console.log(i + 1);        
        console.log("");
        console.log(`Artist Name: ${artist}`);
        console.log(`Song: ${song}`);
        console.log(`Album: ${album}`);
        console.log(`Link to Spotify: ${link}`);
        console.log("");
        console.log("=====================================");
    }
  })
  .catch(function(err) {
        console.log(err);
  });
}

// Function that will be called when user inputs concert-this command
function concertThis(input) {

    // Artist/band name that user inputs into CLI will be inserted into URL for Bands in Town API call
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";    

    // Use axios get method to make call to Bands in Town API and pull specific data for each concert
    axios.get(queryUrl).then(

        // If the requested artist/band does not have any upcoming concerts (i.e. there is no info in the response.data array), print the below message in the console
        (response) => {

            console.log("");
            console.log("=====================================");
            console.log("");
            console.log(`Displaying concert information for ${songInput.toUpperCase()}...`);
            console.log("");
            console.log("=====================================");
            console.log("");

            if(response.data[0] == undefined) {
                console.log("");
                console.log("=====================================");
                console.log("");
                console.log("This artist has no upcoming concerts :(");
                console.log("");
                console.log("=====================================");
                console.log("");
            }

            for(var i = 0; i < 5; i++) {

            // Store venue name, location, and concert date
            // Use moment package to format date from API response into readable format
            var venueName = response.data[i].venue.name;
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");

            // Variable to store location of concert that will be logged to console
            // The default behavior is to display the concert city and state. If no state is listed in response (i.e. the concert is not in US), then city and country will be logged.
            var venueLoc = response.data[i].venue.city + " " + response.data[i].venue.region;
            if(response.data[i].venue.region === ""){
                venueLoc = response.data[i].venue.city + " " + response.data[i].venue.country;
            }

            // Display concert data in console
            console.log(i + 1);        
            console.log("");
            console.log(`Concert Venue: ${venueName}`);
            console.log(`Venue Location: ${venueLoc}`);
            console.log(`Concert Date: ${date}`);
            console.log("");
            console.log("=====================================");
            console.log("");
            }
        })
        .catch(err => {
            console.log(err);
        });
}

// Function that will be called when user inputs movie-this command
function movieThis(input) {

    // If user does not input a movie after the command, the program will default to show info about Mr. Nobody
    if(axiosInput == "") {
        input = "mr+nobody";
    }

    // Movie name that user inputs into CLI will be inserted into URL for OMDB API call
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    // Use axios get method to make call to OMDB API and pull specific data for each movie
    axios.get(queryUrl).then(
        (response) => {
            let title = response.data.Title;
            let year = response.data.Year;
            let imdb = response.data.imdbRating;
            let rotten = response.data.Ratings[1].Value;
            let country = response.data.Country;
            let language = response.data.Language;
            let plot = response.data.Plot;
            let actors = response.data.Actors;
            
            // Display movie info in console
            console.log("");
            console.log("=====================================");
            console.log("");
            console.log(`Displaying movie information for ${songInput.toUpperCase()}...`);
            console.log("");
            console.log("=====================================");
            console.log("");
            console.log(`Title: ${title}`);
            console.log(`Release Year: ${year}`);
            console.log(`IMDB Rating: ${imdb}`);
            console.log(`Rotten Tomatoes Rating: ${rotten}`);
            console.log(`Produced in: ${country}`);
            console.log(`Language(s): ${language}`);
            console.log(`Plot: ${plot}`);
            console.log(`Actors: ${actors}`); 
            console.log("");
            console.log("=====================================");
            console.log("");
        })
        .catch(err => {
            console.log(err);
        });
}

// Function that will be called when user inputs do-what-it-says command
function doWhatItSays() {

    // Use file system module to read the random.txt file
    fs.readFile("random.txt", "utf8", (err, data) => {
        if(err) {
            throw err;
        }

        // Take data read from txt file and split it into an array of 2 values
        var dataArr = data.split(",");
        
        // The first value in the array will be the command
        command = dataArr[0];

        // The second value in the array will be the song/movie/artist to search for
        // This second value will be formatted differently based on the command in order to successfully complete the necessary API call
        if(command === "spotify-this-song") {
            songInput = dataArr[1];
        }

        else {
            axiosInput = dataArr[1];
        }

        // Take the command and search input from the txt file and use switch to determine what function needs to be called
        switch(command) {
            case "spotify-this-song":
                spotifyThis(songInput);
                break;
        
            case "movie-this":
                movieThis(axiosInput);
                break;
        
            case "concert-this":
                concertThis(axiosInput);
        }
    });
}

// This switch will determine which function to call based on the command entered in the terminal
switch(command) {
    case "spotify-this-song":
        spotifyThis(songInput);
        break;

    case "movie-this":
        movieThis(axiosInput);
        break;

    case "concert-this":
        concertThis(axiosInput);
        break;

    case "do-what-it-says":
        doWhatItSays();
}