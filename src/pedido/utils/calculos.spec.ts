import {
  calcularSubtotal,
  calcularTotal,
  puedeCambiarEstado,
} from './calculos.js';

describe('calcularSubtotal', () => {
  it('multiplica el precio por la cantidad', () => {
    expect(calcularSubtotal(10, 3)).toBe(30);
  });

  it('redondea a 2 decimales', () => {
    expect(calcularSubtotal(7.15, 3)).toBe(21.45);
  });
});

describe('calcularTotal', () => {
  it('suma los subtotales de todas las líneas', () => {
    const total = calcularTotal([
      { productoId: 1, cantidad: 2, precioUnitario: 5, subtotal: 10 },
      { productoId: 2, cantidad: 3, precioUnitario: 4, subtotal: 12 },
    ]);
    expect(total).toBe(22);
  });

  it('un pedido sin líneas tiene total 0', () => {
    expect(calcularTotal([])).toBe(0);
  });
});

describe('puedeCambiarEstado', () => {
  it('PENDIENTE puede pasar a PAGADO', () => {
    expect(puedeCambiarEstado('PENDIENTE', 'PAGADO')).toBe(true);
  });

  it('PAGADO puede pasar a ENVIADO', () => {
    expect(puedeCambiarEstado('PAGADO', 'ENVIADO')).toBe(true);
  });

  it('un pedido CANCELADO no puede cambiar de estado', () => {
    expect(puedeCambiarEstado('CANCELADO', 'PAGADO')).toBe(false);
  });

  it('un pedido ENVIADO no se puede cancelar', () => {
    expect(puedeCambiarEstado('ENVIADO', 'CANCELADO')).toBe(false);
  });
});
