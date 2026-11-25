import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClienteModule } from './clientes/cliente.module.js';
import { CategoriaModule } from './categoria/categoria.module.js';
import { ProductoModule } from './producto/producto.module.js';
import { PedidoModule } from './pedido/pedido.module.js';

@Module({
  imports: [
    PrismaModule,
    ClienteModule,
    CategoriaModule,
    ProductoModule,
    PedidoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
