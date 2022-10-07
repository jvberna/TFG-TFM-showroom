/*
Ruta base: /api/titulaciones
*/

const { Router } = require('express');
const { obtenerTitulaciones, crearTitulacion, actualizarTitulacion, borrarTitulacion } = require('../controllers/titulaciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.get('/', [
    //validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTitulaciones);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('resumen', 'El argumento resumen es obligatorio').not().isEmpty().trim(),
    check('area', 'El argumento area es obligatorio').not().isEmpty(),
    validarCampos,
    validarRolAdmin
], crearTitulacion);

router.put('/:id', [
    validarJWT,
    // definir los campos que deberian ser obligatorios
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRolAdmin,
], actualizarTitulacion);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin
], borrarTitulacion);


module.exports = router;