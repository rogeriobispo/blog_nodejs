const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const artigoSchema = new Schema(
    {
       titulo: {type: String, required: true},
       autor: {
           id: Schema.Types.ObjectId,
           name: String
       }, 
       criado: Date,
       atualizado: Date,
       resumo: String,
       texto: String,
       comentarios: [
           {
               nome: String,
               texto: String,
               data: {type: Date, default: Date.now},
               curitu: {type: Number, default: 0},
               naocurtiu: {type: Number, default: 0}
           }
       ]
    }
);

module.exports = mongoose.model('Artigo', artigoSchema);