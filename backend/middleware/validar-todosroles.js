const { response } = require('express');

const validarRolAdmin = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_ADMIN' && !rol != 'ROL_EDITOR' && !rol != 'ROL_ALUMNO') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_ADMIN, ROL_EDITOR, ROL_ALUMNO'
        });
    }

    next();
}

module.exports = { validarRolAdmin }