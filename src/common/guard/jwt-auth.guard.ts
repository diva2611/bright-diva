import { Injectable } from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Admin } from 'typeorm';
import { AdminRepository } from '../../repositories/admin/admin.repository';
import { AdminBase } from 'src/models/Admin/Admin.base';


export interface ForgotPasswordResponse {
  userId: string;
}

interface DecodedJwtPayload {
  userId: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly nestJwtService: NestJwtService,
    private readonly adminRepository: AdminRepository,
  ) {}

  verifyToken(token: string, secret: string): ForgotPasswordResponse {
    try {
      return this.nestJwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('JWT token is missing');
    }

    const token = request.headers.authorization
      .toString()
      .replace('Bearer ', '');
    try {
      const accessSecret = this.configService.get(
        'JWT.ACCESS_SECRET',
      ) as string;
      const decoded = this.verifyToken(
        token,
        accessSecret,
      ) as DecodedJwtPayload;

      const admin = decoded?.userId
        ? ((await this.adminRepository.findById(
            decoded.userId,
          )) as unknown as Admin)
        : null;

      if (admin) {
        request.user = admin as unknown as AdminBase;
        return true;
      }
      throw new UnauthorizedException('JWT token is invalid');
    } catch (error) {
      throw new UnauthorizedException('JWT token is invalid');
    }
  }
}
