const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');

/*
get / 
<-- desde? el salto para buscar en la lista de usuarios
    id? un identificador concreto, solo busca a este
--> devuleve todos los usuarios
*/
const obtenerUsuarios = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || "";
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {
            if (rolToken == 'ROL_ADMIN') {
                [usuarios, total] = await Promise.all([
                    Usuario.findById(id),
                    Usuario.findById(id).countDocuments()
                ]);
            } else if (idToken == id) { // comprobamos que el usuario que quiere obtener sus datos sea él mismo
                [usuarios, total] = await Promise.all([
                    Usuario.findById(id),
                    Usuario.findById(id).countDocuments()
                ]);
            }


        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { nombre_apellidos: textoBusqueda },
                        { email: textoBusqueda },
                        { rol: textoBusqueda },
                    ],
                };
            }
            [usuarios, total] = await Promise.all([
                Usuario.find(query).skip(desde).limit(registropp)
                .collation({ locale: "es" })
                .sort({ nombre_apellidos: 1 }),
                Usuario.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
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
            msg: 'Error obteniedo usuarios'
        });
    }
}

//GET solo alumnos
const obtenerAlumnos = async(req, res) => {

    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }

    try {

        let alumnos, total;
        let query = {};
        if (texto) {
            query = {
                $or: [
                    { nombre_apellidos: textoBusqueda },
                    { email: textoBusqueda },
                ],
            };
        }

        [alumnos] = await Promise.all([
            Usuario.find(query).find({ "rol": "ROL_ALUMNO" })
            .skip(desde)
            .limit(registropp)
            .collation({ locale: "es" })
            .sort({ nombre_apellidos: 1 }),
            Usuario.countDocuments(query)
        ]);
        total = alumnos.length;


        res.json({
            ok: true,
            msg: 'getAlumnos',
            alumnos,
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
            msg: 'Error obteniedo alumnos'
        });
    }
}

/*
post / 
<-- nombre, apellidos, email, password, rol?
--> usuario registrado
*/
const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Comrprobar que no existe un usuario con ese email registrado
        const exiteEmail = await Usuario.findOne({ email: email });

        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // Cifrar la contraseña, obtenemos el salt y ciframos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
        const { alta, ...object } = req.body;
        const usuario = new Usuario(object);
        usuario.password = cpassword;

        // Almacenar en BD
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crearUsuarios',
            usuario: usuario,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}

/*
post /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarUsuario = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;

    try {


        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });
        console.log("EMAILS: " + existeEmail._id + " y: " + uid);

        if (existeEmail) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;
    const rolToken = req.rolToken;
    const idToken = req.uidToken;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (rolToken != 'ROL_ADMIN' && idToken != uid) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        if (rolToken != "ROL_ADMIN") {
            // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
            // dos veces la contraseña nueva
            const validPassword = bcrypt.compareSync(password, usuarioBD.password);

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }



        if (nuevopassword !== nuevopassword2) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña repetida no coincide con la nueva contraseña',
            });
        }



        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}


module.exports = { obtenerUsuarios, obtenerAlumnos, crearUsuario, actualizarUsuario, actualizarPassword, borrarUsuario }