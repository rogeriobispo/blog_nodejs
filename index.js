//continuar lista de paginação      
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const mongoose = require('mongoose');
const ArtigoModel = require('./models/artigoModel');
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });
const AutorModel = require('./models/autorModel');

const moment = require('moment');

// funções 
app.locals.formataData = function(data){
   moment.locale('pt-br');
   return moment(data).format('LLLL'); 
}
//end funções
//rotas descendentes
const adminAutoresRouter =require('./routers/adminAutoresRouter');
app.use('/admin/autores', adminAutoresRouter);

const adminArtigosRouter =require('./routers/adminArtigosRouter');
app.use('/admin/artigos', adminArtigosRouter);


app.set('view engine', 'ejs');
app.set('usuario', {id: 1, name: 'anonymous', admin: false})
app.use('/public' ,express.static('public'));
app.get('/', (req, res)=> {
   res.redirect('/articles');
});


app.get('/articles', (req, res) => {
    const artigos = ArtigoModel.find(null, null, { sort: { criado: -1 } }, (erro, artigos) =>{
        if(erro) return console.error(erro);
        res.render('articles', {filtro: '', artigos, usuario: app.get('usuario'), pagina: 0, quantidade: 2} );;
    });
    
});

app.get('/articles/paginas/:pagina', (req, res) => {
    const artigos = ArtigoModel.find(null, null, { sort: { criado: -1 } }, (erro, artigos) =>{
        if(erro) return console.error(erro);
        res.render('articles', {filtro: '', artigos, usuario: app.get('usuario'), pagina: parseInt(req.params.pagina), quantidade: 2} );;
    });
    
});

app.get('/authors', (req, res) => {
    AutorModel.find(null, null, { sort: { criado: 1 } }, (erro, autores) =>{
        if(erro) return console.error(erro);
     
        res.render('autores', {autores, usuario: app.get('usuario') } );;
    });
    
});

app.get('/articles/:autor_id', (req, res) => {
    const artigos = ArtigoModel.find({ 'autor.id': req.params.autor_id }, null, { sort: { criado: -1 } }, (erro, artigos) =>{
        if(erro) return console.error(erro);
        res.render('articles', {filtro: {nome: artigos[0].autor.nome, id: artigos[0].autor.id} , artigos, usuario: app.get('usuario'), pagina: 0, quantidade: 2 } );;
    });    
});


app.get('/articles/:autor_id/paginas/:pagina', (req, res) => {
    const artigos = ArtigoModel.find({ 'autor.id': req.params.autor_id }, null, { sort: { criado: -1 } }, (erro, artigos) =>{
        if(erro) return console.error(erro);
        res.render('articles', {filtro: {nome: artigos[0].autor.nome, id: artigos[0].autor.id}, artigos, usuario: app.get('usuario'), pagina: parseInt(req.params.pagina), quantidade: 2 } );;
    });    
});

app.get('/login', (req, res)=> {
    res.render('login', {usuario: app.get('usuario') } );
});

app.get('/artigo/:id',(req, res)=>{
    const artigo = ArtigoModel.findById(req.params.id, (erro, artigo)=>{
       if(erro) return console.error(error);
       res.render('artigo', {artigo: artigo, usuario: app.get('usuario') } );
    });
} );


app.post('/artigo/:id/comentarios', urlEncodedParser,(req, res)=>{
    const comentario = { 
        nome: req.body.nome,
        texto: req.body.comentario
    };

    ArtigoModel.findById(req.params.id, (erro, artigo)=>{
        if(erro) return console.error(erro);
        if(artigo){
            artigo.comentarios.push(comentario);
            ArtigoModel.updateOne({_id: artigo._id}, artigo, (erro)=>{
               res.render('comentarioregistrado', {artigo: artigo, usuario: req.app.get('usuario')}) 
            });

        }
    });

});



app.post('/login', urlEncodedParser, (req, res)=> {
    AutorModel.findOne({email: req.body.email}, (erro, autor) => {
       if(erro) return console.error(erro);
       if(autor){
           if(req.body.senha != autor.senha){
                res.render('logininvalido', { usuario: app.get('usuario')});
                return;
            }
            app.set('usuario', {id: autor._id, name: autor.nome, admin: autor.admin});
            res.redirect('/admin/autores');
       }else{
        res.render('logininvalido', { usuario: app.get('usuario')});
        return;
       }
       
    });
});

app.get('/logout', (req, res)=> {
    app.set('usuario', {id: 0, name: 'anonymous', admin: false });
    res.redirect('/articles');
});
app.listen(3000);

