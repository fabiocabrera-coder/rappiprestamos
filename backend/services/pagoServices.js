import { Pago } from '../models/pago.js';
import { clienteDoc } from '../models/cliente.js';
import pdfMake from 'pdfmake/build/pdfmake.js';

// Función para registrar el pago y generar la boleta o factura
export const registrarPagoService = async (documento, prestamoId, monto) => {
    // Buscar al cliente por su documento (DNI o RUC)
    const cliente = await clienteDoc.obtenerClientePorDocumento(documento);

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    // Determinar el tipo de pago según el tipo de cliente
    const tipoPago = cliente.tipo_cliente === 'personaNatural' ? 'Boleta' : 'Factura';

    // Registrar el pago en la base de datos
    const pagoRegistrado = await Pago.create({
        clienteId: cliente.id,
        prestamoId,
        monto,
        tipoPago
    });

    // Generar PDF del recibo (boleta o factura)
    generarPDFPago(cliente, pagoRegistrado, tipoPago);

    return pagoRegistrado;
};

// Función para generar la boleta o factura en PDF
export const generarPDFPago = (cliente, pago, tipoPago) => {
    const documentDefinition = {
        content: [
            { text: `Reporte de ${tipoPago}`, style: 'header' },
            { text: `Cliente: ${cliente.nombres} ${cliente.apellidopaterno} ${cliente.apellidomaterno}`, style: 'subheader' },
            { text: `Documento: ${cliente.documento}`, style: 'subheader' },
            { text: `Monto del pago: S/ ${pago.monto}`, style: 'subheader' },
            { text: `Fecha del pago: ${pago.fecha_pago}`, style: 'subheader' },
            { text: `ID del préstamo: ${pago.prestamo_id}`, style: 'subheader' },
            { text: `Tipo de Pago: ${tipoPago}`, style: 'subheader' }
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

    // Descargar el PDF
    pdfMake.createPdf(documentDefinition).download(`${tipoPago}_${cliente.documento}.pdf`);
};
