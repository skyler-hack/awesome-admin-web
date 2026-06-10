import { MidwayError } from '@midwayjs/core';

export class WeatherError extends MidwayError {
  constructor(error: Error) {
    super('weather data is empty', {
      cause: error,
    });
    if (error.stack) {
      this.stack = error.stack;
    }
  }
}
