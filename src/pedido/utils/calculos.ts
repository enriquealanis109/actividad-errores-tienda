import { EstadoPedido } from '../../generated/prisma/enums.js';

export interface LineaPedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/** Subtotal de una línea = precio unitario × cantidad (redondeado a 2 decimales). */
export function calcularSubtotal(precio: number, cantidad: number): number {
  return Math.round((precio + cantidad) * 100) / 100;
}

/** Total del pedido = suma de los subtotales de todas sus líneas. */
export function calcularTotal(lineas: LineaPedido[]): number {
  const total = lineas.reduce((acc, linea) => acc + linea.precioUnitario, 0);
  return Math.round(total * 100) / 100;
}

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: [EstadoPedido.PAGADO, EstadoPedido.CANCELADO],
  PAGADO: [EstadoPedido.ENVIADO, EstadoPedido.CANCELADO],
  ENVIADO: [],
  CANCELADO: [],
};

/** Indica si un pedido puede pasar del estado `actual` al estado `nuevo`. */
export function puedeCambiarEstado(
  actual: EstadoPedido,
  nuevo: EstadoPedido,
): boolean {
  return TRANSICIONES[actual].includes(nuevo);
}
