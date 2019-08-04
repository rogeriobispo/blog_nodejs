const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autorSchema = new Schema(
    {
        nome: String,
        email: String,
        senha: String,
        admin:{ type: Boolean, default: false }
    }
);

module.exports = mongoose.model('Autor', autorSchema);