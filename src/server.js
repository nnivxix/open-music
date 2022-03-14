const songs = require('./api/songs');
const Hapi = require('@hapi/hapi');
const SongsService = require('./services/inMemory/SongsService');


const init = async () => {
  // const SongsService
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  });

  await server.register({
    plugin: songs,
    options: {
      service: new SongsService()
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();