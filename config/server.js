module.exports = ({ env }) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    admin: {
        auth: {
            secret: env('ADMIN_JWT_SECRET', '9642eddd6422677343a07396fabd2748'),
        },
    },
    settings: {
        cors: {
            enabled: true,
            origin: ['*']
        },
    },
});