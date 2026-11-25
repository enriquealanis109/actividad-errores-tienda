import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'Agua mineral 2L' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Botella de agua sin gas' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 7.5 })
  @IsInt()
  @IsPositive()
  precio!: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  categoriaId!: number;
}
