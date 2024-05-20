/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from 'src/socio/socio.entity';
import { SocioDto } from '../socio/socio.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioClubService } from './socio-club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
    constructor(private readonly clubSocioService: SocioClubService){}

    @Post(':clubId/members/:memberId')
    async addSocioClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
        return await this.clubSocioService.addSocioClub(clubId, socioId);
    }

    @Get(':clubId/members/:memberId')
    async findSocioByClubIdSocioId(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
        return await this.clubSocioService.findSocioByClubIdSocioId(clubId, socioId);
    }

    @Get(':clubId/members')
    async findSociosByClubId(@Param('clubId') clubId: string){
        return await this.clubSocioService.findSociosByClubId(clubId);
    }

    @Put(':clubId/members')
    async associateSociosClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
        const socios = plainToInstance(SocioEntity, sociosDto)
        return await this.clubSocioService.updateSociosClub(clubId, socios);
    }
    
    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteSocioClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
        return await this.clubSocioService.deleteSocioClub(clubId, socioId);
    }
}