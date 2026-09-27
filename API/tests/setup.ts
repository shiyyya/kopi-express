process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = ':memory:';
process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters';
process.env.BCRYPT_ROUNDS = '4';
