document.getElementById("formRegistrarPrestamo").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const clienteId = document.getElementById("clienteId").value;
    const monto = document.getElementById("monto").value;
    const plazo = document.getElementById("plazo").value;
    const interes = document.getElementById("interes").value;

    try {
        // Enviar los datos al backend para registrar el préstamo
        const response = await axios.post('/api/prestamo/registrar', {
            clienteId,
            monto,
            plazo,
            interes
        });

        // Mostrar el mensaje de éxito
        alert('Préstamo registrado exitosamente');
        
        // Opcional: Redirigir a otra página si es necesario (por ejemplo, listado de préstamos)
        window.location.href = '/prestamos';  // Cambiar la URL según corresponda
    } catch (error) {
        console.error('Error al registrar el préstamo:', error);
        alert('Hubo un error al registrar el préstamo. Intenta nuevamente.');
    }
});
