import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/api.test.ts', () => {
  it('should GET /api/get_user', async () => {
    const app = await createApp<Framework>(process.cwd());

    const result = await createHttpRequest(app)
      .get('/api/get_user')
      .query({ uid: 1 });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK');
    expect(result.body.data.username).toBe('admin');

    await close(app);
  });
});
