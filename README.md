# 🛠️ FIXME: API de Tienda (NestJS + Prisma + PostgreSQL)

> ⚠️ **Este proyecto está roto a propósito.**
> Tu misión es encontrar los errores, arreglarlos y documentarlos.

Es una API REST para una tienda en línea: clientes, categorías, productos y pedidos con su detalle.
El código tiene **más de 25 errores** escondidos, de cuatro tipos:

| Tipo | ¿Cómo lo notas? |
| --- | --- |
| ✏️ **Mal escrito (typo)** | El editor (VS Code) lo subraya en **rojo**. |
| 🧱 **Sintaxis** | El editor marca rojo y el código ni siquiera se puede compilar. |
| 💻 **Terminal / ejecución** | Aparece en la terminal al correr `prisma`, un script de `npm`, al arrancar Nest, al llamar a un endpoint o al correr los tests. |
| 🧠 **Lógica** | El código compila y arranca, pero **hace algo distinto** a lo que dicen las reglas de negocio de este README. |

---

## 📦 Stack

- **NestJS 12** (ESM: los imports relativos terminan en `.js`)
- **Prisma 7** con `@prisma/adapter-pg`
- **PostgreSQL**
- **class-validator** / **class-transformer** para validar los DTOs
- **Swagger** en `http://localhost:3000/api`
- **Vitest** para los tests

---

## 🚀 Puesta en marcha

```bash
# 1. Clona tu copia del repo y entra a la carpeta
git clone <url-del-repo>
cd fixme-tienda-nest

# 2. Instala dependencias
npm install

# 3. Crea tu archivo .env a partir del ejemplo y pon tu usuario/contraseña de PostgreSQL
cp .env.example .env

# 4. Genera el cliente de Prisma  (👀 aquí aparecerán los primeros errores)
npx prisma generate

# 5. Crea las tablas en tu base de datos
npx prisma migrate dev --name init

# 6. Levanta el servidor en modo desarrollo
npm run start:dev

# 7. Corre los tests unitarios
npm test
```

Cuando el servidor arranque, abre **http://localhost:3000/api** para probar los endpoints con Swagger
(o usa Postman / Thunder Client).

> 💡 **Consejo:** arregla en este orden → 1) `schema.prisma` hasta que `prisma generate` funcione
> (ojo: Prisma a veces muestra los errores por tandas), 2) errores rojos del editor y de compilación,
> 3) errores al arrancar Nest, 4) tests, 5) lógica probando los endpoints.

---

## 🗄️ Modelo de datos (5 tablas + 1 enum)

**Enum `EstadoPedido`:** `PENDIENTE`, `PAGADO`, `ENVIADO`, `CANCELADO`.

| Tabla | Campos | Notas |
| --- | --- | --- |
| `clientes` | `id`, `nombre`, `email` (**único**), `telefono` (opcional), `activo` (booleano, por defecto `true`), `createdAt` | Un cliente tiene muchos pedidos. |
| `categorias` | `id`, `nombre` (**único**), `descripcion` (opcional) | Una categoría tiene muchos productos. |
| `productos` | `id`, `nombre`, `descripcion` (opcional), `precio` (decimal), `stock` (entero, por defecto 0), `createdAt`, `categoriaId` | Pertenece a una categoría. Aparece en muchos detalles de pedido. |
| `pedidos` | `id`, `estado` (`EstadoPedido`, por defecto `PENDIENTE`), `total` (decimal, por defecto 0), `createdAt`, `clienteId` | Pertenece a un cliente. Tiene muchos detalles. |
| `detalles_pedido` | `id`, `cantidad`, `precioUnitario`, `subtotal`, `pedidoId`, `productoId` | Une un pedido con un producto. Si se borra el pedido, se borran sus detalles. |

---

## 📏 Reglas de negocio (así DEBE funcionar la API)

### Clientes — `/clientes`
- CRUD completo (`POST`, `GET`, `GET /:id`, `PATCH /:id`, `DELETE /:id`).
- No pueden existir dos clientes con el mismo email → **409**.
- `DELETE /clientes/:id` es un **borrado lógico** (`activo = false`).
- `GET /clientes` lista solo los activos, ordenados por nombre.

### Categorías — `/categorias`
- CRUD completo. El nombre es único → **409**.
- **No se puede borrar una categoría que tiene productos** → **409** con un mensaje claro.

### Productos — `/productos`
- CRUD completo. Al crear se valida que la categoría exista → **404**.
- `precio` es un número positivo **con hasta 2 decimales** (por ejemplo `7.5` o `19.99`). `stock` es un entero ≥ 0.
- `GET /productos` lista **todos** los productos. Filtros **opcionales**:
  - `?categoriaId=1` → solo los de esa categoría.
  - `?buscar=agua` → busca por nombre **sin importar mayúsculas/minúsculas**.
- `GET /productos/:id` incluye su categoría. Si no existe → **404**.

### Pedidos — `/pedidos`
- `POST /pedidos` con:
  ```json
  { "clienteId": 1, "items": [ { "productoId": 1, "cantidad": 3 }, { "productoId": 2, "cantidad": 2 } ] }
  ```
  - El cliente debe existir y estar activo → **404**.
  - Cada producto debe existir → **404**.
  - Si un producto **no tiene stock suficiente** para la cantidad pedida → **400** "Stock insuficiente".
  - Cada detalle guarda `precioUnitario` (el precio actual del producto) y `subtotal = precioUnitario × cantidad`.
  - `total` del pedido = **suma de los subtotales**.
  - El stock de cada producto **baja en la cantidad pedida**.
  - Los items se validan uno por uno (`productoId` y `cantidad` enteros positivos).
- `GET /pedidos` lista todos, del más reciente al más antiguo.
- `GET /pedidos/cliente/:clienteId` lista los pedidos de un cliente, **del más reciente al más antiguo**.
- `GET /pedidos/:id` incluye el cliente y los detalles con su producto. Si no existe → **404**.
- `PATCH /pedidos/:id/estado` con `{ "estado": "PAGADO" }`. Transiciones permitidas:
  - `PENDIENTE` → `PAGADO` o `CANCELADO`
  - `PAGADO` → `ENVIADO` o `CANCELADO`
  - `ENVIADO` y `CANCELADO` son finales (cualquier cambio → **400**).
  - **Solo** cuando un pedido pasa a `CANCELADO` se devuelve el stock de sus productos.

---

## ✅ ¿Cuándo está terminado?

- [ ] `npx prisma generate` y `npx prisma migrate dev` funcionan sin errores.
- [ ] VS Code no muestra nada en rojo dentro de `src/`.
- [ ] `npm run build` compila sin errores.
- [ ] `npm run start:dev` arranca y se ven **todas** las rutas mapeadas en la terminal.
- [ ] `npm test` pasa al 100 %.
- [ ] Todos los endpoints cumplen las reglas de negocio de arriba.
- [ ] Llenaste el archivo **`ERRORES_ENCONTRADOS.md`**.

> ❗ No cambies las reglas de negocio ni los tests para "hacer que pasen": el error siempre está en el código, no en la especificación.

---

## 📝 Entrega

1. Arregla el código y haz commits pequeños (idealmente uno por error o por grupo de errores).
2. Completa `ERRORES_ENCONTRADOS.md` con **todos** los errores que encontraste: archivo, línea, tipo, cómo lo detectaste y cómo lo solucionaste.
3. Sube tu repositorio y comparte el enlace.
