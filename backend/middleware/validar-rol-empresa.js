const { response } = require('express');

const validarRolEmpresa = (req, res = response, next) => {

    const rol = req.rolToken;

    if (rol && rol != 'ROL_EMPRESA') {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitido: ROL_EMPRESA'
        });
    }

    next();
}

module.exports = { validarRolEmpresa }