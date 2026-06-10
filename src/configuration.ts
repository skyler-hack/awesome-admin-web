import {
  App,
  CATCH_KEY,
  CommonJSFileDetector,
  Configuration,
  IMidwayContainer,
  MetadataManager,
} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/typeorm';
import * as jwt from '@midwayjs/jwt';
import * as view from '@midwayjs/view-nunjucks';
import { join } from 'path';

@Configuration({
  detector: new CommonJSFileDetector(),
  imports: [
    koa,
    view,
    validate,
    orm,
    jwt,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady(container: IMidwayContainer) {
    const filters = [];
    for (const id of container.registry.identifiers) {
      const definition = container.registry.getDefinition(id);
      const target = definition?.creator?.load?.();
      if (target && MetadataManager.getOwnMetadata(CATCH_KEY, target)) {
        filters.push(target);
      }
    }
    if (filters.length > 0) {
      this.app.useFilter(filters);
    }
  }
}
