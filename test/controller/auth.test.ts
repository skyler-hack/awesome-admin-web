import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/auth.test.ts', () => {
  let app: Awaited<ReturnType<typeof createApp<Framework>>>;
  let token: string;

  beforeAll(async () => {
    app = await createApp<Framework>(process.cwd());
  });

  afterAll(async () => {
    await close(app);
  });

  it('should login with default admin account', async () => {
    const result = await createHttpRequest(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.data.token).toBeTruthy();
    expect(result.body.data.user.username).toBe('admin');
    token = result.body.data.token;
  });

  it('should get profile with token', async () => {
    const result = await createHttpRequest(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('admin');
  });

  it('should register a new user', async () => {
    const result = await createHttpRequest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'test1234',
        email: 'test@example.com',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.user.username).toBe('testuser');
    expect(result.body.data.token).toBeTruthy();
  });

  it('should list users as admin', async () => {
    const result = await createHttpRequest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.total).toBeGreaterThanOrEqual(2);
  });
});
