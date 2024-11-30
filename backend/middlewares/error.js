const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Algo salió mal en el servidor',
        error: err.message,
    });
};

module.exports = errorHandler;