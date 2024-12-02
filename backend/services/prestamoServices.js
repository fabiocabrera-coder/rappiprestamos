import { clienteDoc } from '../models/cliente.js';  // Para obtener los datos del cliente desde el DNI o RUC
import { client } from '../config/database.js'; // Asegúrate de que la ruta sea correcta
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake.js'; // Incluye la extensión .js

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
export const generarCronogramaPagos = (montoTotal, plazo, fechaRegistro) => {
  let pagoMensual;
  let cronograma = [];

  // Calcular el pago mensual
  if (plazo === 1) {
    // Si el plazo es de 1 mes, el pago será único
    pagoMensual = montoTotal;
    cronograma.push({ fecha: format(fechaRegistro, 'yyyy-MM-dd'), monto: pagoMensual });
  } else if (plazo === 6) {
    // Si el plazo es de 6 meses, se divide el monto total en 6 pagos mensuales
    pagoMensual = montoTotal / 6;
    for (let mes = 0; mes < 6; mes++) {
      // Sumar un mes a la fecha de registro para cada pago
      const fechaPago = new Date(fechaRegistro);
      fechaPago.setMonth(fechaPago.getMonth() + mes); // Sumar mes por mes
      cronograma.push({ 
        fecha: format(fechaPago, 'yyyy-MM-dd'), 
        monto: pagoMensual 
      });
    }
  }

  return cronograma;
};

// Función para registrar el préstamo
export const registrarPrestamo = async (documento, monto, plazo) => {
  // Obtener los datos del cliente por el documento
  const cliente = await clienteDoc.obtenerClientePorDocumento(documento);

  if (!cliente) {
      throw new Error('Cliente no encontrado.');
  }

  // Cálculo del monto total e interés (como ya lo tienes)
  const interes = plazo === 1 ? 0.10 : 0.20;
  const montoTotal = calcularInteresAnual(monto, interes, plazo);
  const cronograma = generarCronogramaPagos(montoTotal, plazo);

  try {
      const prestamoRegistrado = await registrarPrestamoEnDB(cliente.id, monto, montoTotal, plazo);

      if (!prestamoRegistrado) {
          throw new Error('No se pudo registrar el préstamo en la base de datos.');
      }

      // Generar el PDF con los datos del cliente y el cronograma
      generarPDF(cliente, cronograma);

      // Retorna los detalles del préstamo y el cronograma
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
    INSERT INTO prestamos (cliente_id, monto, monto_total, plazo, fecha_registro)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, cliente_id, monto, monto_total, plazo, fecha_registro;
  `;
  const values = [clienteId, monto, montoTotal, plazo];

  try {
    const res = await client.query(query, values);  // Usamos el cliente de la base de datos directamente
    return res.rows[0];  // Retorna el préstamo recién creado
  } catch (error) {
    throw new Error('Error al registrar el préstamo: ' + error.message);
  }
};

export const generarPDF = (cliente, cronograma) => {
  // Crear el contenido del PDF
  const documentDefinition = {
    content: [
      { text: 'Reporte de Préstamo', style: 'header' },
      { text: `Cliente: ${cliente.nombres} ${cliente.apellidopaterno} ${cliente.apellidomaterno}`, style: 'subheader' },
      { text: `Correo: ${cliente.correo}`, style: 'subheader' },
      // etc.
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 12,
        margin: [0, 0, 0, 5]
      }
    }
  };
  
  pdfMake.createPdf(documentDefinition).download('prestamo_cliente.pdf');
  
};


