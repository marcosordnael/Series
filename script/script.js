// Elementos da página
const entradaBusca = document.getElementById("entrada-busca");
const botaoBusca = document.getElementById("botao-busca");
const iconeLupa = document.getElementById('icone-lupa');
const iconeFiltro = document.getElementById('ico-filtro');
const janelaGenero = document.querySelector('.janela-generos');
const selecionarGenero = document.getElementById('selecionar-genero')
const barraBusca = document.querySelector('.barra-busca');
const serieGeral = document.querySelector('.serie-geral');
const listaSeries = document.getElementById("lista-series");
const modalDetalhes = document.getElementById("modal-detalhes");
const fecharModal = document.getElementById("fechar-modal");
const detalhesSerie = document.getElementById("detalhes-serie");
const spinner = document.getElementById("loading-spinner");
const mensagemErro = document.getElementById("mensagem-erro");
const header = document.getElementById('header');
const carrossel = document.querySelector('.carrossel');
const carrosselItems = document.querySelectorAll('.carrossel-item');
const indicadores = document.querySelectorAll('.indicadores li');
let indiceAtual = 0;

// Arrays para armazenamento de favoritos e séries populares
let seriesFavoritas = JSON.parse(localStorage.getItem("favoritas")) || [];
let seriesPopulares = [];

// Funções de exibição e ocultação de elementos
function mostrarSpinner() { spinner.style.display = "block"; }
function esconderSpinner() { spinner.style.display = "none"; }
function exibirErro(mensagem) { mensagemErro.textContent = mensagem; }

// Ajusta o cabeçalho ao rolar a página
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) header.classList.add('nav-scroll');
    else header.classList.remove('nav-scroll');
});

// Função para o carrossel
function mostrarItem(indice) {
    const totalItems = carrosselItems.length;
    if (indice >= totalItems) indice = 0;
    else if (indice < 0) indice = totalItems - 1;
    carrossel.style.transform = `translateX(-${indice * 100}%)`;
    indiceAtual = indice;
    indicadores.forEach((indicador, i) => indicador.classList.toggle('ativo', i === indiceAtual));
}

// Intervalo automático para o carrossel
setInterval(() => mostrarItem(indiceAtual + 1), 3000);

// Evento de clique nos indicadores do carrossel
indicadores.forEach((indicador, i) => indicador.addEventListener('click', () => mostrarItem(i)));

// Funções para exibir séries por gênero no carrossel
function exibirSeriesPorGenero(series, genero, seletor) {
    const listaSeriesGenero = document.querySelector(seletor);
    listaSeriesGenero.innerHTML = '';

    const seriesGenero = series.filter(serie => serie.genres.includes(genero));
    seriesGenero.forEach(serie => {
        const favoritado = seriesFavoritas.some(fav => fav.id === serie.id);
        const serieItem = document.createElement('div');
        serieItem.className = 'carrossel-item-genero';
        serieItem.innerHTML = `
            <h4>${serie.name}</h4>
            <img src="${serie.image ? serie.image.medium : ''}" alt="${serie.name}">
            <div class="btn-container">
                <button class="favoritar ${favoritado ? 'favoritado btn-remover' : 'btn-adicionar'}" onclick='alternarFavorito(${serie.id})'>
                    ${favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
                <button class="btn-detalhes" onclick="exibirDetalhesSerie(${serie.id})">Ver detalhes</button>
            </div>
        `;
        listaSeriesGenero.appendChild(serieItem);
    });
}

function exibirSeriesDrama(series) { exibirSeriesPorGenero(series, 'Drama', '.carrossel-genero:nth-of-type(1) .lista-series-genero'); }
function exibirSeriesComedia(series) { exibirSeriesPorGenero(series, 'Comedy', '.carrossel-genero:nth-of-type(2) .lista-series-genero'); }


