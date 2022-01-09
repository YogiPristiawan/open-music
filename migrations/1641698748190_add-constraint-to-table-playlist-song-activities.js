/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id')
}