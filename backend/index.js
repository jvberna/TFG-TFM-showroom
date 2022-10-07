/*
Importación de módulos
*/
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload"); //para usar el middleware del fileupload

require('dotenv').config();
const { dbConnection } = require('./database/configdb');

// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
}));

app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/trabajos', require('./routes/trabajos'));
app.use('/api/titulaciones', require('./routes/titulaciones'));
app.use('/api/upload', require('./routes/uploads'));


// Abrir la aplicación en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});