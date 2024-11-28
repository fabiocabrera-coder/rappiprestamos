const Pago = require('../models/pago.js');
const Prestamo = require('../models/prestamo.js');
const Comprobante = require('../models/comprobante.js'); // Modelo de comprobante
const { calcularMora } = require('../utils/calculadores.js'); // Función para calcular mora

// Registrar un pago
exports.registrarPago = async (pagoData) => {
    const { prestamoId, montoPagado, fechaPago } = pagoData;

    // Buscar el préstamo
    const prestamo = await Prestamo.findById(prestamoId);
    if (!prestamo) {
        throw new Error('Préstamo no encontrado');
    }

    // Calcular la mora si aplica
    const mora = calcularMora(prestamo, fechaPago);
    const montoFinal = montoPagado + mora;

    // Crear el pago
    const pago = new Pago({
        prestamoId,
        montoPagado: montoFinal,
        fechaPago,
        mora,
    });

    await pago.save();

    // Actualizar el estado del préstamo
    prestamo.saldoPendiente -= montoFinal;
    if (prestamo.saldoPendiente <= 0) {
        prestamo.estado = 'pagado';
    }
    await prestamo.save();

    return pago;
};

// Obtener los pagos de un cliente
exports.obtenerPagosPorCliente = async (clienteId) => {
    return await Pago.find({ clienteId });
};

// Generar un comprobante de pago (boleta o factura)
exports.generarComprobante = async (tipo, clienteId, monto) => {
    // Generar el comprobante según el tipo (boleta o factura)
    const comprobante = new Comprobante({
        tipo,
        clienteId,
        monto,
        fecha: new Date(),
    });

    await comprobante.save();
    return comprobante;
};
