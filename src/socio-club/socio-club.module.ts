/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from 'src/club/club.entity';
import { SocioClubController } from './socio-club.controller';

@Module({
  providers: [SocioClubService],
  imports: [
    TypeOrmModule.forFeature([SocioEntity]),
    TypeOrmModule.forFeature([ClubEntity])
  ],
  controllers: [SocioClubController]
})
export class SocioClubModule {}
