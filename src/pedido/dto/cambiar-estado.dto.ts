import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoPedido } from '../../generated/prisma/enums.js';

export class CambiarEstadoDto {
  @ApiProperty({ enum: EstadoPedido example: EstadoPedido.PAGADO })
  @IsEnum(EstadoPedido)
  estado!: EstadoPedido;
}
