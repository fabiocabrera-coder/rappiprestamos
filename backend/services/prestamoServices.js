const { Client, Loan } = require('../models'); // Importar los modelos de Cliente y Préstamo
const { generateReceipt } = require('./receiptService'); // Emisión de comprobantes

// Calcular el interés de un préstamo
const calcularInteres = (monto, tipo, plazo) => {
    let interes = 0;

    if (tipo === 'personal') {
        if (plazo === 1) {
            interes = monto * 0.10; // 10% para préstamos a 1 mes
        } else if (plazo === 6) {
            interes = monto * 0.20; // 20% para préstamos a 6 meses
        }
    }
    // Puedes agregar más tipos de préstamos e intereses si es necesario

    return interes;
};

// Generar cronograma de pagos
const generarCronogramaPagos = (plazo, montoTotal) => {
    let cronograma = [];
    let mensualidad = montoTotal / plazo; // Supongamos que el pago es fijo

    for (let i = 1; i <= plazo; i++) {
        cronograma.push({
            cuota: i,
            monto: mensualidad,
            estado: 'pendiente', // Estado inicial de las cuotas
            fechaVencimiento: new Date().setMonth(new Date().getMonth() + i)
        });
    }

    return cronograma;
};

// Crear un préstamo para un cliente
const crearPrestamo = async (clienteId, monto, tipo, plazo) => {
    try {
        // Verifica si el cliente existe
        const cliente = await Client.findByPk(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // Calcular el interés y el monto total a pagar
        const interes = calcularInteres(monto, tipo, plazo);
        const montoTotal = monto + interes;

        // Generar cronograma de pagos
        const cronograma = generarCronogramaPagos(plazo, montoTotal);

        // Crear el préstamo
        const prestamo = await Loan.create({
            clienteId,
            monto,
            interes,
            montoTotal,
            cronograma,
            estado: 'activo',
            tipo,
            plazo,
        });

        return prestamo;
    } catch (error) {
        console.error('Error al crear el préstamo:', error);
        throw error;
    }
};

// Obtener todos los préstamos activos
const obtenerPrestamosActivos = async () => {
    try {
        return await Loan.findAll({ where: { estado: 'activo' } });
    } catch (error) {
        console.error('Error al obtener los préstamos activos:', error);
        throw error;
    }
};

// Obtener los detalles de un préstamo por ID
const obtenerPrestamoPorId = async (prestamoId) => {
    try {
        const prestamo = await Loan.findByPk(prestamoId);
        if (!prestamo) {
            throw new Error('Préstamo no encontrado');
        }
        return prestamo;
    } catch (error) {
        console.error('Error al obtener el préstamo:', error);
        throw error;
    }
};

// Registrar el pago de una cuota de un préstamo
const registrarPago = async (clienteId, prestamoId, montoPago) => {
    try {
        const cliente = await Client.findByPk(clienteId);
        const prestamo = await Loan.findByPk(prestamoId);

        if (!cliente || !prestamo) {
            throw new Error('Cliente o préstamo no encontrados');
        }

        // Verificar que el monto del pago no exceda el saldo pendiente
        const saldoPendiente = prestamo.montoTotal - prestamo.montoPagado;
        if (montoPago > saldoPendiente) {
            throw new Error('El monto del pago no puede ser mayor al saldo pendiente');
        }

        // Actualizar el monto pagado en el préstamo
        prestamo.montoPagado += montoPago;
        prestamo.estado = prestamo.montoPagado === prestamo.montoTotal ? 'pagado' : 'activo';
        await prestamo.save();

        // Generar recibo de pago
        const isJurídica = cliente.dniRuc.length === 11;
        const filenameRecibo = await generateReceipt(clienteId, prestamoId, isJurídica);

        return {
            mensaje: 'Pago registrado exitosamente',
            filenameRecibo,
            saldoRestante: prestamo.montoTotal - prestamo.montoPagado,
            estado: prestamo.estado,
        };
    } catch (error) {
        console.error('Error al registrar el pago:', error);
        throw error;
    }
};

// Cambiar el estado de un préstamo a "deuda judicial" si no se paga en un año
const marcarComoDeudaJudicial = async (prestamoId) => {
    try {
        const prestamo = await Loan.findByPk(prestamoId);

        if (!prestamo) {
            throw new Error('Préstamo no encontrado');
        }

        const hoy = new Date();
        const haceUnAnio = new Date(hoy.setFullYear(hoy.getFullYear() - 1));

        // Verifica si el préstamo tiene más de un año de atraso y no ha sido pagado
        if (prestamo.fechaVencimiento < haceUnAnio && prestamo.estado !== 'pagado') {
            prestamo.estado = 'judicial';
            await prestamo.save();
        }

        return prestamo;
    } catch (error) {
        console.error('Error al marcar el préstamo como deuda judicial:', error);
        throw error;
    }
};

module.exports = {
    crearPrestamo,
    obtenerPrestamosActivos,
    obtenerPrestamoPorId,
    registrarPago,
    marcarComoDeudaJudicial,
};

