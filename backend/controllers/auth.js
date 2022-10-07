const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {
    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);

        if (usuarioBD) {
            const rolBD = usuarioBD.rol;

            const nuevoToken = await generarJWT(uid, rol);

            res.status(200).json({
                ok: true,
                msg: "Token",
                uid: uid,
                nombre_apellidos: usuarioBD.nombre_apellidos,
                email: usuarioBD.email,
                rol: rolBD,
                alta: usuarioBD.alta,
                activo: usuarioBD.activo,
                imagen: usuarioBD.imagen,
                token: nuevoToken,
            });
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }


    } catch {
        return res.status(500).json({
            ok: false,
            msg: 'Token no válido',

            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;
    let _idres, rolres, tokenres; //Variables auxiliares para evitarnos problemas en la respuesta JSON

    try {
        //COMPROBAMOS SI ES UN USUARIO EXISTENTE
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        //LOGIN
        if (usuarioBD) {
            const validPassword = bcrypt.compareSync(password, usuarioBD.password);
            const password2 = usuarioBD.password;
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario o contraseña incorrectos',
                    token: '',
                    password,
                    password2
                });
            }

            const { _id, rol } = usuarioBD;
            const token = await generarJWT(usuarioBD._id, usuarioBD.rol);
            //Para que no haya problemas con la respuesta JSON
            _idres = _id;
            rolres = rol;
            tokenres = token;
        }



        let _id = _idres;
        let rol = rolres;
        let token = tokenres;

        res.status(201).json({ //Token creado
            ok: true,
            msg: 'login',
            _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en login',
            token: '',
            password
        });
    }
}


module.exports = { login, token };