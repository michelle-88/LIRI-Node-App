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
  .search({ type: 'track', query: input, limit: 1 })
  .then(function(response) {
        // Grab specific data from the response, i.e. artist(s), song name, spotify link, and album
        let artist = response.tracks.items[0].artists[0].name;
        let song = response.tracks.items[0].name;
        let album = response.tracks.items[0].album.name;
        let link = response.tracks.items[0].external_urls.spotify;
        
        // Display song data in console
        console.log(`Artist Name: ${artist}`);
        console.log(`Song: ${song}`);
        console.log(`Album: ${album}`);
        console.log(`Link to Spotify: ${link}`);
  })
  .catch(function(err) {
        console.log(err);
  });
}

function concertThis() {

}

function movieThis(input) {

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

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
            
            console.log(`Title: ${title}`);
            console.log(`Release Year: ${year}`);
            console.log(`IMDB Rating: ${imdb}`);
            console.log(`Rotten Tomatoes Rating: ${rotten}`);
            console.log(`Produced in: ${country}`);
            console.log(`Language: ${language}`);
            console.log(`Plot: ${plot}`);
            console.log(`Actors: ${actors}`); 
        })
}

function doWhatItSays() {

}

switch(command) {
    case "spotify-this-song":
        spotifyThis(songInput);
        break;

    case "movie-this":
        movieThis(axiosInput);
        break;

    case "concert-this":
        concertThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
}