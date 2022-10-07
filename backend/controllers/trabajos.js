const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Trabajo = require('../models/trabajos');
const Usuario = require('../models/usuarios');
const Titulacion = require('../models/titulaciones');

/*
get / 
<-- desde? el salto para buscar en la lista de trabajos
    id? un identificador concreto, solo busca a este
--> devuleve todos los trabajos
*/
const obtenerTrabajos = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [trabajos, total] = await Promise.all([
                Trabajo.findById(id).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(id)
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) {
                query = {
                    $or: [
                        { titulo: textoBusqueda },
                    ],
                };
            }
            if (req.query.desde) {
                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion'),
                    Trabajo.countDocuments(query)
                ]);
            } else {
                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).populate('autor').populate('titulacion'),
                    Trabajo.countDocuments(query)
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'getTrabajos',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosVisibles = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;

        if (id) {

            [trabajos, total] = await Promise.all([
                Trabajo.findById(id).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(id)
            ]);
            if (!trabajos.visible) {
                return res.status(400).json({
                    ok: true,
                    msg: 'El trabajo no es visible'
                });
            }

        } else {
            let query = {};
            if (texto) {
                console.log("TEXTO: ", texto);
                query = { $or: [{ titulo: textoBusqueda }, { 'titulacion.nombre': textoBusqueda }], visible: true };
            }
            if (req.query.desde) {
                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion.titulacion'),
                    Trabajo.countDocuments(query)
                ]);
            } else {
                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).populate('autor').populate('titulacion.titulacion'),
                    Trabajo.countDocuments(query)
                ]);
            }
        }

        console.log("TRARARA: ", trabajos);


        res.json({
            ok: true,
            msg: 'getTrabajos',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosAleatorios = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;
        let query = {};
        query = {
            visible: true
        };
        if (req.query.desde) {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(query)
            ]);
        } else {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(query)
            ]);
        }
        let auxtrabajos = []; // auxiliar para elegir 10 trabajos aleatorios
        var cantidadNumeros = 10;
        var cant = total;
        var myArray = [];
        while (myArray.length < cantidadNumeros) {
            var numeroAleatorio = Math.floor(Math.random() * cant);
            var existe = false;
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i] == numeroAleatorio) {
                    existe = true;
                    break;
                }
            }
            if (!existe) {
                myArray[myArray.length] = numeroAleatorio;
                auxtrabajos.push(trabajos[numeroAleatorio]);
            }
        }

        console.log("Array numeros: ", myArray);
        // console.log("Auxtrabajos: ", auxtrabajos);
        // console.log("Trabajos: ", trabajos);
        console.log("total: ", total)

        trabajos = auxtrabajos;

        res.json({
            ok: true,
            msg: 'getTrabajos',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosMasValorados = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;
        let query = {};
        query = {
            visible: true
        };
        if (req.query.desde) {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion').sort({ valoracion: 1 }),
                Trabajo.countDocuments(query)
            ]);
        } else {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).sort({ valoracion: -1 }).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getTrabajos',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosRecientes = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;
        let query = {};
        query = {
            visible: true
        };
        if (req.query.desde) {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion').sort({ alta: 1 }),
                Trabajo.countDocuments(query)
            ]);
        } else {
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).populate('autor').populate('titulacion').sort({ alta: 1 }),
                Trabajo.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getTrabajos',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosEditor = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    let revisar = new RegExp("Pendiente de revisión", "i");
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un trabajo
    const id = req.query.id || "";

    try {

        let trabajos, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [trabajos, total] = await Promise.all([
                Trabajo.findById(id).populate('autor').populate('titulacion'),
                Trabajo.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            let query = {};
            if (texto) { // si hay texto es que el alumno quiere buscar entre sus trabajos
                query = {
                    $and: [
                        { estado: revisar },
                        {
                            $or: [
                                { titulo: textoBusqueda },
                            ],
                        }
                    ]

                };
            } else {
                query = {
                    $and: [
                        { estado: revisar },
                    ]

                };
            }
            [trabajos, total] = await Promise.all([
                Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion'),
                Trabajo.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getTrabajosEditor',
            trabajos,
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
            msg: 'Error obteniendo trabajos para revisar'
        });
    }
}

const obtenerTrabajosAluVisibles = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    const id = req.query.id || "";
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    let query = {}; // declaramos la query aquí para usarla luego para cada caso

    try {

        let trabajos, total;
        if (id) {
            if (idToken == id) { // Comprobamos que sea un alumno quien cargue sus trabajos
                if (texto) { // si hay texto es que el alumno quiere buscar entre sus trabajos
                    query = {
                        $and: [
                            { visible: true },
                            { autor: idToken },
                            {
                                $or: [
                                    { titulo: textoBusqueda },
                                ],
                            }
                        ]

                    };
                } else { // sino se prepara la query con sus trabajos globales
                    query = {
                        $and: [
                            { visible: true },
                            { autor: idToken },
                        ]

                    };
                }

                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion'),
                    Trabajo.find(query).countDocuments()
                ]);
            } else if (rolToken == "ROL_ADMIN") {
                [trabajos, total] = await Promise.all([
                    Trabajo.findById(id).populate('autor').populate('titulacion'),
                    Trabajo.findById(id).countDocuments()
                ]);
            }


        } else if (rolToken == "ROL_ADMIN") {
            if (texto) {
                query = {
                    $and: [
                        { visible: true },
                        {
                            $or: [
                                { autor: textoBusqueda },
                                { titulo: textoBusqueda },
                                { titulacion: textoBusqueda },
                            ],
                        }
                    ]

                };

            }
            [trabajos, total] = await Promise.all([
                Trabajo.populate('autor').populate('titulacion').find(query).skip(desde).limit(registropp),
                Trabajo.countDocuments(query)
            ]);

        } else {
            return res.status(400).json({
                ok: true,
                msg: 'No está autorizado para realizar esta operación'
            });
        }

        res.json({
            ok: true,
            msg: 'getTrabajosAluVisibles',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

const obtenerTrabajosAluNoVisibles = async(req, res) => {
    // Para paginación y buscador
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = "";
    if (texto) {
        textoBusqueda = new RegExp(texto, "i");
    }
    const id = req.query.id || "";
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    let query = {}; // declaramos la query aquí para usarla luego para cada caso

    try {

        let trabajos, total;
        if (id) {
            if (idToken == id) { // Comprobamos que sea un alumno quien cargue sus trabajos
                if (texto) { // si hay texto es que el alumno quiere buscar entre sus trabajos
                    query = {
                        $and: [
                            { visible: false },
                            { autor: idToken },
                            {
                                $or: [
                                    { titulo: textoBusqueda },
                                ],
                            }
                        ]

                    };
                } else { // sino se prepara la query con sus trabajos globales
                    query = {
                        $and: [
                            { visible: false },
                            { autor: idToken },
                        ]

                    };
                }

                [trabajos, total] = await Promise.all([
                    Trabajo.find(query).skip(desde).limit(registropp).populate('autor').populate('titulacion'),
                    Trabajo.find(query).countDocuments()
                ]);
            } else if (rolToken == "ROL_ADMIN") {
                [trabajos, total] = await Promise.all([
                    Trabajo.findById(id).populate('autor').populate('titulacion'),
                    Trabajo.countDocuments()
                ]);
            }


        } else if (rolToken == "ROL_ADMIN") {
            if (texto) {
                query = {
                    $and: [
                        { visible: true },
                        {
                            $or: [
                                { autor: textoBusqueda },
                                { titulo: textoBusqueda },
                                { titulacion: textoBusqueda },
                            ],
                        }
                    ]

                };

            }
            [trabajos, total] = await Promise.all([
                Trabajo.populate('autor').populate('titulacion').find(query).skip(desde).limit(registropp),
                Trabajo.countDocuments(query)
            ]);

        } else {
            return res.status(400).json({
                ok: true,
                msg: 'No está autorizado para realizar esta operación'
            });
        }


        res.json({
            ok: true,
            msg: 'getTrabajosAluNoVisibles',
            trabajos,
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
            msg: 'Error obteniendo trabajos'
        });
    }
}

/*
post / 
<-- comprobar campos requeridos
--> trabajo registrado
*/
const crearTrabajo = async(req, res = response) => {

    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    var ObjectId = require('mongodb').ObjectId;

    try {

        console.log("Que llega: ", req.body);

        // Comrprobar que no existe un usuario con ese email registrado
        const usu = await Usuario.findById(idToken);

        // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
        const { alta, titulacion, ...object } = req.body;
        const trabajo = new Trabajo(object);

        let titu = await Titulacion.findById(titulacion);
        trabajo.titulacion.nombre = titu.nombre;
        trabajo.titulacion.titulacion = titulacion;

        const r = Math.ceil(Math.random() * (4 - 1) + 1); // numero aleatorio del 1 al 4
        if (trabajo.area == "Construcción") {
            trabajo.imagen = 'const' + r + '.jpg'
        }
        if (trabajo.area == "Tecnologías de la información y las comunicaciones") {
            trabajo.imagen = 'tecno' + r + '.jpg'
        }
        if (trabajo.area == "Ciencia y tecnologías para la salud" || trabajo.area == "Ciencia de la salud") {
            trabajo.imagen = 'salud' + r + '.jpg'
        }
        if (trabajo.area == "Industrial y aeronáutica") {
            trabajo.imagen = 'aero' + r + '.jpg'
        }

        // Almacenar en BD
        await trabajo.save();

        res.json({
            ok: true,
            msg: 'crearTrabajo',
            trabajo,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando trabajo'
        });
    }
}

/*
put /:id
<-- nombre, apellidos, email, rol   
--> usuario actualizado
*/

const actualizarTrabajo = async(req, res = response) => {

    const { imagen, titulacion, ...object } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    var ObjectId = require('mongodb').ObjectId;

    console.log("Que llega: ", req.body);

    try {

        const usu = await Usuario.findById(idToken);
        let trabajo = await Trabajo.findById(uid);
        //comprobamos que ese trabajo sea suyo
        if (trabajo.autor != ObjectId(usu._id).toString() && rolToken != "ROL_ADMIN") {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no tiene permisos para actualizar este trabajo'
            });
        }


        trabajo = await Trabajo.findByIdAndUpdate(uid, object, { new: true });

        //console.log("is nan: ", titulacion[0]);

        if (rolToken == "ROL_ADMIN") {
            if (titulacion[0] == 6) { // comprobamos si llega un object id, eso será que se ha actualizado la titulacion del trabajo
                let titu = await Titulacion.findById(titulacion);
                trabajo.titulacion.nombre = titu.nombre;
                trabajo.titulacion.titulacion = titulacion;

                // Almacenar en BD
                await trabajo.save();
            }
        }

        res.json({
            ok: true,
            msg: 'Trabajo actualizado',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

const actualizarEstadoTrabajo = async(req, res = response) => {

    const { estado } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {

        let trabajo = await Trabajo.findById(uid);

        if (trabajo.autor != idToken && rolToken != "ROL_ADMIN" && rolToken != "ROL_EDITOR") {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no tiene permisos para actualizar este trabajo'
            });
        }

        trabajo.estado = estado;
        if (estado == "Aceptado") {
            trabajo.visible = true;
        }
        if (estado == "Pendiente de revisión") {
            trabajo.visible = false;
        }

        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Estado Trabajo actualizado',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

// Funcion para añadir un nuevo feedback cuando un editor rechaza un trabajo
const actualizarFeedbackTrabajo = async(req, res = response) => {

    const { feedback } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {

        let trabajo = await Trabajo.findById(uid);

        if (trabajo.autor != idToken && rolToken != "ROL_ADMIN" && rolToken != "ROL_EDITOR") {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no tiene permisos para actualizar este trabajo'
            });
        }
        console.log("Feedback: ", feedback);
        trabajo.feedback.push(feedback);

        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Feedback Trabajo actualizado',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando feedback trabajo'
        });
    }

}

