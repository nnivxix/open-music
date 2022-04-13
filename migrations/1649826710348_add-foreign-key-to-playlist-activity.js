/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addConstraint('playlist_activities', 'fk_playlist_activities.playlist_id_playlist.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlist_activities', 'fk_playlist_activities.playlist_id_playlist.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};
