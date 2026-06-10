import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { WeatherError } from '../error/weather.error';

@Catch(WeatherError)
export class WeatherFilter {
  async catch(err: WeatherError, ctx: Context) {
    ctx.logger.error(err);
    return '<html><body><h1>weather data is empty</h1></body></html>';
  }
}
