const listaFavoritos = document.getElementById("lista-favoritos");

// Função para carregar e exibir séries favoritedas
function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritas")) || [];

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = "<p>Você não tem séries favoritedas ainda.</p>";
    } else {
        listaFavoritos.innerHTML = favoritos.map(serie => `
            <div class="serie-item">
                <h3>${serie.name}</h3>
                <img src="${serie.image ? serie.image.medium : ''}" alt="${serie.name}">
                <button onclick="removerDosFavoritos(${serie.id})">Remover dos Favoritos</button>
            </div>
        `).join('');
    }
}

// Ajusta o cabeçalho ao rolar a página
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) header.classList.add('nav-scroll');
    else header.classList.remove('nav-scroll');
});

// Função para remover uma série dos favoritos
function removerDosFavoritos(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritas")) || [];
    favoritos = favoritos.filter(fav => fav.id !== id);
    localStorage.setItem("favoritas", JSON.stringify(favoritos));
    carregarFavoritos(); // Recarrega a lista de favoritos
}

// Carrega os favoritos ao abrir a página
window.addEventListener("load", carregarFavoritos);
