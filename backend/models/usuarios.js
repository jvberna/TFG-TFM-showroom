const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre_apellidos: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    // imagen: {
    //     type: String,
    // },
    rol: {
        type: String,
        require: true,
        default: 'ROL_ALUMNO'
    },
    alta: {
        type: Date,
        default: Date.now
    },
    // valorados: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Trabajos',
    // }]
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);