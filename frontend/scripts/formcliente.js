document.getElementById("formRegistroCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const tipoCliente = document.getElementById("tipoCliente").value;
    const documento = document.getElementById("documento").value;

    try {
        // Enviar los datos al backend para registrar al cliente
        const response = await axios.post('/api/cliente/registrar', {
            correo,
            telefono,
            tipoCliente,
            documento
        });

        // Mostrar el mensaje de éxito
        alert('Cliente registrado exitosamente');
        
        // Redirigir a la página de registrar préstamo
        window.location.href = '/registrar-prestamo';  // Cambiar la URL según corresponda
    } catch (error) {
        console.error('Error al registrar el cliente:', error);
        alert('Hubo un error al registrar al cliente. Intenta nuevamente.');
    }
});

  