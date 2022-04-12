/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addConstraint('playlist_songs', 'fk_playlist.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  // pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users (id) ON DELETE CASCADE');

  pgm.addConstraint('playlist_songs', 'fk_playlist.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist.playlist_id_playlist.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist.song_id_songs.id');
};
