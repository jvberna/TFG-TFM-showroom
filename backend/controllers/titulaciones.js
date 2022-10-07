const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Titulacion = require('../models/titulaciones');

/*
get / 
<-- desde? el salto para buscar en la lista de titulaciones
    id? un identificador concreto, solo busca a este
--> devuleve todos los titulaciones
*/
const obtenerTitulaciones = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo una sola titulacion
    const id = req.query.id || "";

    try {

        let titulaciones, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [titulaciones, total] = await Promise.all([
                Titulacion.findById(id),
                Titulacion.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre: textoBusqueda },
                        { area: textoBusqueda },
                    ],
                };
            }

            if (req.query.desde) {
                [titulaciones, total] = await Promise.all([
                    Titulacion.find(query).
                    skip(desde).
                    limit(registropp),
                    Titulacion.countDocuments(query)
                ]);
            } else {
                [titulaciones, total] = await Promise.all([
                    Titulacion.find(query),
                    Titulacion.countDocuments(query)
                ]);
            }

        }

        res.json({
            ok: true,
            msg: 'getTitulaciones',
            titulaciones,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniendo titulaciones'
        });
    }
}

/*
post / 
<-- comprobar campos requeridos
--> titulacion registrada
*/
const crearTitulacion = async(req, res = response) => {

    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {

        // Comrprobar que no existe un usuario con ese email registrado
        const usu = await Titulacion.findById(idToken);

        // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
        const { alta, ...object } = req.body;
        const titulacion = new Titulacion(object);

        // Almacenar en BD
        await titulacion.save();

        res.json({
            ok: true,
            msg: 'crearTitulacion',
            titulacion,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando titulacion'
        });
    }
}

/*
put /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarTitulacion = async(req, res = response) => {

    const { imagen, ...object } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {



        titulacion = await Titulacion.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Titulacion actualizada',
            titulacion
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando titulacion'
        });
    }

}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarTitulacion = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const titulacion = await Titulacion.findById(uid);
        if (!titulacion) {
            return res.status(400).json({
                ok: true,
                msg: 'La titulacion no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Titulacion.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Titulacion eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando titulacion'
        });
    }
}


module.exports = { obtenerTitulaciones, crearTitulacion, actualizarTitulacion, borrarTitulacion }