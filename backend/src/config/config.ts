export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    database: {
        connectionString: process.env.MONGO_URL,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    }
});