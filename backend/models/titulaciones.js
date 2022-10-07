const { Schema, model } = require('mongoose');

const TitulacionSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true
    },
    resumen: {
        type: String,
        require: true
    },
    imagen: {
        type: String
    },
    area: { // area de conocimiento
        type: String,
        require: true
    },
    tipo: { //TFG o TFM??
        type: String
    },
    abreviatura: {
        type: String
    }
}, { collection: 'titulaciones' });

TitulacionSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Titulacion', TitulacionSchema);