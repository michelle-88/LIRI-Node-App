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

// Use search method from spotify node module to make a call to spotify API
spotify
  .search({ type: 'track', query: input, limit: 5 })
  .then(function(response) {
    console.log("");
    console.log("=====================================");
    console.log("");
    console.log(`Displaying song information for ${songInput}...`);        
    console.log("");
    console.log("=====================================");

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
        (response) => {
            // Store venue name, location, and concert date
            // Use moment package to format date from API response into readable format
            let venueName = response.data[0].venue.name;
            let venueLoc = response.data[0].venue.city + ", " + response.data[0].venue.region;
            let date = moment(response.data[0].datetime).format("MM/DD/YYYY");

            // Display concert data in console
            console.log("");
            console.log("=====================================");
            console.log("");
            console.log(`Displaying concert information for ${songInput}...`);
            console.log("");
            console.log(`Concert Venue: ${venueName}`);
            console.log(`Venue Location: ${venueLoc}`);
            console.log(`Concert Date: ${date}`);
            console.log("");
            console.log("=====================================");
            console.log("");
        })
        .catch(err => {
            console.log(err);
        });
}

// Function that will be called when user inputs movie-this command
function movieThis(input) {
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
            console.log(`Displaying movie information for ${songInput}...`);
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

        // Take data returned from random.txt file and create a substring that contains only the song name
        var song = data.substr(19, 18);

        // Run the spotifyThis function with the random.txt song name as the parameter
        spotifyThis(song);
    });
}

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