function exibirSeriesPopulares(series) {
    const listaSeriesPopulares = document.querySelector('.lista-series-populares');
    listaSeriesPopulares.innerHTML = '';
    series.forEach(serie => {
        const favoritado = seriesFavoritas.some(fav => fav.id === serie.id);
        const serieItem = document.createElement('div');
        serieItem.className = 'carrossel-item-genero';
        serieItem.innerHTML = `
            <h4>${serie.name}</h4>
            <img src="${serie.image ? serie.image.medium : ''}" alt="${serie.name}">
            <div class="btn-container">
                <button class="favoritar ${favoritado ? 'favoritado btn-remover' : 'btn-adicionar'}" data-id="${serie.id}" onclick='alternarFavorito(${serie.id})'>

                    ${favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
                <button class="btn-detalhes" onclick="exibirDetalhesSerie(${serie.id})">Ver detalhes</button>
            </div>
        `;
        listaSeriesPopulares.appendChild(serieItem);
    });
}

// Função para deslizar o carrossel
function deslizarCarrossel(botao, direcao) {
    const carrosselGenero = botao.closest('.container-carrossel-genero').querySelector('.lista-series-genero, .lista-series-populares');
    const larguraItem = carrosselGenero.querySelector('.carrossel-item-genero').offsetWidth;
    carrosselGenero.scrollBy({ left: direcao * larguraItem, behavior: 'smooth' });
}

// Função para carregar séries e exibir por gênero e popularidade
async function carregarSeries() {
    try {
        mostrarSpinner();
        const resposta = await fetch("https://api.tvmaze.com/shows");
        if (!resposta.ok) throw new Error("Erro ao carregar séries");

        const jsonResponse = await resposta.json();
        seriesPopulares = jsonResponse || [];

        exibirSeriesDrama(seriesPopulares);
        exibirSeriesComedia(seriesPopulares);
        exibirSeriesPopulares(seriesPopulares);
    } catch (erro) {
        exibirErro(erro.message);
    } finally {
        esconderSpinner();
    }
}

// Funções para adicionar e remover favoritos
function adicionarAosFavoritos(serie) {
    if (!seriesFavoritas.some(fav => fav.id === serie.id)) {
        seriesFavoritas.push(serie);
        localStorage.setItem("favoritas", JSON.stringify(seriesFavoritas));
    }
}

function removerDosFavoritos(id) {
    seriesFavoritas = seriesFavoritas.filter(fav => fav.id !== id);
    localStorage.setItem("favoritas", JSON.stringify(seriesFavoritas));
}


// Alternar entre adicionar e remover favoritos
function alternarFavorito(id) {
    const serie = seriesPopulares.find(serie => serie.id === id);
    if (serie) {
        const index = seriesFavoritas.findIndex(fav => fav.id === id);


        if (index === -1) {
            adicionarAosFavoritos(serie);
            exibirNotificacao('Adicionado aos Favoritos com sucesso!', false);
        } else {
            removerDosFavoritos(id);
            exibirNotificacao('Removido dos Favoritos com sucesso!', true);
        }


        const botoesFavoritar = document.querySelectorAll(`button[onclick='alternarFavorito(${id})']`);
        botoesFavoritar.forEach(botaoFavoritar => {
            if (index === -1) {
                botaoFavoritar.classList.remove('btn-adicionar');
                botaoFavoritar.classList.add('btn-remover');
                botaoFavoritar.textContent = 'Remover dos Favoritos';
            } else {
                botaoFavoritar.classList.remove('btn-remover');
                botaoFavoritar.classList.add('btn-adicionar');
                botaoFavoritar.textContent = 'Adicionar aos Favoritos';
            }
        });
    }
}


// Função para exibir notificações
function exibirNotificacao(mensagem, erro) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.classList.toggle('erro', erro);
    notificacao.style.display = 'block';
    notificacao.style.opacity = '1';

    setTimeout(() => {
        notificacao.style.opacity = '0';
        setTimeout(() => notificacao.style.display = 'none', 500);
    }, 2000);
}

