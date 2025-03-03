import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { MisService } from './mis.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class MisController {
  constructor(private readonly misService: MisService) {}
}
