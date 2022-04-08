require('dotenv', ).config();
const Hapi = require('@hapi/hapi', );

// songs
const songs = require('./api/songs', );
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

// albums
const albums = require('./api/albums', );
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  // const SongsService
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*', ],
      },
    },
  }, );

  await server.register([{
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: new UsersService(),
        validator: UsersValidator,
      },
    },
  ], );

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`, );
};

init();
