const express = require('express');
const autoresRouter = express.Router();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const AutorModel = require('../models/autorModel');

autoresRouter.use((req, res, next)=>{
    userName = req.app.get('usuario').name;
    admin = req.app.get('admin') // TODO verificar admin
    if ( userName == 'anonymous'){
        res.redirect('/');
        return;
    }
    if(req.app.get('usuario').id != null && req.app.get('usuario').admin === false){
        res.redirect('/admin/artigos');
        return;
    }
    next();
});

autoresRouter.get('/novo',(req, res) => {
    res.render('admin/novoautor', { usuario: req.app.get('usuario')});
});

autoresRouter.post('/novo', urlEncodedParser, (req, res) => {
    const autor = new AutorModel({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == 'on')
    });
    autor.save((erro, autor) =>{
        if(erro) return console.error(erro);
        res.render('admin/autorincluido', { usuario: req.app.get('usuario')});
    });
});

autoresRouter.get('/', (req, res) => {
    const autores = AutorModel.find(null, null, { sort: { nome: 1 } }, (erro, autores) =>{
        if(erro) return console.error(erro);
        res.render('admin/autores', { 'autores': autores, usuario: req.app.get('usuario') });
    });
});

autoresRouter.get('/:id', (req, res) => {
    AutorModel.findById(req.params.id, (erro, autor) => {
        res.render('admin/autor', { autor: autor, usuario: req.app.get('usuario') });
    });
});

autoresRouter.get('/:id/excluir', (req, res) => {
    AutorModel.remove({_id: req.params.id}, (erro)=>{
        res.render('admin/autorexcluido', {usuario: req.app.get('usuario')});
    });
});

autoresRouter.post('/:id', urlEncodedParser, (req, res) => {
   const autor = new AutorModel({
       '_id': req.params.id,
       nome: req.body.nome,
       email: req.body.email,
       senha: req.body.senha,
       admin: (req.body.admin == 'on')
   });
    AutorModel.updateOne({'_id': req.params.id }, autor, (erro)=>{
        if(erro){
            console.log(erro); 
            return "error";
      } 
       res.render('admin/autoralterado', { autor: autor, usuario: req.app.get('usuario')});
       
   });
});

module.exports = autoresRouter;

//https://conteudo.virtual.pucminas.br/canvas/arc_embed/?embed_id=d3e03c23-3d48-4ca4-a0da-626976c3296f minuto 32