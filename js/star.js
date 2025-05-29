/*---SECTION CARDS--*/
const cards = document.querySelectorAll(".cards");
const body = document.querySelector("body");

cards.forEach((card) => {
  const btnCard = card.querySelector(".img-card");
  const btnFechar = card.querySelector(".fechar");
  const boxSinopse = card.querySelector(".box-sinopse");
  const btnTrailer = card.querySelector(".btn-trailer");
  const imgExit_trailer = card.querySelector(".img-exit_trailer");
  const boxTrailer = card.querySelector(".trailer");
  const videoTrailer = card.querySelector("#videoTrailer");
  const btnAvaliar = card.querySelector(".btn-avaliar");
  const sectionStar = card.querySelector(".section-star");
  const btnSubmit = card.querySelector(".btn-submit");
  const btnEditar = card.querySelector(".btn-editar");
  const post = card.querySelector(".post");
  const widget = card.querySelector(".star-widget");
  const textareaAvaliacao = card.querySelector("textarea");
  const nomeFilme = card.dataset.filme;
  const btnOpenEditar = card.querySelector(".btn-open_editar");

  // Função auxiliar para resetar e esconder o formulário de avaliação
  const resetAndHideEvaluationForm = () => {
    sectionStar.style.display = "none";
    widget.style.display = "none";
    textareaAvaliacao.style.display = "none";
    btnSubmit.style.display = "none";
    btnEditar.style.display = "none";
    textareaAvaliacao.value = "";
    card.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
    delete card.dataset.avaliacaoId;
    delete card.dataset.estrelasAnteriores; // Garante que também remove estrelas anteriores
  };

  // Função para carregar e preencher a avaliação existente (se houver)
  const loadExistingEvaluation = async () => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      btnAvaliar.style.display = "block";
      btnOpenEditar.style.display = "none";
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/usuarios/avaliacoes?filme=${nomeFilme}&usuarioId=${usuarioId}`
      );
      const dados = await resposta.json();

      if (dados && dados.length > 0 && dados[0]) {
        const avaliacao = dados[0];
        card.dataset.avaliacaoId = avaliacao._id;
        card.dataset.estrelasAnteriores = avaliacao.estrelas; // Armazena as estrelas anteriores

        const starId = `star-${nomeFilme.replace(/\s+/g, "")}_${
          avaliacao.estrelas
        }`;
        const starInput = card.querySelector(`input[type="radio"]#${starId}`);
        if (starInput) starInput.checked = true;
        textareaAvaliacao.value = avaliacao.comentario;

        btnAvaliar.style.display = "none";
        btnOpenEditar.style.display = "block";
      } else {
        btnAvaliar.style.display = "block";
        btnOpenEditar.style.display = "none";
      }
    } catch (erro) {
      console.error("Erro ao carregar avaliação existente:", erro);
      btnAvaliar.style.display = "block";
      btnOpenEditar.style.display = "none";
    }
  };

  // Removido o loadExistingEvaluation aqui, pois será chamado ao abrir a sinopse
  // loadExistingEvaluation();

  btnCard.onclick = () => {
    boxSinopse.style.display = "flex";
    loadExistingEvaluation(); // Recarrega o estado da avaliação ao abrir a sinopse
  };
  btnFechar.onclick = () => {
    boxSinopse.style.display = "none";
    resetAndHideEvaluationForm(); // Reseta o formulário ao fechar a sinopse
  };

  /*-----------TRAILER----------*/
  btnTrailer.onclick = () => {
    boxTrailer.style.display = "block";
    body.style.overflow = "hidden";
  };

  imgExit_trailer.onclick = () => {
    boxTrailer.style.display = "none";
    body.style.overflow = "visible";
    videoTrailer.pause();
    videoTrailer.currentTime = 0;
  };
  /*---------VÍDEO TRAILER------*/
  videoTrailer.onplay = () => {
    setTimeout(() => {
      btnAvaliar.disabled = false;
      btnAvaliar.classList.remove("fosco");
    }, 5000);
  };

  /*------------- AVALIAÇÃO----*/
  btnAvaliar.onclick = async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const estaLogado = !!usuarioLogado;
    const inputLogin = document.getElementById("login");

    if (!estaLogado) {
      inputLogin.checked = true;
      setTimeout(() => {
        alert("Faça Login para Avaliar!");
      }, 1000);
      return;
    }

    sectionStar.style.display = "flex";
    widget.style.display = "block";
    textareaAvaliacao.style.display = "block";
    btnSubmit.style.display = "block"; // Mostra o botão "Postar"
    btnEditar.style.display = "none"; // Esconde o botão "Editar"
    textareaAvaliacao.value = ""; // Limpa o textarea
    card
      .querySelectorAll('input[type="radio"]')
      .forEach((radio) => (radio.checked = false)); // Limpa as estrelas
    delete card.dataset.avaliacaoId; // Garante que não há ID de avaliação para uma nova submissão
    delete card.dataset.estrelasAnteriores;
  };

  btnSubmit.onclick = async (event) => {
    event.preventDefault();

    const estrelasSelecionadas = card.querySelector(
      'input[type="radio"]:checked'
    );
    const estrelas = estrelasSelecionadas?.id.split("_")[1];
    const comentario = textareaAvaliacao.value;
    const usuarioId = localStorage.getItem("usuarioId");
    const avaliacaoExistenteId = card.dataset.avaliacaoId;

    if (!usuarioId) {
      alert("Faça Login para avaliar!");
      return;
    }
    if (!nomeFilme) {
      alert("Erro: Nome do filme não encontrado.");
      return;
    }
    if (!estrelas && !avaliacaoExistenteId) {
      alert("Por favor, selecione uma avaliação de estrelas.");
      return;
    }

    const url = avaliacaoExistenteId
      ? `http://localhost:3000/usuarios/avaliacoes/${avaliacaoExistenteId}`
      : "http://localhost:3000/usuarios/avaliacoes";
    const method = avaliacaoExistenteId ? "PUT" : "POST";

    const bodyPayload = {
      filme: nomeFilme,
      comentario,
      usuarioId,
    };

    if (estrelas) {
      bodyPayload.estrelas = Number(estrelas);
    } else if (avaliacaoExistenteId && card.dataset.estrelasAnteriores) {
      bodyPayload.estrelas = Number(card.dataset.estrelasAnteriores);
    }

    try {
      const resposta = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const dados = await resposta.json();
      if (resposta.ok) {
        alert(dados.mensagem);
        resetAndHideEvaluationForm();
        btnAvaliar.style.display = "none";
        btnOpenEditar.style.display = "block";
        setTimeout(() => {
          boxSinopse.style.display = "none";
        }, 2000);

        exibirMinhasAvaliacoes(); // Atualiza a lista de avaliações
      } else {
        alert(dados.mensagem || "Erro na operação.");
      }
    } catch (erro) {
      console.error("Erro ao enviar/editar avaliação:", erro);
      alert("Erro ao enviar/editar avaliação.");
    }
  };

  btnOpenEditar.onclick = async () => {
    btnAvaliar.style.display = "none";
    sectionStar.style.display = "flex";
    widget.style.display = "block";
    textareaAvaliacao.style.display = "block";
    btnSubmit.style.display = "block";
    btnEditar.style.display = "none";

    const usuarioId = localStorage.getItem("usuarioId");
    try {
      const resposta = await fetch(
        `http://localhost:3000/usuarios/avaliacoes?filme=${nomeFilme}&usuarioId=${usuarioId}`
      );
      const dados = await resposta.json();

      if (dados && dados.length > 0 && dados[0]) {
        const avaliacao = dados[0];
        card.dataset.avaliacaoId = avaliacao._id;
        card.dataset.estrelasAnteriores = avaliacao.estrelas;

        const starId = `star-${nomeFilme.replace(/\s+/g, "")}_${
          avaliacao.estrelas
        }`;
        const starInput = card.querySelector(`input[type="radio"]#${starId}`);
        if (starInput) {
          starInput.checked = true;
        }
        textareaAvaliacao.value = avaliacao.comentario;
      } else {
        alert("Você ainda não avaliou este filme. Crie uma nova avaliação.");
        resetAndHideEvaluationForm();
        btnAvaliar.style.display = "block";
        btnOpenEditar.style.display = "none";
        setTimeout(() => {
          boxSinopse.style.display = "none";
        }, 2000);
      }
    } catch (erro) {
      console.error("Erro ao buscar avaliação para edição:", erro);
      alert("Erro ao buscar sua avaliação.");
      resetAndHideEvaluationForm();
    }
  };
});

