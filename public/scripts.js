function curtir(artigoId, comentarioId){
    let curtidas = document.getElementById('curtidas_'+comentarioId);
    curtidas.innerHTML = parseInt(curtidas.innerHTML) + 1;
}

function naocurtir(artigoId, comentarioId){
    let naoCurtidas = document.getElementById('naocurtidas_'+comentarioId);
    naoCurtidas.innerHTML = parseInt(naoCurtidas.innerHTML) + 1;
}