const Prestamo = require('../models/prestamo.js');
const DeudaJudicial = require('../models/deudaJudicial.js');

// Marcar un préstamo como deuda judicial si ha pasado un año sin pago
exports.marcarDeudaJudicial = async (prestamoId) => {
    const prestamo = await Prestamo.findById(prestamoId);
    if (!prestamo) {
        throw new Error('Préstamo no encontrado');
    }

    // Verificar si el préstamo tiene más de un año sin pagos
    const fechaUltimoPago = prestamo.fechaUltimoPago;
    const diferenciaEnAnios = (new Date() - new Date(fechaUltimoPago)) / (1000 * 3600 * 24 * 365);

    if (diferenciaEnAnios >= 1) {s
        const deudaJudicial = new DeudaJudicial({
            prestamoId,
            fechaMarcado: new Date(),
        });
        await deudaJudicial.save();

        // Cambiar el estado del préstamo a "deuda judicial"
        prestamo.estado = 'deuda judicial';
        await prestamo.save();

        return deudaJudicial;
    } else {
        throw new Error('El préstamo no tiene más de un año sin pagos');
    }
};

// Obtener todas las deudas judiciales
exports.obtenerDeudasJudiciales = async () => {
    return await DeudaJudicial.find();
};
