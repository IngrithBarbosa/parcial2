/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { SocioController } from './socio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])], 
  providers: [SocioService],
  exports: [SocioService],
  controllers: [SocioController],
})
export class SocioModule {}

