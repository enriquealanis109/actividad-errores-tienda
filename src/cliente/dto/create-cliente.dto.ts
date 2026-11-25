import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Carlos Rojas' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'carlos@correo.com' })
  @IsEmail()
  emial!: string;

  @ApiPropertyOptional({ example: '70012345' })
  @IsOptional()
  @IsString()
  telefono?: string;
}
