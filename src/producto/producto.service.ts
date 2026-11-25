import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });
    if (!categoria) {
      throw new NotFoundException(`La categoría ${data.categoriaId} no existe`);
    }
    return this.prisma.producto.create({ data });
  }

  findAll(categoriaId?: number, buscar?: string) {
    return this.prisma.producto.findMany({
      where: {
        categoriaId,
        nombre: buscar ? { contains: buscar, mode: 'insensitiv' } : undefined,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categorias: true },
    });
    if (!producto) {
      throw new NotFoundException(`El producto ${id} no existe`);
    }
    return producto;
  }

  async update(id: number, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.producto.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.producto.delete({ where: { id } });
  }
}
