import { MidwayConfig } from '@midwayjs/core';
import { UserEntity } from '../entity/user.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1780041554739_5358',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  jwt: {
    secret: 'midway-user-auth-secret-change-in-production',
    sign: {
      expiresIn: '7d',
    },
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'awesome_admin',
        charset: 'utf8mb4',
        synchronize: true,
        logging: false,
        entities: [UserEntity],
      },
    },
  },
} as MidwayConfig;
