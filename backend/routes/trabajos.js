/*
Ruta base: /api/trabajos
*/

const { Router } = require('express');
const { obtenerTrabajos, obtenerTrabajosAluVisibles, obtenerTrabajosAluNoVisibles, crearTrabajo, actualizarTrabajo, borrarTrabajo, limpiarMultimediaTrabajo, obtenerTrabajosEditor, actualizarEstadoTrabajo, agregarContenidoTrabajo, borrarContenidoTrabajo, obtenerTrabajosMasValorados, obtenerTrabajosRecientes, obtenerTrabajosVisibles, obtenerTrabajosAleatorios, actualizarFeedbackTrabajo, agregarValoracionTrabajo, quitarValoracionTrabajo } = require('../controllers/trabajos');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');
const { validarRolEditor } = require('../middleware/validar-rol-editor');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajos);

router.get('/tv/', [ // get trabajos visibles todos
    //validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosVisibles);

router.get('/aleatorios/', [ // get trabajos visibles aleatorios
    //validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosAleatorios);

router.get('/mv/', [ // obtener más valorados
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosMasValorados);

router.get('/mr/', [ // obtener más recientes
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosRecientes);

router.get('/tr/', [ // trabajos revisión
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
    validarRolEditor
], obtenerTrabajosEditor);

router.get('/v/', [ // trabajos visibles del alumno
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosAluVisibles);

router.get('/nv/', [ // trabajos no visibles del alumno
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerTrabajosAluNoVisibles);

router.post('/', [
    validarJWT,
    validarCampos,
    validarRolAdmin,
], crearTrabajo);

router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
    validarRol,
], actualizarTrabajo);

router.put('/et/:id', [ // estado trabajo
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], actualizarEstadoTrabajo);

router.put('/af/:id', [ // agregar feedback trabajo denegado
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], actualizarFeedbackTrabajo);

router.put('/av/:id', [ // agregar valoracion
    // validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], agregarValoracionTrabajo);

router.put('/qv/:id', [ // quitar valoracion
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], quitarValoracionTrabajo);

router.put('/ac/:id', [ // ac agregar contenido
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
], agregarContenidoTrabajo);

router.put('/bc/:id', [ // bc borrar contenido
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
], borrarContenidoTrabajo);

router.put('/lm/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarRol,
], limpiarMultimediaTrabajo);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarRolAdmin,
], borrarTrabajo);


module.exports = router;