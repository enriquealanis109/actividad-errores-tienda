import { Module } from '@nestjs/common';
import { PedidoController } from './pedido.controller.js';
import { PedidoService } from './pedido.service.js';

@Module({
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModulo {}
