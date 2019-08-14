//continuar lista de autores
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const mongoose = require('mongoose');
const ArtigoModel = require('./models/artigoModel');
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });
const AutorModel = require('./models/autorModel');

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
        res.render('articles', {artigos: artigos, usuario: app.get('usuario') } );;
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

