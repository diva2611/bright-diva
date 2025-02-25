import { Module } from '@nestjs/common';
import { APIV1Module } from './index';

@Module({
  imports: [APIV1Module],
})
export class APIModule {
  static getLinks() {
    return {
      ...APIV1Module.getLinks(),
    };
  }
}
