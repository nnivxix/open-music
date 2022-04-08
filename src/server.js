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

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async () => {
  const authenticationsService = new AuthenticationsService();
  const usersService = new UsersService();

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
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    }
  ], );

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`, );
};

init();
