const { Client, Loan } = require('../models');  // Asegúrate de que estas relaciones están definidas en tus modelos

const filterClients = async (status) => {
  try {
    let clients;

    if (status === 'deudores') {
      clients = await Client.findAll({
        include: {
          model: Loan,
          where: {
            status: 'pending',  // Aquí puedes ajustar según la lógica que utilices para los préstamos pendientes
            dueAmount: {
              [Sequelize.Op.gt]: 0,  // Si hay saldo pendiente
            },
          },
        },
      });
    } else if (status === 'alDia') {
      clients = await Client.findAll({
        include: {
          model: Loan,
          where: {
            status: 'paid',  // El préstamo está completamente pagado
          },
        },
      });
    } else if (status === 'cancelados') {
      clients = await Client.findAll({
        include: {
          model: Loan,
          where: {
            status: 'canceled',  // Este es un ejemplo, ajusta el estado según tu lógica
          },
        },
      });
    } else {
      throw new Error('Invalid status filter');
    }

    return clients;
  } catch (error) {
    console.error('Error filtering clients:', error);
    throw error;
  }
};

module.exports = { filterClients };
