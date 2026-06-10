import { UserRole } from './constant/user.constant';

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export interface IJwtPayload {
  userId: number;
  username: string;
  role: UserRole;
}

export interface IUserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWeatherOptions {
  cityId: string;
}

export interface IWeatherResponse {
  success: boolean;
  message: string;
  data: IWeatherInfoData;
}

export interface IWeatherInfoData {
  weatherinfo: IWeatherInfo;
}

export interface IWeatherInfo {
  city: string;
  cityid: string;
  temp: string;
  WD: string;
  WS: string;
  SD: string;
  AP: string;
  njd: string;
  WSE: string;
}

declare module '@midwayjs/koa' {
  interface ContextState {
    user?: IJwtPayload;
  }
}
