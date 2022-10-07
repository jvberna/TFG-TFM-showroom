/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerUsuarios, obtenerAlumnos, crearUsuario, actualizarUsuario, actualizarPassword, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerUsuarios);

router.get('/alumnos', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
    validarRolAdmin,
], obtenerAlumnos);

router.post('/', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
    validarRolAdmin
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('nombre_apellidos', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], actualizarUsuario);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarPassword);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin
], borrarUsuario);


module.exports = router;