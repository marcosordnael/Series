// // Elementos do modal
// const modalDetalhes = document.getElementById("modal-detalhes");
// const fecharModal = document.getElementById("fechar-modal");
// const detalhesSerie = document.getElementById("detalhes-serie");

// // Função para exibir detalhes da série
// async function exibirDetalhesSerie(id) {
//     try {
//         const resposta = await fetch(`https://api.tvmaze.com/shows/${id}`);
//         const serie = await resposta.json();

//         const respostaElenco = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
//         const elenco = await respostaElenco.json();

//         const respostaEpisodios = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
//         const episodios = await respostaEpisodios.json();

//         detalhesSerie.innerHTML = `
//             <h2>${serie.name}</h2>
//             <img src="${serie.image ? serie.image.medium : ''}" alt="${serie.name}">
//             <p><strong>Descrição:</strong> ${serie.summary || 'Descrição não disponível.'}</p>
//             <h3>Elenco</h3>
//             <ul>${elenco.map(ator => `<li>${ator.person.name} como ${ator.character.name}</li>`).join('')}</ul>
//             <h3>Episódios</h3>
//             <ul>${episodios.map(ep => `<li>${ep.name} - Temporada ${ep.season}, Episódio ${ep.number}</li>`).join('')}</ul>
//         `;

//         modalDetalhes.style.display = "flex";
//     } catch (erro) {
//         console.error("Erro ao carregar detalhes da série:", erro);
//     }
// }

// // Fechar o modal
// fecharModal.addEventListener("click", () => {
//     modalDetalhes.style.display = "none";
// });
