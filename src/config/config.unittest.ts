import { MidwayConfig } from '@midwayjs/core';
import { UserEntity } from '../entity/user.entity';

export default {
  koa: {
    port: null,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'better-sqlite3',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [UserEntity],
      },
    },
  },
} as MidwayConfig;
