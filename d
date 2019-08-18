[1mdiff --git a/index.js b/index.js[m
[1mindex 99d2385..c2c8e26 100755[m
[1m--- a/index.js[m
[1m+++ b/index.js[m
[36m@@ -27,11 +27,18 @@[m [mapp.get('/', (req, res)=> {[m
 app.get('/articles', (req, res) => {[m
     const artigos = ArtigoModel.find(null, null, { sort: { criado: -1 } }, (erro, artigos) =>{[m
         if(erro) return console.error(erro);[m
[31m-        res.render('articles', {artigos: artigos, usuario: app.get('usuario') } );;[m
[32m+[m[32m        res.render('articles', {filtro: '', artigos, usuario: app.get('usuario') } );;[m
     });[m
     [m
 });[m
 [m
[32m+[m[32mapp.get('/articles/:autor_id', (req, res) => {[m
[32m+[m[32m    const artigos = ArtigoModel.find({ 'autor.id': req.params.autor_id }, null, { sort: { criado: -1 } }, (erro, artigos) =>{[m
[32m+[m[32m        if(erro) return console.error(erro);[m
[32m+[m[32m        res.render('articles', {filtro: artigos[0].autor.nome, artigos, usuario: app.get('usuario') } );;[m
[32m+[m[32m    });[m[41m    [m
[32m+[m[32m});[m
[32m+[m
 app.get('/login', (req, res)=> {[m
     res.render('login', {usuario: app.get('usuario') } );[m
 });[m
[1mdiff --git a/views/articles.ejs b/views/articles.ejs[m
[1mindex 8401cfb..c935024 100755[m
[1m--- a/views/articles.ejs[m
[1m+++ b/views/articles.ejs[m
[36m@@ -2,10 +2,14 @@[m
 <%- include('commons/menu')  %>[m
 [m
 <div class="container">[m
[31m-    <h1>Artigos</h1>[m
[32m+[m[32m    <h1>Artigos[m
[32m+[m[32m    <% if (filtro != '') { %>[m
[32m+[m[32m        de <%= filtro %>[m
[32m+[m[32m    <% } %>[m
[32m+[m[32m    </h1>[m
 [m
     <% artigos.forEach((artigo) => {%>[m
[31m-        <h3><a href="/artigo/<%= artigo._id %>"><%= artigo.titulo %></a> <small>por <%=artigo.autor.name%></small></h3>[m
[32m+[m[32m        <h3><a href="/artigo/<%= artigo._id %>"><%= artigo.titulo %></a> <small>por <a href="/articles/<%=artigo.autor.id%>"><%=artigo.autor.name%></a></small></h3>[m
         <p><small><%= artigo.criado.toLocaleString()%></small></p>[m
         <p><%= artigo.resumo %></p>[m
         <hr>[m
[1mdiff --git a/views/artigo.ejs b/views/artigo.ejs[m
[1mindex 82468b3..2e80128 100644[m
[1m--- a/views/artigo.ejs[m
[1m+++ b/views/artigo.ejs[m
[36m@@ -6,7 +6,7 @@[m
 [m
     <p></p>[m
     <h2><%=artigo.titulo%></h2>[m
[31m-    <p class="lead">por <a href="#"><%=artigo.autor.name%></a></p>[m
[32m+[m[32m    <p class="lead">por <a href="/articles/<%=artigo.autor.id%>"><%=artigo.autor.name%></a></p>[m
     <p><small><span class="glyphicon glyphicon-time"></span> Criado em <%=artigo.criado%></small></p>[m
     <hr>[m
         <div><%-artigo.texto%>[m