//---EXIBIÇÃO DE AVALIAÇÃO E LÓGICA DE LOGIN/LOGOUT---

async function exibirMinhasAvaliacoes() {
  const usuarioId = localStorage.getItem("usuarioId");
  const avaliacoesContainer = document
    .getElementById("minhas-avaliacoes")
    .querySelector(".text-dataBase_star");

  if (!usuarioId) {
    avaliacoesContainer.innerHTML =
      "<p>Você precisa estar logado para ver suas avaliações.</p>";
    return;
  }

  try {
    const resposta = await fetch(
      `http://localhost:3000/usuarios/avaliacoes/usuario/${usuarioId}`
    );
    const avaliacoes = await resposta.json();

    avaliacoesContainer.innerHTML = ""; // Limpa o container antes de exibir

    if (avaliacoes.length === 0) {
      avaliacoesContainer.innerHTML = "<p>Você não possui Avaliação!</p>";
      return;
    }

    avaliacoes.forEach((avaliacao) => {
      const avaliacaoDiv = document.createElement("div");
      avaliacaoDiv.classList.add("minha-avaliacao");

      const filmeNome = document.createElement("p");
      filmeNome.textContent = `Filme: ${avaliacao.filme}`;

      const estrelas = document.createElement("p");
      estrelas.textContent = `Avaliação: ${"⭐".repeat(avaliacao.estrelas)}`;

      const comentario = document.createElement("textarea");
      comentario.textContent = `Comentário: ${
        avaliacao.comentario || "Nenhum comentário"
      }`;

      const removerBotao = document.createElement("button");
      removerBotao.textContent = "Remover";
      removerBotao.classList.add("btn-remover-avaliacao");
      removerBotao.dataset.avaliacaoId = avaliacao._id;

      avaliacaoDiv.appendChild(filmeNome);
      avaliacaoDiv.appendChild(estrelas);
      avaliacaoDiv.appendChild(comentario);
      avaliacaoDiv.appendChild(removerBotao);
      avaliacoesContainer.appendChild(avaliacaoDiv);
    });

    adicionarListenersRemover(); // Adiciona os listeners aos botões de remover após carregar as avaliações
  } catch (erro) {
    console.error("Erro ao buscar minhas avaliações:", erro);
    avaliacoesContainer.innerHTML = "<p>Erro ao carregar suas avaliações.</p>";
  }
}

