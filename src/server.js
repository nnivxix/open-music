const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const albums = require('./api/albums');
const SongsService = require('./services/inMemory/SongsService');
const AlbumsService = require('./services/inMemory/AlbumsService');

const init = async () => {
  // const SongsService
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  });

  await server.register([{
      plugin: songs,
      options: {
        service: new SongsService()
      },
    },
    {
      plugin: albums,
      options: {
        service: new AlbumsService()
      },
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();