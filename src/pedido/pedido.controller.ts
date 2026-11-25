import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PedidoService } from './pedido.service.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto.js';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('id', ParseIntPipe) clienteId: number) {
    return this.pedidoService.findByCliente(clienteId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoDto,
  ) {
    return this.pedidoService.cambiarEstado(id, cambiarEstadoDto.estado);
  }
}
