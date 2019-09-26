require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// Use this in switch
var command = process.argv[2];
// Need to loop over process.argv array to capture all words in artist/movie/song name
var userInput = process.argv[3];

// Create 4 functions that will do something for each of the 4 commands and call them in switch

function spotifyThis(input) {

spotify
  .search({ type: 'track', query: input, limit: 1 })
  .then(function(response) {
        console.log(JSON.stringify(response.tracks.items[0].name, null, 2));
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
        spotifyThis(userInput);
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