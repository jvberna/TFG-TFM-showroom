const { response } = require('express');

const validarRolAlumno = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_ALUMNO') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitido: ROL_ALUMNO'
        });
    }

    next();
}

module.exports = { validarRolAlumno }