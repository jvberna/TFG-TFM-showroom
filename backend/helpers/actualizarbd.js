const Usuario = require('../models/usuarios');
const Titulacion = require('../models/titulaciones');
const Trabajo = require('../models/trabajos');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizarBD = async(tipo, path, nombreArchivo, id, token) => {
    let fotoAntigua, pathFotoAntigua;
    //Comprobar que el trabajo sea suyo
    console.log("Tipo que llega para actualizar: ", tipo);
    switch (tipo) {

        case 'fotoperfil':

            const usuariofoto = await Usuario.findById(id);
            if (!usuariofoto) {
                return false;
            }

            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el usuario puede cambiar su foto
            if (infoToken(token).uid !== id) {
                console.log('el usuario que actualiza no es el propietario de la foto')
                return false;
            }

            fotoAntigua = usuario.imagen;
            pathFotoAntigua = `${path}/${fotoAntigua}`;
            if (fotoAntigua && fs.existsSync(pathFotoAntigua)) {
                fs.unlinkSync(pathFotoAntigua);
            }

            usuariofoto.imagen = nombreArchivo;
            await usuariofoto.save();

            return true;

            break;

        case 'titulacionimg':

            const titulacionfoto = await Titulacion.findById(id);
            if (!titulacionfoto) {
                return false;
            }
            console.log("Aqui se llega");

            //Comprobar que el id de usuario es un admin
            if (infoToken(token).rol !== "ROL_ADMIN") {
                console.log('no tienes permisos de admin')
                return false;
            }

            fotoAntigua = titulacionfoto.imagen;
            pathFotoAntigua = `${path}/${fotoAntigua}`;
            if (fotoAntigua && fs.existsSync(pathFotoAntigua)) {
                fs.unlinkSync(pathFotoAntigua);
            }

            titulacionfoto.imagen = nombreArchivo;
            await titulacionfoto.save();

            return true;

            break;

        case 'trabajoimg':

            const trabajofoto = await Trabajo.findById(id);
            if (!trabajofoto) {
                return false;
            }
            const usuariofototrabajo = await Usuario.findById(infoToken(token).uid);
            if (trabajofoto.autor != usuariofototrabajo.uid && infoToken(token).rol != "ROL_ADMIN") {
                console.log("El usuario no tiene permisos para actualizar");
            }

            fotoAntigua = trabajofoto.imagen;
            pathFotoAntigua = `${path}/${fotoAntigua}`;
            if (fotoAntigua && fs.existsSync(pathFotoAntigua)) {
                fs.unlinkSync(pathFotoAntigua);
            }

            trabajofoto.imagen = nombreArchivo;
            await trabajofoto.save();

            return true;

            break;

        case 'trabajoconts':

            console.log("Aqui no se actualiza nada, se hace con la peticion de trabajos");

            return true;

            break;
            // case 'trabajovideos':

            //     const trabajovideos = await Trabajo.findById(id);
            //     if (!trabajovideos) {
            //         return false;
            //     }

            //     const usuariovideostrabajo = await Usuario.findById(infoToken(token).uid);
            //     if (trabajovideos.autor != usuariovideostrabajo.uid) {
            //         console.log("el usuario no es el propietario del trabajo que quiere actualizar");
            //     }

            //     trabajovideos.videos.push(nombreArchivo);
            //     await trabajovideos.save();

            //     return true;

            //     break;
            // case 'trabajoaudios':

            //     const trabajoaudios = await Trabajo.findById(id);
            //     if (!trabajoaudios) {
            //         return false;
            //     }

            //     const usuarioaudiostrabajo = await Usuario.findById(infoToken(token).uid);
            //     if (trabajoaudios.autor != usuarioaudiostrabajo.uid) {
            //         console.log("el usuario no es el propietario del trabajo que quiere actualizar");
            //     }

            //     trabajoaudios.audios.push(nombreArchivo);
            //     await trabajoaudios.save();

            //     return true;

            //     break;
            // case 'trabajodocs':

            //     const trabajodocs = await Trabajo.findById(id);
            //     if (!trabajodocs) {
            //         return false;
            //     }

            //     const usuariodocstrabajo = await Usuario.findById(infoToken(token).uid);
            //     if (trabajodocs.autor != usuariodocstrabajo.uid) {
            //         console.log("el usuario no es el propietario del trabajo que quiere actualizar");
            //     }

            //     trabajodocs.documentos.push(nombreArchivo);
            //     await trabajodocs.save();

            //     return true;

            //     break;

        default:
            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }