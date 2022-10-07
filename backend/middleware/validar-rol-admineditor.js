const { response } = require('express');

const validarRolAdmin = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_ADMIN' && !rol != 'ROL_EDITOR') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_ADMIN, ROL_EDITOR'
        });
    }

    next();
}

module.exports = { validarRolAdmin }