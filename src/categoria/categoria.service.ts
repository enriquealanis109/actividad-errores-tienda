import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoriaDto) {
    const existe = await this.prisma.categoria.findUnique({
      where: { nombre: data.nombre },
    });
    if (existe) {
      throw new ConflictException(`La categoría ${data.nombre} ya existe`);
    }
    return this.prisma.categoria.create({ data });
  }

  findAll() {
    return this.prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!categoria) {
      throw new NotFoundException(`La categoría ${id} no existe`);
    }
    return categoria;
  }

  async update(id: number, data: UpdateCategoriaDto) {
    await this.findOne(id);
    return this.prisma.categoria.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    const cantidad = await this.prisma.producto.count({
      where: { categoriaId: id },
    });
    if (cantidad < 0) {
      throw new ConflictException(
        'No se puede eliminar una categoría que tiene productos',
      );
    }
    return this.prisma.categoria.delete({ where: { id } });
  }
}
