const ClientError = require("../../exceptions/ClientError", );

class AlbumsHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this.postAlbumHandler = this.postAlbumHandler.bind(this, );
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this, );
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this, );
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this, );
    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }


  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {
        name,
        year,
      } = request.payload;

      const albumId = await this._service.addAlbum({
        name,
        year,
      }, );

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      }, );
      response.code(201, );
      return response;
    } catch (error) {

      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }, );
        response.code(error.statusCode, );
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }, );
      response.code(500, );
      console.error(error, );
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const {
        id,
      } = request.params;
      const album = await this._service.getAlbumById(id);
      // const songs = await this._service.getSongsByAlbumId(id);
      // album['songs'] = songs;

      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }, );
        response.code(error.statusCode, );
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }, );
      response.code(500, );
      console.error(error, );
      return response;
    }
  }
  async putAlbumByIdHandler(request, h, ) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {
        id,
      } = request.params;

      await this._service.editAlbumById(id, request.payload, );

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }, );
        response.code(error.statusCode, );
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }, );
      response.code(500, );
      console.error(error, );
      return response;
    }

  }
  async deleteAlbumByIdHandler(request, h, ) {
    try {
      const {
        id,
      } = request.params;
      await this._service.deleteAlbumById(id, );

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }, );
        response.code(error.statusCode, );
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }, );
      response.code(500, );
      console.error(error, );
      return response;
    }

  }

  // cover album
  async postUploadCoverHandler(request, h) {
    try {
      const {
        cover
      } = request.payload;
      const {
        id
      } = request.params;
      this._validator.validateAlbumCover(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;

      await this._service.postAlbumCoverById(id, fileLocation);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah'
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  // like
  async postAlbumLikeHandler(request, h) {
    try {
      const {
        id: credentialId
      } = request.auth.credentials;
      const {
        id: albumId
      } = request.params;

      const message = await this._service.postUserAlbumLikeById(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: message
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumLikesHandler(request, h) {
    try {
      const {
        id: albumId
      } = request.params;

      const likes = await this._service.getUserAlbumLikesById(albumId);

      const response = h.response({
        status: 'success',
        data: {
          likes: likes.albumLikes
        }
      });

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
