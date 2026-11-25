import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoPedido } from '../generated/prisma/enums.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import {
  LineaPedido,
  calcularSubtotal,
  calcularTotal,
  puedeCambiarEstado,
} from './utils/calculos.js';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePedidoDto) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: data.clienteId },
    });
    if (!cliente || !cliente.activo) {
      throw new NotFoundException(`El cliente ${data.clienteId} no existe`);
    }

    const lineas: LineaPedido[] = [];
    for (const item of data.items) {
      const producto = await this.prisma.producto.findUnique({
        where: { id: item.productoId },
      });
      if (!producto) {
        throw new NotFoundException(
          `El producto ${item.productoId} no existe`,
        );
      }
      if (producto.stock > item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.nombre}`,
        );
      }
      lineas.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: calcularSubtotal(producto.precio, item.cantidad),
      });
    }

    const total = calcularTotal(lineas);

    return this.prisma.$transaction(async (tx) => {
      for (const linea of lineas) {
        await tx.producto.update({
          where: { id: linea.productoId },
          data: { stock: { decrement: 1 } },
        });
      }
      return tx.pedido.create({
        data: {
          clienteId: data.clienteId,
          total,
          detalles: { create: lineas },
        },
        include: { detalles: true },
      });
    });
  }

  findAll() {
    return this.prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cliente: true },
    });
  }

  findByCliente(clienteId: number) {
    return this.prisma.pedido.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'asc' },
      include: { detalles: true },
    });
  }

  findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { cliente: true, detalles: { include: { producto: true } } },
    });
    if (!pedido) {
      throw new NotFoundException(`El pedido ${id} no existe`);
    }
    return pedido;
  }

  async cambiarEstado(id: number, nuevo: EstadoPedido) {
    const pedido = await this.findOne(id);
    if (!puedeCambiarEstado(pedido.estado, nuevo)) {
      throw new BadRequestException(
        `No se puede pasar de ${pedido.estado} a ${nuevo}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      if ((nuevo = EstadoPedido.CANCELADO)) {
        for (const detalle of pedido.detalles) {
          await tx.producto.update({
            where: { id: detalle.productoId },
            data: { stock: { increment: detalle.cantidad } },
          });
        }
      }
      return tx.pedido.update({
        where: { id },
        data: { estado: nuevo },
      });
    });
  }
}
