import { makeHttpRequest, Provide } from '@midwayjs/core';
import { IWeatherInfoData, IWeatherResponse } from '../interface';
import { WeatherError } from '../error/weather.error';

@Provide()
export class WeatherService {
  async getWeather(cityId: string): Promise<IWeatherResponse> {
    if (!cityId) {
      throw new WeatherError(new Error('cityId is required'));
    }
    try {
      const response = await makeHttpRequest(
        `https://midwayjs.org/resource/${cityId}.json`,
        {
          dataType: 'json',
        }
      );
      if (response.status === 200) {
        return {
          success: true,
          message: 'OK',
          data: response.data as IWeatherInfoData,
        };
      }
    } catch (error) {
      throw new WeatherError(error as Error);
    }
  }
}