// Função para filtrar e exibir séries por gênero
function filtrarGenero(genero) {
    const seriesFiltradas = seriesPopulares.filter(serie => serie.genres.includes(genero));
    exibirSeries(seriesFiltradas);
    const section = document.getElementById('serie-geral');
    section.scrollIntoView({ behavior: 'smooth' });
}



async function buscarSeries() {
    const termoBusca = entradaBusca.value.trim();
    if (!termoBusca) return;

    try {
        mostrarSpinner();
        const resposta = await fetch(`https://api.tvmaze.com/search/shows?q=${termoBusca}`);
        if (!resposta.ok) throw new Error("Erro ao buscar séries");

        const resultados = await resposta.json();
        const seriesEncontradas = resultados.map(resultado => resultado.show);
        
        
        seriesPopulares = seriesEncontradas;
        
        exibirSeries(seriesEncontradas);
        listaSeries.scrollIntoView({ behavior: 'smooth' });
        
    } catch (erro) {
        exibirErro(erro.message);
    } finally {
        esconderSpinner();
    }
}


async function exibirDetalhesSerie(id) {
    try {
        mostrarSpinner();
        const resposta = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const serie = await resposta.json();

        const serieNome = document.getElementById('serie-nome');
        const serieImagem = document.getElementById('serie-imagem');
        const serieIdioma = document.getElementById('serie-idioma');
        const serieGeneros = document.getElementById('serie-generos');
        const serieDescricao = document.getElementById('serie-descricao');


        serieNome.textContent = serie.name;
        serieImagem.src = serie.image ? serie.image.medium : '';
        serieIdioma.textContent = serie.language;
        serieGeneros.textContent = serie.genres.join(", ");
        serieDescricao.innerHTML = serie.summary || "Sem descrição disponível.";


        modalDetalhes.style.display = "block";
        document.body.style.overflow = 'hidden';
    } catch (erro) {
        exibirErro(erro.message);
    } finally {
        esconderSpinner();
    }
}


// Função para exibir a lista de séries
function exibirSeries(series) {
    listaSeries.innerHTML = "";

    series.forEach(serie => {
        const favoritado = seriesFavoritas.some(fav => fav.id === serie.id);
        const serieItem = document.createElement("div");
        serieItem.className = "serie-item";
        serieItem.innerHTML = `
            <h4>${serie.name}</h4>
            <img src="${serie.image ? serie.image.medium : ''}" alt="${serie.name}">
            <div class="btn-container">
                <button class="favoritar ${favoritado ? 'favoritado btn-remover' : 'btn-adicionar'}" onclick='alternarFavorito(${serie.id})'>
                    ${favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
                <button class="btn-detalhes" onclick="exibirDetalhesSerie(${serie.id})">Ver detalhes</button>
            </div>
        `;
        listaSeries.appendChild(serieItem);

    });
}




entradaBusca.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        buscarSeries();

    }
});

// Fechar modal de detalhes
fecharModal.addEventListener("click", () => { 
    modalDetalhes.style.display = "none"; 
    document.body.style.overflow = 'auto';
});

//Exibir filtro
iconeFiltro.addEventListener('click', () => janelaGenero.classList.toggle('visivel'));

// Exibir busca ao clicar na lupa
iconeLupa.addEventListener('click', () => barraBusca.classList.toggle('visivel'));

botaoBusca.addEventListener('click', () => {
    serieGeral.classList.toggle('visivel');
    buscarSeries();
});


selecionarGenero.addEventListener('click', () => {
    serieGeral.classList.toggle('visivel');
    if (serieGeral.classList.contains('visivel')) {
        janelaGenero.classList.remove('visivel');
        serieGeral.scrollIntoView({ behavior: 'smooth' });
    }
});


window.addEventListener('scroll', () => {
    if (janelaGenero.classList.contains('visivel')) {
        janelaGenero.classList.remove('visivel');
    }
});




// Carregar séries ao iniciar
carregarSeries();