const agregarValoracionTrabajo = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    console.log(req.body);

    try {

        let trabajo = await Trabajo.findById(uid);
        let valorado = false;

        for (let i = 0; i < trabajo.valoraciones.length; i++) {
            if (trabajo.valoraciones[i] == req.body.usuario) valorado = true;
        }

        if (valorado) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario ya ha valorado este trabajo'
            });
        }
        console.log(trabajo.valoraciones);

        trabajo.valoraciones.push(req.body.usuario);

        trabajo.valoracion = trabajo.valoracion + 1;
        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Valoración Trabajo actualizada',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

const quitarValoracionTrabajo = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {

        let trabajo = await Trabajo.findById(uid);
        let empresa = await Usuario.findById(idToken);

        if (rolToken != "ROL_EMPRESA") {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no tiene permisos para valorar este trabajo'
            });
        }

        let boolval = false; // booleano para comprobar si ha valorado ese trabajo
        for (let i = 0; i < empresa.valorados.length; i++) {
            if (empresa.valorados[i] == uid) {
                empresa.splice(i, 1);
                boolval = true;
            }
        }

        if (!boolval) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no ha valorado este trabajo'
            });
        }

        await empresa.save();

        trabajo.valoracion = trabajo.valoracion - 1;
        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Valoración Trabajo actualizada',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

