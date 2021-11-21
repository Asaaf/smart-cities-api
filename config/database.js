module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'smartcities_backend_db'),
        username: env('DATABASE_USERNAME', 'hummingbird'),
        password: env('DATABASE_PASSWORD', 'X6QtKjV7DqjxGFSg'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
