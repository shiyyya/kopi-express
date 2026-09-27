import bcrypt from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { sequelize, User } from '../src/models/index.js';

interface AuthResponse {
  data: { user: { id: number; name: string; email: string; isActive: boolean }; token: string };
}

const validUser = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'Password123' };

async function createUser() {
  const response = await request(app).post('/api/v1/auth/signup').send(validUser);
  return response.body as AuthResponse;
}

beforeEach(async () => sequelize.sync({ force: true }));
afterAll(async () => sequelize.close());

describe('POST /api/v1/auth/signup', () => {
  it('creates a user, hashes the password, and returns a token', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.data.user).toMatchObject({ name: validUser.name, email: validUser.email, isActive: true });
    expect(response.body.data.user).not.toHaveProperty('passwordHash');
    expect(response.body.data.token).toEqual(expect.any(String));
    const stored = await User.findOne({ where: { email: validUser.email } });
    expect(stored).not.toBeNull();
    expect(await bcrypt.compare(validUser.password, stored!.passwordHash)).toBe(true);
  });

  it('rejects invalid input and duplicate emails', async () => {
    const invalid = await request(app).post('/api/v1/auth/signup').send({ name: 'A', email: 'bad', password: 'short' });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe('VALIDATION_ERROR');

    await createUser();
    const duplicate = await request(app).post('/api/v1/auth/signup').send({ ...validUser, email: 'ADA@example.com' });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe('EMAIL_EXISTS');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('returns a token for valid credentials', async () => {
    await createUser();
    const response = await request(app).post('/api/v1/auth/login').send({ email: validUser.email, password: validUser.password });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  it('rejects invalid credentials and deactivated accounts', async () => {
    const created = await createUser();
    const invalid = await request(app).post('/api/v1/auth/login').send({ email: validUser.email, password: 'incorrect' });
    expect(invalid.status).toBe(401);

    await request(app)
      .patch(`/api/v1/users/${created.data.user.id}/deactivate`)
      .set('Authorization', `Bearer ${created.data.token}`);
    const deactivated = await request(app).post('/api/v1/auth/login').send({ email: validUser.email, password: validUser.password });
    expect(deactivated.status).toBe(403);
    expect(deactivated.body.error.code).toBe('ACCOUNT_DEACTIVATED');
  });
});

describe('PATCH /api/v1/users/:id', () => {
  it('updates the authenticated user', async () => {
    const created = await createUser();
    const response = await request(app)
      .patch(`/api/v1/users/${created.data.user.id}`)
      .set('Authorization', `Bearer ${created.data.token}`)
      .send({ name: 'Ada Byron' });
    expect(response.status).toBe(200);
    expect(response.body.data.user.name).toBe('Ada Byron');
  });

  it('requires authentication and prevents modifying another user', async () => {
    const created = await createUser();
    const unauthorized = await request(app).patch(`/api/v1/users/${created.data.user.id}`).send({ name: 'Ada Byron' });
    expect(unauthorized.status).toBe(401);

    const forbidden = await request(app)
      .patch('/api/v1/users/999')
      .set('Authorization', `Bearer ${created.data.token}`)
      .send({ name: 'Ada Byron' });
    expect(forbidden.status).toBe(403);
  });

  it('requires the current password when changing passwords', async () => {
    const created = await createUser();
    const missing = await request(app)
      .patch(`/api/v1/users/${created.data.user.id}`)
      .set('Authorization', `Bearer ${created.data.token}`)
      .send({ password: 'NewPassword456' });
    expect(missing.status).toBe(400);

    const changed = await request(app)
      .patch(`/api/v1/users/${created.data.user.id}`)
      .set('Authorization', `Bearer ${created.data.token}`)
      .send({ password: 'NewPassword456', currentPassword: validUser.password });
    expect(changed.status).toBe(200);
  });
});

describe('PATCH /api/v1/users/:id/deactivate', () => {
  it('soft-deactivates the user and invalidates the existing token', async () => {
    const created = await createUser();
    const response = await request(app)
      .patch(`/api/v1/users/${created.data.user.id}/deactivate`)
      .set('Authorization', `Bearer ${created.data.token}`);
    expect(response.status).toBe(204);

    const stored = await User.findByPk(created.data.user.id);
    expect(stored?.isActive).toBe(false);
    expect(stored?.deactivatedAt).toBeInstanceOf(Date);

    const retry = await request(app)
      .patch(`/api/v1/users/${created.data.user.id}`)
      .set('Authorization', `Bearer ${created.data.token}`)
      .send({ name: 'No longer allowed' });
    expect(retry.status).toBe(401);
  });
});