function adicionarListenersRemover() {
  const botoesRemover = document.querySelectorAll(".btn-remover-avaliacao");
  botoesRemover.forEach((botao) => {
    botao.addEventListener("click", async (event) => {
      const avaliacaoId = event.target.dataset.avaliacaoId;

      if (confirm("Tem certeza que deseja remover esta avaliação?")) {
        try {
          const resposta = await fetch(
            `http://localhost:3000/usuarios/avaliacoes/${avaliacaoId}`,
            {
              method: "DELETE",
            }
          );

          const dados = await resposta.json();
          if (resposta.ok) {
            alert(dados.mensagem);
            exibirMinhasAvaliacoes(); // Recarrega a lista de avaliações após a remoção

            // Atualiza o estado do card se a avaliação removida era dele
            cards.forEach((card) => {
              const avaliacaoIdCard = card.dataset.avaliacaoId;
              if (avaliacaoIdCard === avaliacaoId) {
                const btnAvaliarCard = card.querySelector(".btn-avaliar");
                const btnOpenEditarCard =
                  card.querySelector(".btn-open_editar");

                if (btnAvaliarCard) btnAvaliarCard.style.display = "block";
                if (btnOpenEditarCard) btnOpenEditarCard.style.display = "none";

                delete card.dataset.avaliacaoId;
                delete card.dataset.estrelasAnteriores;
              }
            });
          } else {
            alert(dados.mensagem || "Erro ao remover a avaliação.");
          }
        } catch (erro) {
          console.error("Erro ao remover avaliação:", erro);
          alert("Erro ao remover a avaliação.");
        }
      }
    });
  });
}

// Chame a função para exibir as avaliações quando o usuário **logar**.
// Você precisará despachar este evento em seu código de login após o sucesso do login.
document.addEventListener("loginSuccessful", exibirMinhasAvaliacoes);

// Lógica para o botão de logout
const btnLogout = document.getElementById("logout");

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    // Remove os itens do localStorage relacionados ao usuário logado
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioLogado");

    // Limpa a exibição das minhas avaliações
    const avaliacoesContainer = document
      .getElementById("minhas-avaliacoes")
      .querySelector(".text-dataBase_star");
    avaliacoesContainer.innerHTML =
      "<p>Você precisa estar logado para ver suas avaliações.</p>";

    // Reseta o estado dos botões "Avaliar" e "Editar" para todos os cards
    cards.forEach((card) => {
      const btnAvaliarCard = card.querySelector(".btn-avaliar");
      const btnOpenEditarCard = card.querySelector(".btn-open_editar");
      const boxSinopseCard = card.querySelector(".box-sinopse");
      const sectionStar = card.querySelector(".section-star");
      const widget = card.querySelector(".star-widget");
      const textareaAvaliacao = card.querySelector("textarea");
      const btnSubmit = card.querySelector(".btn-submit");

      if (btnAvaliarCard) btnAvaliarCard.style.display = "block";
      if (btnOpenEditarCard) btnOpenEditarCard.style.display = "none";

      // Limpa os data-atributos do card
      delete card.dataset.avaliacaoId;
      delete card.dataset.estrelasAnteriores;

      // Se a sinopse estiver aberta, feche-a e resete o formulário de avaliação
      if (boxSinopseCard && boxSinopseCard.style.display === "flex") {
        boxSinopseCard.style.display = "none";
        if (sectionStar) sectionStar.style.display = "none";
        if (widget) widget.style.display = "none";
        if (textareaAvaliacao) textareaAvaliacao.style.display = "none";
        if (btnSubmit) btnSubmit.style.display = "none";
        card.querySelectorAll('input[type="radio"]').forEach((input) => {
          input.checked = false;
        });
        if (textareaAvaliacao) textareaAvaliacao.value = "";
      }
    });
  });
}

// Ao carregar a página, verifique se o usuário já está logado para exibir as avaliações
document.addEventListener("DOMContentLoaded", () => {
  const usuarioId = localStorage.getItem("usuarioId");
  if (usuarioId) {
    exibirMinhasAvaliacoes();
  } else {
    // Garanta que o container de avaliações esteja limpo se o usuário não estiver logado
    const avaliacoesContainer = document
      .getElementById("minhas-avaliacoes")
      .querySelector(".text-dataBase_star");
    avaliacoesContainer.innerHTML =
      "<p>Você precisa estar logado para ver suas avaliações.</p>";
  }
});
