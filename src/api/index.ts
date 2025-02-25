import { Module } from '@nestjs/common';
import { ApiV1Imports } from './api-v1.routes';

@Module({
    imports: [...(ApiV1Imports as [])],
})
export class APIV1Module {
    static getLinks() {
        return {};
    }
}
