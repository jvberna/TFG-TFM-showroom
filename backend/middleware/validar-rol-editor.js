const { response } = require('express');

const validarRolEditor = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_EDITOR') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_EDITOR'
        });
    }

    next();
}

module.exports = { validarRolEditor }