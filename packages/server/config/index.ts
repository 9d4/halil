const config = {
    appSecret: process.env.APP_SECRET || 'supersecretkey',
    isDev: process.env.NODE_ENV != 'production',
    databaseUrl:
        process.env.DATABASE_URL ||
        'postgresql://halil:thehalil@localhost:5432/halil',
    jwtExpiresIn: process.env.JWT_EXPIRATION || '1h',
}

export default config
