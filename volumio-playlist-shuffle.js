#!/usr/bin/node

// Usage = pass playlist name and location via command line. 
// For example:
// node volumio-playlist-shuffle.js Favorites /data/playlist/
// NB: location string is 2nd so that it can be left off to use Volumio's default of /data/playlist/
const playlist_name = (process.argv[2] || 'Favorites');
const playlist_dir = (process.argv[3] || '/data/playlist/');
const playlist_path = playlist_dir + playlist_name;

// Helper function to shuffle the order of the array using the Fisher-Yates shuffle algorithm
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];

    // Swap
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

function volumioPlaylistShuffle() {
  // Retrieve the content of the playlist document
  const fs = require('fs');
  const current_playlist = fs.readFileSync(playlist_path, 'utf8');
  // console.log("Playlist read successfully: " +current_playlist);

  // Strip out unnecessary data and shuffle tracks
  // Get the inner items by getting everything between [ and ]
  const all_tracks = current_playlist.substring(
    current_playlist.indexOf("[") + 1,
    current_playlist.lastIndexOf("]")
  );

  // Place each track listing into an array using a regex to detect each set of curly braces,
  // iterating through those matches, and adding them to an array
  const regex = /{([^}]+)}/g;
  tracks = regex.exec(all_tracks);
  const tracks_array = [];

  while (tracks != null) {
    tracks_array.push(tracks[0]);
    tracks = regex.exec(all_tracks);
  }

  // Construct shuffled playlist
  let new_playlist = '[';

  // Construct the rest of the expected payload
  new_playlist += shuffle(tracks_array).toString();
  new_playlist += ']';
  // console.log("Playlist shuffled!");
  // console.log(new_playlist);

  // Write the shuffled playlist back to the original file
  fs.writeFileSync(playlist_path,new_playlist);

}

volumioPlaylistShuffle();