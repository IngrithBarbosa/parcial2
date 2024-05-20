/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { ClubController } from './club.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [ClubService],
  exports: [ClubService],
  controllers: [ClubController],
})
export class ClubModule {}

