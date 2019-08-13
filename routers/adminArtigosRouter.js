const express = require('express');
const artigosRouter = express.Router();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const ArtigoModel = require('../models/artigoModel');

artigosRouter.use((req, res, next)=>{
    userName = req.app.get('usuario').name;
    admin = req.app.get('admin') // TODO verificar admin
    if ( userName == 'anonymous'){
        res.redirect('/');
        return;
    }
    next();
});

artigosRouter.get('/novo',(req, res) => {
    res.render('admin/novoartigo', { usuario: req.app.get('usuario')});
});

artigosRouter.post('/novo', urlEncodedParser, (req, res) => {
    const artigo = new ArtigoModel({
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            name: req.body.autor_nome
        },
        criado:Date.now(),
        atualizado: Date.now(),
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: []

    });
    artigo.save((erro, artigo) =>{
        if(erro) return console.error(erro);
        res.render('admin/artigoincluido', { usuario: req.app.get('usuario')});
    });
});

artigosRouter.get('/', (req, res) => {
    const artigos = ArtigoModel.find(null, null, { sort: { criado: -1 } }, (erro, artigos) =>{
        if(erro) return console.error(erro);
        res.render('admin/artigos', { 'artigos': artigos, usuario: req.app.get('usuario') });
    });
});

artigosRouter.get('/:id', (req, res) => {
    ArtigoModel.findById(req.params.id, (erro, artigo) => {
        res.render('admin/artigo', { artigo: artigo, usuario: req.app.get('usuario') });
    });
});

artigosRouter.get('/:id/excluir', (req, res) => {
    ArtigoModel.remove({_id: req.params.id}, (erro)=>{
        res.render('admin/artigoexcluido', {usuario: req.app.get('usuario')});
    });
});

artigosRouter.post('/:id', urlEncodedParser, (req, res) => {
    const artigo = new ArtigoModel({
        _id: req.params.id,
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome
        },
        criado: req.body.criado,
        atualizado: Date.now(),
        resumo: req.body.resumo,
        texto: req.body.texto
        //comentarios: JSON.parse(req.body.comentarios)
    });
    ArtigoModel.updateOne({_id: req.params.id}, artigo, (erro)=>{
       res.render('admin/artigoalterado', { arigo: artigo, usuario: req.app.get('usuario')});
    });
});

module.exports = artigosRouter;

// continuar minuto 35 do video. 

