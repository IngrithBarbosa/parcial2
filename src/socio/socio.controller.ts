/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SocioService } from './socio.service';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
  constructor(private readonly socioService: SocioService) {}

  @Get()
  async findAll() {
    return await this.socioService.findAll();
  }

  @Get(':memberId')
  async findOne(@Param('memberId') socioId: string) {
    return await this.socioService.findOne(socioId);
  }

  @Post()
  async create(@Body() socioDto: SocioDto) {
    const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.create(socio);
  }

  @Put(':memberId')
  async update(@Param('memberId') socioId: string, @Body() socioDto: SocioDto) {
    const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.update(socioId, socio);
  }

  @Delete(':memberId')
  @HttpCode(204)
  async delete(@Param('memberId') socioId: string) {
    return await this.socioService.delete(socioId);
  }
}

