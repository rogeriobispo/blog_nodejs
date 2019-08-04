const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });

//rotas descendentes
const adminAutoresRouter =require('./routers/adminAutoresRouter');
app.use('/admin/autores', adminAutoresRouter);

app.set('view engine', 'ejs');
app.set('usuario', { name: 'anonymous'})
app.use('/public' ,express.static('public'));
app.get('/', (req, res)=> {
   res.redirect('/articles');
});


app.get('/articles', (req, res) => {
    res.render('articles', {usuario: app.get('usuario') } );
});

app.get('/login', (req, res)=> {
    res.render('login', {usuario: app.get('usuario') } );
});

app.post('/login', urlEncodedParser, (req, res)=> {
   if((req.body.email == 'rogerio_pd@yahoo.com.br') && (req.body.senha == '12345')) {
       app.set('usuario', { name: 'rogerio bispo' })
       res.redirect('/admin/autores');
   } else {
    res.render('logininvalido', { usuario: app.get('usuario') } );
   }
});

app.get('/logout', (req, res)=> {
    app.set('usuario', { name: 'anonymous' });
    res.redirect('/articles');
});
app.listen(3000);

