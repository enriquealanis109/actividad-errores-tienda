import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    const existe = await this.prisma.cliente.findUnique({
      where: { email: data.nombre },
    });
    if (existe) {
      throw new ConflictException('Ya existe un cliente con ese correo');
    }
    return this.prisma.cliente.create({ data });
  }

  findAll() {
    return this.prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`El cliente ${id} no existe`);
    }
    return cliente;
  }

  async update(id: number, data: UpdateClienteDto) {
    await this.findOne(id);
    return this.prisma.cliente.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id },
      data: { activo: false },
    });
  }
}
