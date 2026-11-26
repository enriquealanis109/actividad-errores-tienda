# Errores encontrados

**Nombre:** ______________________

**Fecha:** 25/11/2026

> Tipos válidos: `Typo` (editor en rojo) · `Sintaxis` · `Terminal` (Prisma / arranque / endpoint / tests) · `Lógica`

| #   | Archivo                                |                  Línea | Tipo     | ¿Qué estaba mal?                                                                                     | ¿Cómo lo detectaste?                                                                             | ¿Cómo lo solucionaste?                                            |
| --- | -------------------------------------- | ---------------------: | -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | `src/pedido/utils/calculos.ts`         |                     12 | Lógica   | El subtotal estaba sumando el precio y la cantidad, pero debía multiplicarlos.                       | Revisando el código me di cuenta de que la operación estaba mal.                                 | Cambié el signo `+` por `*`.                                      |
| 2   | `src/pedido/utils/calculos.ts`         |                     17 | Lógica   | El total estaba sumando el precio de cada producto y no el subtotal.                                 | Revisando cómo se calculaba el total, vi que estaba tomando el dato equivocado.                  | Cambié `linea.precioUnitario` por `linea.subtotal`.               |
| 3   | `src/pedido/pedido.service.ts`         |                     38 | Lógica   | La comprobación del stock tenía que revisar si alcanzaban las unidades para el pedido.               | Revisando la condición me di cuenta de que debía comparar el stock con la cantidad que se pidió. | Puse `producto.stock < item.cantidad`.                            |
| 4   | `src/pedido/pedido.service.ts`         |                     57 | Lógica   | Al hacer un pedido, se tenían que descontar del stock las unidades que se compraron.                 | Revisando la parte donde se actualiza el stock, vi que debía descontar la cantidad del pedido.   | Puse `decrement: linea.cantidad`.                                 |
| 5   | `src/pedido/pedido.service.ts`         |                     86 | Lógica   | La búsqueda de un pedido tenía que esperar el resultado y avisar si no existía.                      | Al revisar la función, noté que faltaba controlar cuando el pedido no se encontraba.             | Agregué `async`, `await` y `NotFoundException`.                   |
| 6   | `src/pedido/pedido.service.ts`         |                    110 | Lógica   | Cuando se cancelaba un pedido, las unidades tenían que volver al stock.                              | Revisando la cancelación me di cuenta de que no se estaban devolviendo los productos.            | Agregué `increment: detalle.cantidad` para devolver las unidades. |
| 7   | `src/pedido/pedido.service.ts`         |                     73 | Lógica   | Los pedidos de cada cliente tenían que mostrarse desde el más nuevo hasta el más antiguo.            | Revisando la lista de pedidos noté que faltaba ordenarlos.                                       | Agregué `orderBy: { createdAt: 'desc' }`.                         |
| 8   | `src/pedido/pedido.module.ts`          |                      9 | Typo     | Había escrito `PedidoModulo` en vez de `PedidoModule`, por eso no coincidía el nombre al importarlo. | Me di cuenta al revisar el nombre que se usaba en `app.module.ts`.                               | Cambié `PedidoModulo` por `PedidoModule`.                         |
| 9   | `src/pedido/dto/cambiar-estado.dto.ts` |                      6 | Sintaxis | Me faltaba una coma y el editor me marcaba esa parte en rojo.                                        | Lo detecté porque VS Code lo subrayó en rojo y también apareció en el error del build.           | Simplemente agregué la coma que faltaba.                          |
| 10  | `src/prisma/prisma.service.ts`         |            Constructor | Sintaxis | Faltaba llamar al constructor de Prisma, por eso no dejaba compilar.                                 | Lo detecté cuando ejecuté `npm run build` y apareció el error en la terminal.                    | Agregué `super({ adapter })`.                                     |
| 11  | `prisma/schema.prisma`                 |    Enum `EstadoPedido` | Typo     | Había escrito `PENDENTE` en vez de `PENDIENTE`.                                                      | Revisando el esquema me di cuenta de que estaba mal escrito.                                     | Corregí el nombre a `PENDIENTE`.                                  |
| 12  | `prisma/schema.prisma`                 |      Modelo `Producto` | Lógica   | Faltaba conectar los productos con los detalles de los pedidos.                                      | Al revisar las relaciones de las tablas vi que faltaba esa conexión.                             | Agregué `detallePedidos DetallePedido[]`.                         |
| 13  | `prisma/schema.prisma`                 | Modelo correspondiente | Typo     | Había escrito mal `@unique`.                                                                         | Lo detecté al revisar el esquema de Prisma.                                                      | Corregí `@uniqe` por `@unique`.                                   |

## Reflexión final

1. **¿Qué tipo de error te costó más encontrar y por qué?**

   Los errores de lógica, porque a veces el código no marca ningún error en rojo, pero al revisar lo que hacía me daba cuenta de que el resultado no era el correcto.

2. **¿Qué herramienta te ayudó más (editor, terminal, Swagger/Postman, tests)?**

   VS Code y la terminal, porque el editor me mostraba algunos errores en rojo y con `npm run build` podía ver qué partes estaban fallando.

3. **¿Qué harías para evitar este tipo de errores en tus propios proyectos?**

   Revisaría mejor el código antes de terminar, probaría las funciones y ejecutaría los comandos para comprobar que todo esté funcionando.


**Ivan Jimenez - 25 de Nociembre 2026**

# Errores encontrados y corregidos — Módulo Clientes

| # | Archivo | Línea | Tipo | ¿Qué estaba mal? | ¿Cómo lo detectaste? | ¿Cómo lo solucionaste? |
|---|---|---|---|---|---|---|
| 1 | `cliente.controller.ts` | 29 | Sintaxis | Faltaba cerrar el paréntesis en el decorador `@Get(':id'`. | Visual Studio Code marcaba un error de sintaxis. | Agregué el paréntesis de cierre `)`. |
| 2 | `create-cliente.dto.ts` | 11 | Typo | La propiedad del correo estaba escrita como `emial` en lugar de `email`. | Al crear un cliente, TypeScript mostraba una incompatibilidad entre las propiedades. | Corregí el nombre de la propiedad a `email`. |
| 3 | `cliente.service.ts` | 16 | Lógica | La búsqueda de clientes existentes utilizaba `data.nombre` para comparar el campo `email`. | Al revisar el método `create`, identifiqué que se comparaba el correo con el nombre. | Cambié `data.nombre` por `data.email` para comprobar correctamente si el correo ya existe. |
| 4 | `app.module.ts` | 5 | Ruta de importación | La ruta utilizaba `clientes` (plural), pero la carpeta se llama `cliente` (singular). | Al ejecutar `npm run build`, la terminal indicó que no encontraba el módulo. | Corregí la ruta de importación utilizando el nombre correcto de la carpeta. |
| 5 | `main.ts` | 2 | Importación | `ValidationPipe` se estaba importando desde `@nestjs/core`, pero pertenece a `@nestjs/common`. | Al ejecutar `npm run build`, TypeScript indicó que esa exportación no existía. | Corregí la importación para utilizar `ValidationPipe` desde `@nestjs/common`. |
| 6 | `package.json` | Script `start:dev` | Typo | El comando estaba escrito como `nest star --watch` en lugar de `nest start --watch`. | Al ejecutar `npm run start:dev`, la terminal indicó que el comando era inválido. | Corregí `star` por `start`. |