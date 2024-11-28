// Calcular el interés de un préstamo con la fórmula proporcionada
exports.calcularInteres = (monto, tipo, plazo) => {
    // Se define la tasa de interés anual dependiendo del tipo de préstamo
    let tasaInteres = 0;
    if (tipo === '1mes') {
        tasaInteres = 10; // 10% para préstamos de 1 mes
    } else if (tipo === '6meses') {
        tasaInteres = 20; // 20% para préstamos de 6 meses
    }

    // Fórmula para calcular el interés: I = P * (i / 100) * n
    const interes = monto * (tasaInteres / 100) * plazo;
    return interes;
};

// Generar el cronograma de pagos 
exports.generarCronogramaPagos = (plazo, montoTotal) => {
    let cronograma = [];
    const cuota = montoTotal / plazo; // Dividimos el monto total por el número de meses para obtener la cuota mensual
    for (let i = 1; i <= plazo; i++) {
        cronograma.push({
            cuota: cuota,
            fechaPago: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000), // Fecha cada mes
        });
    }
    return cronograma;
};

// Calcular la mora por retraso 
exports.calcularMora = (prestamo, fechaPago) => {
    const fechaLimite = new Date(prestamo.fechaLimite);
    if (fechaPago > fechaLimite) {
        const diasAtraso = Math.ceil((fechaPago - fechaLimite) / (1000 * 3600 * 24));
        return (prestamo.montoTotal * 0.01) * diasAtraso; // Mora del 1% por día
    }
    return 0;
};

