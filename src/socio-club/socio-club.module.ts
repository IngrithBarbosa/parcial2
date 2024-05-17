/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';

@Module({
  providers: [SocioClubService]
})
export class SocioClubModule {}
