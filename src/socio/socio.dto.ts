/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString,  IsDateString} from 'class-validator';
export class SocioDto {

 @IsString()
 @IsNotEmpty()
 readonly nombreUsuario: string;
 
 @IsString()
 @IsNotEmpty()
 readonly correo: string;
 
 @IsDateString()
 @IsNotEmpty()
 readonly fechaNacimiento: string;

}
