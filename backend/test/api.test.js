import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import app from '../src/app.js';

const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

test('health endpoint responds without database access', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('unknown routes return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  assert.match((await response.json()).message, /Route not found/);
});

test('analytics requires authentication', async () => {
  const response = await fetch(`${baseUrl}/api/analytics/overview`);
  assert.equal(response.status, 401);
});

test('local preview origins are allowed and weak registration passwords are rejected', async () => {
  const origin = 'http://127.0.0.1:5174';
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', phone: '1234567890', password: 'weakpassword', role: 'customer' })
  });
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(response.status, 400);
});