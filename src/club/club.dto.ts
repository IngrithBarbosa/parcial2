/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString,  IsDateString} from 'class-validator';
export class ClubDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly imagen: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly fechaFundacion: string;

 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;

}