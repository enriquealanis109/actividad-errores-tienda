import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class ItemPedidoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productoId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  cantidad!: number;
}

export class CreatePedidoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  clienteId!: number;

  @ApiProperty({ type: [ItemPedidoDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  items!: ItemPedidoDto[];
}
