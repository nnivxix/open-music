const {
  Pool
} = require('pg');
const {
  nanoid
} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    // this._collaborationService = collaborationService;
  }

  async addPlaylist({
    name,
    owner
  }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const addResult = await this._pool.query(query);

    if (!addResult.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return addResult.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const deleteResult = await this._pool.query(query);

    if (deleteResult.rows.length === 0) {
      throw new NotFoundError('Playlist gagal dihapus.Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const verifyResult = await this._pool.query(query);

    if (!verifyResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = verifyResult.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  // async verifyPlaylistAccess(id, userId) {
  //     try {
  //         await this.verifyPlaylistOwner(id, userId);
  //     } catch (error) {
  //         if (error instanceof NotFoundError) {
  //             throw error;
  //         }
  //         try {
  //             await this._collaborationService.verifyCollaborator(id, userId);
  //         } catch {
  //             throw error;
  //         }
  //     }
  // }

  // Playlist

  async addSongToPlaylist(playlistId, songId) {
    const querySong = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId]
    };

    const resultSong = await this._pool.query(querySong);

    if (!resultSong.rows.length) {
      throw new NotFoundError('Lagu gagal ditambahkan');
    }

    const id = 'playlist_song-' + nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3)',
      values: [id, playlistId, songId]
    };

    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId) {
    const queryPlaylist = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlist_songs INNER JOIN playlists ON playlist_songs.playlist_id = playlists.id INNER JOIN users ON playlists.owner = users.id WHERE playlist_id = $1 LIMIT 1',
      values: [playlistId]
    };

    const queryUser = {
      text: 'SELECT username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1 LIMIT 1',
      values: [playlistId]
    };

    const querySongs = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs INNER JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_id = $1',
      values: [playlistId]
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultUser = await this._pool.query(queryUser);
    const resultSongs = await this._pool.query(querySongs);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      username: resultUser.rows[0].username,
      songs: resultSongs.rows
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const deleteplaylistResult = await this._pool.query(query);
    if (deleteplaylistResult.rows.length === 0) {
      throw new InvariantError('Lagu gagal dihapus dari playlist.Id lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;