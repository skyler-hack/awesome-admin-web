import { Controller, Get, Inject, Query } from '@midwayjs/core';
import { WeatherService } from '../service/weather.servcie';
import { Context } from '@midwayjs/koa';

@Controller('/api')
export class WeatherController {
  @Inject()
  weatherService: WeatherService;
  @Inject()
  ctx: Context;
  @Get('/weather')
  async getWeather(@Query('cityId') cityId: string) {
    const result = await this.weatherService.getWeather(cityId);
    if (result.success) {
      await this.ctx.render('info.html', result.data.weatherinfo);
    }
  }
}
