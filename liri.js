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

// Function that will be called when user inputs spotify-this-song command
function spotifyThis(input) {
// Use search method from spotify node module to make call to spotify API
spotify
  .search({ type: 'track', query: input, limit: 1 })
  .then(function(response) {
        // console.log artist(s), song name, spotify link, album
        let artist = response.tracks.items[0].artists[0].name;
        let song = response.tracks.items[0].name;
        let album = response.tracks.items[0].album.name;
        let link = response.tracks.items[0].external_urls.spotify;
        
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

function movieThis() {

}

function doWhatItSays() {

}

switch(command) {
    case "spotify-this-song":
        spotifyThis(songInput);
        break;

    case "movie-this":
        movieThis();
        break;

    case "concert-this":
        concertThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
}