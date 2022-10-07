const { response } = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { actualizarBD } = require("../helpers/actualizarBD");
const fs = require("fs");

const subirArchivo = async(req, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No se ha enviado archivo",
        });
    }
    if (!req.files.archivo) {
        return res.status(400).json({
            ok: false,
            msg: `Debe enviarse el archivo como form-data llamado 'archivo'`,
        });
    }
    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`,
        });
    }

    const tipo = req.params.tipo; // tipos definidos
    const id = req.params.id;

    const archivosValidos = { //definir aqui todos los tipos posibles
        fotoperfil: ["jpeg", "jpg", "png", "PNG"],
        titulacionimg: ["jpeg", "jpg", "png", "PNG"],
        trabajoimg: ["jpeg", "jpg", "png", "PNG"],
        trabajoconts: ['jpeg', 'jpg', 'png', 'PNG', 'txt', 'xlsx', 'doc', 'docx', 'exe', 'mp3', 'wav', 'zip', 'rar', 'pdf'],
        // trabajovideos: ['mp4', 'MP4', 'avi', 'AVI'],
        // trabajoaudios: ['mp3', 'MP3', 'wav', 'WAV'],
        // trabajodocs: ['pdf', 'PDF'],
    };

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split(".");
    const extension = nombrePartido[nombrePartido.length - 1];

    console.log("Extension: ", extension);

    switch (tipo) {
        case "fotoperfil":
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.fotoperfil})`,
                });
            }

            // Comprobar que solo el usuario cambia su foto de usuario

            break;
        case "titulacionimg":
            if (!archivosValidos.titulacionimg.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.titulacionimg})`,
                });
            }
            break;
        case "trabajoimg":
            if (!archivosValidos.trabajoimg.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.trabajoimg})`,
                });
            }
            break;
        case "trabajoconts":
            if (!archivosValidos.trabajoconts.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.trabajoconts})`,
                });
            }
            break;
            // case "trabajovideos":
            //     if (!archivosValidos.trabajovideos.includes(extension)) {
            //         return res.status(400).json({
            //             ok: false,
            //             msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.trabajovideos})`,
            //         });
            //     }
            //     break;
            // case "trabajoaudios":
            //     if (!archivosValidos.trabajoaudios.includes(extension)) {
            //         return res.status(400).json({
            //             ok: false,
            //             msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.trabajoaudios})`,
            //         });
            //     }
            //     break;
            // case "trabajodocs":
            //     if (!archivosValidos.trabajodocs.includes(extension)) {
            //         return res.status(400).json({
            //             ok: false,
            //             msg: `El tipo de archivo '${extension}' no está permitido (${archivosValidos.trabajodocs})`,
            //         });
            //     }
            //     break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operacion no está permtida`,
                tipoOperacion: tipo,
            });
            break;
    }

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const patharchivo = `${path}/${nombreArchivo}`;

    console.log(path, nombreArchivo, patharchivo);

    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo,
            });
        }
        const token = req.header("x-token");
        actualizarBD(tipo, path, nombreArchivo, id, token)
            .then((valor) => {
                if (!valor) {
                    fs.unlinkSync(patharchivo);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se pudo establecer la nueva foto de perfil`,
                    });
                } else {
                    res.json({
                        ok: true,
                        msg: "subirArchivo",
                        nombreArchivo,
                    });
                }

                // controlar valor
            })
            .catch((error) => {
                fs.unlinkSync(patharchivo);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar archivo`,
                });
            });
    });
};

const enviarArchivo = async(req, res = response) => {
    const tipo = req.params.tipo; // tipos definidos
    const nombreArchivo = req.params.nombrearchivo;

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    pathArchivo = `${path}/${nombreArchivo}`;

    console.log("Tipo: " + tipo + ", nombre: " + nombreArchivo + ", path: " + path);

    if (!fs.existsSync(pathArchivo)) {
        if (tipo !== "fotoperfil") {
            return res.status(400).json({
                ok: false,
                msg: "Archivo no existe",
            });
        }
        pathArchivo = `${process.env.PATHUPLOAD}/no-imagen.jpg`;
    }
    res.sendFile(pathArchivo);
};

module.exports = { subirArchivo, enviarArchivo };