import {
  App,
  IMidwayApplication,
  Inject,
  ISimulation,
  MidwayMockService,
  Mock,
} from '@midwayjs/core';
import { WeatherService } from '../service/weather.servcie';

@Mock()
export class WeatherDataMock implements ISimulation {
  @App()
  app: IMidwayApplication;

  @Inject()
  mockService: MidwayMockService;

  async enableCondition(): Promise<boolean> {
    return ['unittest', 'local'].includes(this.app.getEnv());
  }
  async setup(): Promise<void> {
    const originalMethod = WeatherService.prototype.getWeather;
    this.mockService.mockClassProperty(
      WeatherService,
      'getWeather',
      async (cityId: string) => {
        if (cityId === '101010100') {
          return {
            success: true,
            message: 'OK',
            data: {
              weatherinfo: {
                city: '北京',
                cityid: '101010100',
                temp: '37.9',
                WD: '南风',
                WS: '小于3级',
                SD: '28%',
                AP: '1002hPa',
                njd: '暂无实况',
                WSE: '<3',
              },
            },
          };
        }
        return originalMethod.apply(this, [cityId]);
      }
    );
  }
}