const agregarContenidoTrabajo = async(req, res = response) => {

    const { contenido } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    var ObjectId = require('mongodb').ObjectId;
    const num = req.query.num;


    try {
        const usu = await Usuario.findById(idToken);
        let trabajo = await Trabajo.findById(uid);

        if (!trabajo) {
            return res.status(400).json({
                ok: true,
                msg: 'El trabajo no existe'
            });
        }

        //comprobamos que ese trabajo sea suyo o sea un admin
        if (trabajo.autor != ObjectId(usu._id).toString() && rolToken != "ROL_ADMIN") {
            return res.status(400).json({
                ok: true,
                msg: 'No tienes permisos para actualizar este trabajo'
            });
        }
        console.log("NUMMMM: ", num);
        console.log("Contenido: ", contenido);
        console.log("La REQ que llega: ", req.body);


        if (num == -1) {
            trabajo.contenidos.push(req.body);
        } else {
            trabajo.contenidos[num].nombre = req.body.nombre;
            trabajo.contenidos[num].descripcion = req.body.descripcion;
        }


        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Contenidos Trabajo actualizado',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

const borrarContenidoTrabajo = async(req, res = response) => {

    const { posicion } = req.body;
    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    var ObjectId = require('mongodb').ObjectId;

    try {
        const usu = await Usuario.findById(idToken);
        let trabajo = await Trabajo.findById(uid);

        if (!trabajo) {
            return res.status(400).json({
                ok: true,
                msg: 'El trabajo no existe'
            });
        }

        //comprobamos que ese trabajo sea suyo o sea un admin
        if (trabajo.autor != ObjectId(usu._id).toString() && rolToken != "ROL_ADMIN") {
            return res.status(400).json({
                ok: true,
                msg: 'No tienes permisos para actualizar este trabajo'
            });
        }

        console.log("Contenidos de la posicion: ", trabajo.contenidos[posicion]);
        trabajo.contenidos.splice(posicion, 1);
        await trabajo.save();

        console.log("La REQ que llega: ", req.body);

        // trabajo.contenidos.push(req.body);

        // await trabajo.save();

        res.json({
            ok: true,
            msg: 'Contenido Trabajo borrado',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

const limpiarMultimediaTrabajo = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;
    var ObjectId = require('mongodb').ObjectId;

    try {

        const usu = await Usuario.findById(idToken);
        let trabajo = await Trabajo.findById(uid);
        //comprobamos que ese trabajo sea suyo
        if (trabajo.autor != ObjectId(usu._id).toString()) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no es el autor del trabajo'
            });
        }


        trabajo.imagenes = [];
        trabajo.videos = [];
        trabajo.documentos = [];
        trabajo.audios = [];

        await trabajo.save();

        res.json({
            ok: true,
            msg: 'Contenidos multimedia del trabajo limpiados',
            trabajo
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando trabajo'
        });
    }

}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarTrabajo = async(req, res = response) => {

    const uid = req.params.id;
    const idToken = req.uidToken;
    const rolToken = req.rolToken;

    try {
        // Comprobamos si existe el usuario que queremos borrar
        const trabajo = await Trabajo.findById(uid);
        if (!trabajo) {
            return res.status(400).json({
                ok: true,
                msg: 'El trabajo no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Trabajo.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Trabajo eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando trabajo'
        });
    }
}


module.exports = { obtenerTrabajos, obtenerTrabajosVisibles, obtenerTrabajosAleatorios, obtenerTrabajosRecientes, obtenerTrabajosMasValorados, obtenerTrabajosEditor, obtenerTrabajosAluVisibles, obtenerTrabajosAluNoVisibles, crearTrabajo, actualizarTrabajo, actualizarEstadoTrabajo, agregarValoracionTrabajo, quitarValoracionTrabajo, agregarContenidoTrabajo, borrarContenidoTrabajo, limpiarMultimediaTrabajo, borrarTrabajo, actualizarFeedbackTrabajo }