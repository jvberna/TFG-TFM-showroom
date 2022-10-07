const { Schema, model } = require('mongoose');

const TrabajoSchema = Schema({
    titulo: { // maximo 150 caracteres
        type: String,
        require: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    resumen: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        default: ''
    },
    // url: {
    //     type: String
    // },
    area: { // area de conocimiento
        type: String,
    },
    tipo: { // TFG o TFM segun la titulacion
        type: String,
    },
    alta: {
        type: Date,
        default: Date.now
    },
    director: { //director de investigación
        type: String,
        require: true
    },
    valoracion: {
        type: Number,
        default: 0
    },

    contenidos: [{
        nombre: {
            type: String,
            default: ''
        },
        tipo: {
            type: String,

        },
        descripcion: {
            type: String,
        },
        contenido: { // para youtube será la url
            type: String,
        }
    }],
    titulacion: {
        titulacion: {
            type: Schema.Types.ObjectId,
            ref: 'Titulacion',
            require: true,
        },
        nombre: {
            type: String,
        }
    },
    visible: {
        type: Boolean,
        default: false
    },
    estado: { // para editar, pendiente de revisión, aceptado, denegado
        type: String,
        default: "Para editar"
    },
    feedback: [{
        type: String,
        default: ''
    }],
    //Nuevos campos de info
    enlace: { // enlace para meet defensa trabajo
        type: String
    },
    defensa: { // fecha defensa
        type: String
    },
    curso: { // curso academico
        type: String
    },
    palabrasclave: {
        type: String
    },
    valoraciones: [{
        type: String
    }]
}, { collection: 'trabajos' });

TrabajoSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Trabajo', TrabajoSchema);