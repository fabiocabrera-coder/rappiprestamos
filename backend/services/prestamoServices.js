import { Prestamo }  from '../models/prestamo.js';
import { clienteDoc } from '../models/cliente.js';  // Para obtener los datos del cliente desde el DNI o RUC

// Función para calcular el monto total con interés compuesto anual
export const calcularInteresAnual = (prestamo, interes, plazo) => {
    let n;
    if (plazo === 1) {
      n = 12; // Plazo de 1 mes, interés anual dividido en 12 meses
    } else if (plazo === 6) {
      n = 2; // Plazo de 6 meses, interés anual dividido en 2 periodos
    } else {
      throw new Error('Plazo no válido. Debe ser 1 o 6 meses.');
    }
  
    // Cálculo del monto total (principal + interés)
    const montoTotal = prestamo * Math.pow(1 + (interes / n), n);
    return montoTotal;
};
  
// Función para generar el cronograma de pagos
export const generarCronogramaPagos = (montoTotal, plazo) => {
    let pagoMensual;
    let cronograma = [];
  
    // Calcular el pago mensual
    if (plazo === 1) {
      // Si el plazo es de 1 mes, el pago será único
      pagoMensual = montoTotal;
      cronograma.push({ mes: 1, monto: pagoMensual });
    } else if (plazo === 6) {
      // Si el plazo es de 6 meses, se divide el monto total en 6 pagos mensuales
      pagoMensual = montoTotal / 6;
      for (let mes = 1; mes <= 6; mes++) {
        cronograma.push({ mes, monto: pagoMensual });
      }
    }
  
    return cronograma;
};
  
// Función para registrar el préstamo
export const registrarPrestamo = async (documento, monto, plazo) => {
  // Primero, obtener los datos del cliente por su DNI o RUC
  const cliente = await clienteDoc.obtenerClientePorDocumento(documento);
  if (!cliente) {
      throw new Error('Cliente no encontrado.');
  }

  // Verificamos que el monto sea válido
  if (monto <= 0) {
    throw new Error('El monto del préstamo debe ser mayor que 0.');
  }

  // Establecemos el interés según el plazo (10% para 1 mes, 20% para 6 meses)
  let interes = 0;
  if (plazo === 1) {
    interes = 0.10; // 10% anual para 1 mes
  } else if (plazo === 6) {
    interes = 0.20; // 20% anual para 6 meses
  } else {
    throw new Error('Plazo no válido. Debe ser 1 o 6 meses.');
  }

  // Calculamos el monto total con interés
  const montoTotal = calcularInteresAnual(monto, interes, plazo);

  // Generamos el cronograma de pagos
  const cronograma = generarCronogramaPagos(montoTotal, plazo);

  // Ahora guardar el préstamo en la base de datos
  try {
    const prestamoRegistrado = await registrarPrestamoEnDB(cliente.id, monto, montoTotal, plazo);

    // Devolvemos los datos del préstamo registrado y el cronograma de pagos
    return {
      prestamo: prestamoRegistrado,
      cronograma
    };
  } catch (error) {
    throw new Error('Error al registrar el préstamo: ' + error.message);
  }
};

  
// Función para registrar el préstamo en la base de datos
const registrarPrestamoEnDB = async (clienteId, monto, montoTotal, plazo) => {
    const query = `
      INSERT INTO prestamos (cliente_id, monto, monto_total, plazo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, cliente_id, monto, monto_total, plazo;
    `;
    const values = [clienteId, monto, montoTotal, plazo];
  
    try {
      const res = await Prestamo.create(values); // Usamos el método `create` del modelo de préstamo
      return res;  // Retorna el préstamo recién creado
    } catch (error) {
      throw new Error('Error al registrar el préstamo: ' + error.message);
    }
};

