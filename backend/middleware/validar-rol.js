const { response } = require('express');
const rolesPermitidos = ['ROL_ALUMNO', 'ROL_EDITOR', 'ROL_ADMIN', 'ROL_EMPRESA'];

const validarRol = (req, res = response, next) => {

    const rol = req.body.rol;

    if (rol && !rolesPermitidos.includes(rol)) {
        return res.status(400).json({
            ok: false,
            msg: 'Rol inválido, permitidos: ROL_ALUMNO, ROL_PROFESOR, ROL_ADMIN'
        });
    }
    next();
}

module.exports = { validarRol }