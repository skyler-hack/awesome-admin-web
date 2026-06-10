import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework, IMidwayKoaApplication } from '@midwayjs/koa';

describe('test/controller/weather.test.ts', () => {
  let app: IMidwayKoaApplication;
  beforeAll(async () => {
    app = await createApp<Framework>(process.cwd());
  });
  afterAll(async () => {
    await close(app);
  });
  it('should test /api/weather with success request', async () => {
    const result = await createHttpRequest(app)
      .get('/api/weather')
      .query({ cityId: '101010100' });
    expect(result.status).toBe(200);
    expect(result.text).toContain('北京');
  });
  it('should test /api/weather with failed request', async () => {
    const result = await createHttpRequest(app).get('/api/weather');
    expect(result.status).toBe(200);
    expect(result.text).toContain('weather data is empty');
  });
});
