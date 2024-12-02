// script.js

document.getElementById('registroClienteForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    // Obtener los datos del formulario
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const tipoCliente = document.getElementById('tipoCliente').value;
    const documento = document.getElementById('documento').value;
  
    // Mostrar mensaje de carga
    document.getElementById('mensaje').textContent = "Registrando cliente...";
  
    try {
      // Realizar la petición al backend para registrar al cliente
      const response = await axios.post('http://localhost:3000/api/cliente/registrar', {
        correo,
        telefono,
        tipoCliente,
        documento
      });
  
      // Mostrar mensaje de éxito
      document.getElementById('mensaje').textContent = "Cliente registrado exitosamente!";
      document.getElementById('mensaje').style.color = "green";
    } catch (error) {
      // Mostrar mensaje de error
      document.getElementById('mensaje').textContent = "Error al registrar cliente: " + error.message;
      document.getElementById('mensaje').style.color = "red";
    }
  });
  