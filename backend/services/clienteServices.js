const { Client, Loan } = require('../models'); // Importar los modelos
const { Op } = require('sequelize');
const { generateReceipt } = require('./comprobanteServices.js'); // Emisión de comprobantes
const { filterClients } = require('./clientFilteringService.js'); // Filtrado de clientes

// Registrar un cliente
const registerClient = async (dniRuc, address, phoneNumber, email, dateOfBirth) => {
  try {
    // Verifica si el DNI/RUC ya está registrado
    const existingClient = await Client.findOne({ where: { dniRuc } });
    if (existingClient) {
      throw new Error('El DNI/RUC ya está registrado');
    }

    // Verificar si el cliente es mayor de 18 años
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 18) {
      throw new Error('El cliente debe ser mayor de 18 años');
    }

    // Crear un nuevo cliente
    const newClient = await Client.create({
      dniRuc,
      address,
      phoneNumber,
      email,
      dateOfBirth,
    });

    return newClient;
  } catch (error) {
    console.error('Error al registrar el cliente:', error);
    throw error;
  }
};

// Obtener cliente por ID
const getClientById = async (clientId) => {
  try {
    const client = await Client.findByPk(clientId, {
      include: [{ model: Loan }], // Incluye los préstamos del cliente
    });
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return client;
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    throw error;
  }
};

// Obtener todos los clientes
const getAllClients = async () => {
  try {
    const clients = await Client.findAll({
      include: [{ model: Loan }],
    });
    return clients;
  } catch (error) {
    console.error('Error al obtener todos los clientes:', error);
    throw error;
  }
};

// Filtrar clientes por estado del préstamo (deudores, al día, cancelados)
const getFilteredClients = async (status) => {
  try {
    const filteredClients = await filterClients(status);
    return filteredClients;
  } catch (error) {
    console.error('Error al filtrar clientes:', error);
    throw error;
  }
};

// Crear un préstamo para un cliente
const createLoanForClient = async (clientId, amount, termInMonths) => {
  try {
    // Verifica si el cliente existe
    const client = await Client.findByPk(clientId);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    // Verifica que el monto no exceda los 5000 soles
    if (amount > 5000) {
      throw new Error('El monto del préstamo no puede ser superior a 5000 soles');
    }

    // Calcular el interés y el monto total a pagar
    let interestRate = 0;
    let dueAmount = 0;

    if (termInMonths === 1) {
      interestRate = 0.10; // 10% de interés para 1 mes
      dueAmount = amount * (1 + interestRate); // Interés aplicado
    } else if (termInMonths === 6) {
      interestRate = 0.20; // 20% de interés para 6 meses
      dueAmount = amount * (1 + interestRate); // Interés aplicado
    } else {
      throw new Error('El plazo del préstamo solo puede ser de 1 o 6 meses');
    }

    // Crear el préstamo
    const newLoan = await Loan.create({
      clientId,
      amount,
      termInMonths,
      interestRate,
      dueAmount,
      startDate: new Date(),
      dueDate: calculateDueDate(termInMonths),
      status: 'pending', // Estado inicial del préstamo
    });

    return newLoan;
  } catch (error) {
    console.error('Error al crear el préstamo:', error);
    throw error;
  }
};

// Calcular la fecha de vencimiento del préstamo
const calculateDueDate = (termInMonths) => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + termInMonths);
  return currentDate;
};

// Registrar el pago de una cuota
const registerPayment = async (clientId, loanId, paymentAmount) => {
  try {
    // Verificar si el cliente y el préstamo existen
    const client = await Client.findByPk(clientId);
    const loan = await Loan.findByPk(loanId);

    if (!client || !loan) {
      throw new Error('Cliente o préstamo no encontrados');
    }

    // Verificar que el pago no sea mayor al saldo pendiente
    const remainingBalance = loan.dueAmount - loan.amountPaid;
    if (paymentAmount > remainingBalance) {
      throw new Error('El monto del pago no puede ser mayor al saldo pendiente');
    }

    // Actualizar el monto pagado en el préstamo
    loan.amountPaid += paymentAmount;
    loan.status = loan.amountPaid === loan.dueAmount ? 'paid' : 'pending'; // Cambiar estado si está pagado
    await loan.save();

    // Generar el recibo
    const isJurídica = client.dniRuc.length === 11; // Determina si es una persona jurídica (RUC 11 dígitos)
    const receiptFilename = await generateReceipt(clientId, loanId, isJurídica);

    return {
      message: 'Pago registrado exitosamente',
      receiptFilename,
      remainingBalance: loan.dueAmount - loan.amountPaid,
      status: loan.status,
    };
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    throw error;
  }
};

// Cambiar el estado de un préstamo a "deuda judicial" si no se paga en un año
const markLoanAsJudicial = async (loanId) => {
  try {
    const loan = await Loan.findByPk(loanId);

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    const today = new Date();
    const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));

    // Verifica si el préstamo tiene más de un año de atraso y no se ha pagado
    if (loan.dueDate < oneYearAgo && loan.status !== 'paid') {
      loan.status = 'judicial';
      await loan.save();
    }

    return loan;
  } catch (error) {
    console.error('Error al marcar la deuda como judicial:', error);
    throw error;
  }
};

// Exportar los servicios
module.exports = {
  registerClient,
  getClientById,
  getAllClients,
  getFilteredClients,
  createLoanForClient,
  registerPayment,
  markLoanAsJudicial,
};

