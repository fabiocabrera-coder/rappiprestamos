const PDFDocument = require('pdfkit');
const fs = require('fs');

// Supongamos que ya tienes una estructura para cliente y préstamo
const { Client, Loan } = require('../models');

const generateReceipt = async (clientId, loanId, isJurídica) => {
  try {
    // Obtén la información del cliente y el préstamo
    const client = await Client.findByPk(clientId);
    const loan = await Loan.findByPk(loanId);

    if (!client || !loan) {
      throw new Error('Client or loan not found');
    }

    // Crea un nuevo documento PDF
    const doc = new PDFDocument();

    // Define el nombre del archivo (puedes ajustarlo a tus necesidades)
    const receiptFilename = `receipt_${loanId}_${clientId}.pdf`;

    // Crea el flujo de escritura del archivo
    doc.pipe(fs.createWriteStream(`./receipts/${receiptFilename}`));

    // Encabezado
    doc.fontSize(20).text(isJurídica ? 'Factura' : 'Boleta', { align: 'center' });
    doc.moveDown();

    // Datos del cliente
    doc.fontSize(12).text(`Cliente: ${client.name}`, { align: 'left' });
    doc.text(`DNI/RUC: ${client.dniRuc}`, { align: 'left' });
    doc.text(`Dirección: ${client.address}`, { align: 'left' });
    doc.text(`Teléfono: ${client.phoneNumber}`, { align: 'left' });
    doc.moveDown();

    // Datos del préstamo
    doc.text(`Monto del préstamo: ${loan.amount}`, { align: 'left' });
    doc.text(`Fecha de inicio: ${loan.startDate.toISOString().slice(0, 10)}`, { align: 'left' });
    doc.text(`Fecha de vencimiento: ${loan.dueDate.toISOString().slice(0, 10)}`, { align: 'left' });
    doc.text(`Monto total a pagar: ${loan.totalAmount}`, { align: 'left' });
    doc.text(`Interés aplicado: ${loan.interest}%`, { align: 'left' });
    doc.text(`Monto ya pagado: ${loan.amountPaid}`, { align: 'left' });

    // Total pendiente
    const balanceDue = loan.totalAmount - loan.amountPaid;
    doc.text(`Saldo pendiente: ${balanceDue}`, { align: 'left' });

    // Finaliza el PDF
    doc.end();

    return receiptFilename;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
};

module.exports = { generateReceipt };
