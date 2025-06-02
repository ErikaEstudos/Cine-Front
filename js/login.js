// Seleção de Elementos do DOM
const btnLogin = document.querySelector(".btn-login");
const tagBody = document.querySelector("body");
const wrapper = document.querySelector(".wrapper");
const signupHeader = document.querySelector(".signup span");
const loginHeader = document.querySelector(".login span");
const btnSignup = document.querySelector("#btn-cadastrar");
const boxTextSignup = document.querySelector(".box-text_signup");
const textSignup = document.querySelector(".box-text_signup .text-signup");
const formLoginSignup = document.querySelector(".signup form");
const formLogin = document.querySelector(".login form");
const checkbox = document.getElementById("signupCheck");
const btnClose = document.querySelector(".btn-fechar");
const boxLoginCadastrar = document.querySelector(".itens-btn_login");
const boxMinhaConta = document.querySelector(".box-minha_conta");
const minhaConta = document.querySelector(".btn-minha_conta");
const boxDropdow = document.querySelector(".box-dropdow");
const btnEditarConta = document.querySelector("#minha-conta");
const popupConta = document.querySelector(".section-popup_Conta");
const closeFormConta = document.querySelector(".btn-fechar_conta");
const boxFormConta = document.querySelector(".box-form_conta"); //caixa do formulário conta
const closeFormSenha = document.querySelector(".btn-fechar_senha"); //botão fechar formulário senha
const btnAterarSenha = document.querySelector("#btn-alterarSenha");
const boxFormSenha = document.querySelector(".box-form_senha"); //caixa do formulário senha

// Evento de clique no botão de login do cabeçalho
btnLogin.addEventListener("click", () => {
  tagBody.style.overflow = "hidden"; // Impede a rolagem da página quando os formulários são exibidos
});

//------------Formulários Cadastro e Login--------------------

// Evento de clique no cabeçalho de login para alternar para o formulário de login
loginHeader.addEventListener("click", function () {
  // Adiciona a classe "active" para mostrar o formulário de login
  wrapper.classList.add("active");
});
// Evento de clique no cabeçalho de login para alternar para o formulário de login
signupHeader.addEventListener("click", function () {
  // Remove a classe "active" para mostrar o formulário de cadastro
  wrapper.classList.remove("active");
});

// Adicionar evento ao checkbox para habilitar e desabilitar o botão de cadastro
checkbox.addEventListener("change", function () {
  btnSignup.disabled = !checkbox.checked; // Desabilita o botão de cadastro se o checkbox não estiver marcado
  btnSignup.classList.toggle("default", !checkbox.checked);
});

const nomeInput = document.getElementById("cadastrar-nome");
const emailInput = formLoginSignup.querySelector('input[type="email"]');
const senhaInput = document.getElementById("input-signup");
const nomeErro = document.getElementById("nomeErro");

// Expressão regular para permitir apenas letras (com acento) e espaços
const apenasLetras = /^[A-Za-zÀ-ÿ\s]*$/;

// Impede digitação de números e caracteres inválidos no campo de nome
nomeInput.addEventListener("input", function () {
  const valorAtual = nomeInput.value;
  if (!apenasLetras.test(valorAtual)) {
    alert("O nome deve conter apenas letras!");
    // Remove caracteres inválidos
    nomeInput.value = valorAtual.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
  }
});

// Evento de envio do formulário de cadastro
formLoginSignup.addEventListener("submit", async function (event) {
  event.preventDefault(); // Impede envio padrão

  if (nomeInput.value.trim() === "") {
    alert("Por favor, insira seu nome.");
    nomeInput.focus();
    return;
  }

  if (!apenasLetras.test(nomeInput.value.trim())) {
    alert("O nome deve conter apenas letras!");
    nomeInput.focus();
    return;
  }

  if (emailInput.value.trim() === "") {
    alert("Por favor, insira seu email!");
    emailInput.focus();
    return;
  }

  if (senhaInput.value.trim() === "") {
    alert("Por favor, insira sua senha!");
    senhaInput.focus();
    return;
  }

  // Exibe feedback visual temporário
  boxTextSignup.style.display = "flex";
  setTimeout(function () {
    boxTextSignup.style.display = "none";
    formLoginSignup.reset(); // Limpa formulário de cadastro
    btnSignup.disabled = true;
    btnSignup.classList.add("default");
    checkbox.checked = false;
    inputSignup.type = "password";
    olhoSignup.classList.remove("seeing");
    olhoSignup.src = "/assets/img/GERAL/olho-fechado.webp";
    // Limpa formulário de login também
    formLogin.reset();
    inputLogin.type = "password";
    olhoLogin.classList.remove("seeing");
    olhoLogin.src = "/assets/img/GERAL/olho-fechado.webp";
  }, 2500);

  // Envio dos dados para o backend
  try {
    const response = await fetch(`${BACKEND_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nomeInput.value,
        email: emailInput.value,
        senha: senhaInput.value,
      }),
    });

    if (response.ok) {
      textSignup.textContent = "Usuário cadastrado com sucesso!";
      textSignup.style.color = "cyan";
      carregarUsuarios(); // Atualiza lista de usuários
    } else {
      throw new Error("Erro ao cadastrar.");
    }
  } catch (error) {
    textSignup.textContent = "Usuário já cadastrado!";
    textSignup.style.color = "red";
  }
});

// Evento de envio do formulário de login
formLogin.addEventListener("submit", async function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  // Seleciona os campos de entrada do formulário de login
  const emailInput = formLogin.querySelector('input[type="email"]');
  const senhaInput = document.getElementById("input-login");
  const email = emailInput.value;
  const senha = senhaInput.value;

  // Envio dos dados para o backend (API) de login
  try {
    const response = await fetch(`${BACKEND_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const data = await response.json();

    if (response.ok) {
      // Login bem-sucedido
      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario)); // Armazena os dados do usuário no localStorage
      localStorage.setItem("usuarioId", data.usuario._id); // Armazena o ID do usuário
      // Redireciona para a página principal
      window.location.href = "./index.html";
    } else {
      // Erro no login
      alert(data.mensagem); // Exibe a mensagem de erro do backend
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login. Tente novamente.");
  }
});

// Evento de clique no botão de fechar os formulários
btnClose.addEventListener("click", function () {
  tagBody.style.overflow = "visible"; // Restaura a rolagem da página
  wrapper.classList.remove("active");
  // RESET do formulário de cadastro
  formLoginSignup.reset();
  btnSignup.disabled = true; // Desabilita o botão de cadastro
  btnSignup.classList.add("default"); // Aplica estilo de botão desabilitado
  checkbox.checked = false; // Desmarca o checkbox
  inputSignup.type = "password";
  olhoSignup.classList.remove("seeing");
  olhoSignup.src = "/assets/img/GERAL/olho-fechado.webp";
  // RESET do formulário de login
  formLogin.reset(); // Limpa o formulário de login
  inputLogin.type = "password";
  olhoLogin.classList.remove("seeing");
  olhoLogin.src = "/assets/img/GERAL/olho-fechado.webp";
});

//Evento de clique no botão de fechar do formulário de conta
closeFormConta.addEventListener("click", () => {
  const formSenha = document.querySelector(".form-senha");
  const inputs = formSenha.querySelectorAll(".input-toggle_type");
  const olho = document.getElementById("olho-fechado_formSenha");

  popupConta.style.display = "none";
  tagBody.style.overflow = "scroll";
  // Limpa os campos preenchidos dos Inputs no (FORM DE TROCA DE SENHA)!
  formSenha.reset();
  // Reset de Input: type "text" para "password" no (FORM DE TROCA DE SENHA)!
  inputs.forEach((input) => {
    input.type = "password";
  });
  // Reset de imagem de olho no (FORM DE TROCA DE SENHA)!
  olho.classList.remove("seeing");
  olho.src = "/assets/img/GERAL/olho-fechado.webp";
});

// Função para carregar e exibir a lista de usuários
async function carregarUsuarios() {
  const lista = document.getElementById("lista-usuarios");
  if (!lista) return; // Se a lista não existir, sai da função
  try {
    const res = await fetch(`${BACKEND_URL}/usuarios`); //Busca usuários do backend
    const usuarios = await res.json();
    lista.innerHTML = ""; // Limpa a lista antes de adicionar os usuários

    // Cria elementos HTML para cada usuário e os adiciona à lista
    usuarios.forEach((usuario) => {
      const div = document.createElement("div");
      div.classList.add("usuario-item");
      div.innerHTML = `
        <div class="usuario-info">
          <strong>${usuario.nome}</strong>
          <span>${usuario.email}</span>
          <span>${usuario.senha}</span>
        </div>
        <button onclick="deletarUsuario('${usuario._id}')">Remover</button>
      `;
      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

// Função para deletar um usuário
async function deletarUsuario(id) {
  try {
    await fetch(`${BACKEND_URL}/usuarios/${id}`, { method: "DELETE" });
    carregarUsuarios(); // Atualiza a lista de usuários após a exclusão
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}

// Evento de carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const boxLoginCadastrar = document.querySelector(".itens-btn_login");
  const btnEditarConta = document.querySelector("#minha-conta");
  const botaoLogout = document.getElementById("logout");
  const btnPortfolio = document.getElementById("portfolio");
  const imgPopcorn = document.querySelector(".img_popcorn");
  const boxMinhaConta = document.querySelector(".box-minha_conta");

  if (usuario) {
    if (btnPortfolio) {
      btnPortfolio.style.display = "none";
    }
    if (boxMinhaConta) {
      boxMinhaConta.style.display = "flex";
    }
    if (boxLoginCadastrar) {
      boxLoginCadastrar.style.display = "none"; //Esconde o botão de login e mostra o de logout
    }
    if (btnEditarConta) {
      btnEditarConta.style.display = "block";
    }
    if (botaoLogout) {
      botaoLogout.style.display = "block"; // Exibe o botão de logout
    }
    // Cria e exibe a mensagem de boas-vindas no header
    const navMain = document.querySelector(".ola-usuario"); // Ajuste o seletor do header se necessário
    if (navMain) {
      const boasVindas = document.createElement("span");
      const primeiroNome = usuario.nome.split(" ")[0];
      boasVindas.textContent = `Olá, ${primeiroNome}! 👋`;
      boasVindas.classList.add("boas-vindas");
      navMain.appendChild(boasVindas);
    }
  } else {
    // Se não houver usuário logado, garante que o botão de logout esteja escondido
    if (botaoLogout) {
      botaoLogout.style.display = "none";
      imgPopcorn.style.display = "none";
      boxMinhaConta.style.display = "none";
    }
  }

  // Ativa o evento de clique no botão de logout
  if (botaoLogout) {
    botaoLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.reload();
    });
  }

  carregarUsuarios(); // Carrega a lista de usuários ao carregar a página
});

//Evento de click Minha Conta
minhaConta.addEventListener("click", () => {
  minhaConta.classList.toggle("active");
});

// Evento de clique no botão Editar Conta
btnEditarConta.addEventListener("click", () => {
  popupConta.style.display = "block";
  tagBody.style.overflow = "hidden";

  // Preenche o formulário com os dados do usuário logado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuario) {
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
  }
});

// Evento de clique no botão "Salvar alterações"
document
  .querySelector(".form-conta")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
      try {
        const response = await fetch(`${BACKEND_URL}/usuarios/${usuario._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email }),
        });

        if (response.ok) {
          // Atualização bem-sucedida
          alert("Dados atualizados com sucesso!");
          // Atualiza os dados no localStorage
          usuario.nome = nome;
          usuario.email = email;
          localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        } else {
          // Erro na atualização
          alert("Erro ao atualizar os dados.");
        }
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
        alert("Erro ao atualizar os dados. Tente novamente.");
      }
    }
  });

// Evento de clique no botão "Alterar senha"
btnAterarSenha.addEventListener("click", (event) => {
  event.preventDefault(); // Impede o envio do formulário de conta
  boxFormSenha.classList.add("ativar");
  tagBody.classList.add("ativar");
});

// Evento de clique no botão "X" para fechar o formulário de senha
closeFormSenha.addEventListener("click", () => {
  boxFormSenha.classList.remove("ativar");
  tagBody.classList.remove("ativar");
});

document
  .querySelector(".form-senha")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const senhaAtual = document.getElementById("senha-atual").value;
    const novaSenha = document.getElementById("nova-senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (novaSenha !== confirmarSenha) {
      alert("As novas senhas não coincidem.");
      return;
    }

    if (usuario) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/usuarios/${usuario._id}/senha`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senhaAtual, novaSenha }),
          }
        );

        if (response.ok) {
          alert("Senha alterada com sucesso!");

          const formSenha = document.querySelector(".form-senha");
          const inputs = formSenha.querySelectorAll(".input-toggle_type");
          const olho = document.getElementById("olho-fechado_formSenha");

          //boxFormConta.style.display = "flex";
          formSenha.reset();

          // Reset de inputs para type "password"
          inputs.forEach((input) => {
            input.type = "password";
            // Reset da imagem do olho
            olho.src = "/assets/img/GERAL/olho-fechado.webp";
            olho.classList.remove("seeing");
          });

          //Devolve o estado inicial dos Forms
          setTimeout(() => {
            boxFormSenha.classList.remove("ativar");
            tagBody.classList.remove("ativar");
          }, 2500);

          return; // <-- evita que o código abaixo seja executado após sucesso
        } else {
          const data = await response.json();
          alert(data.mensagem || "Erro ao alterar a senha.");
        }
      } catch (error) {
        console.error("Erro ao alterar a senha:", error);
        alert("Erro ao alterar a senha. Tente novamente.");
      }
    }
  });

//---------------TROCA DE TYPE DO INPUT----------------

//CADASTRO
const inputSignup = document.getElementById("input-signup");
const olhoSignup = document.getElementById("olho-signup");
olhoSignup.addEventListener("click", () => {
  if (inputSignup.type === "password") {
    inputSignup.type = "text";
    olhoSignup.classList.add("seeing");
    olhoSignup.src = "/assets/img/GERAL/olho-aberto.webp";
  } else {
    inputSignup.type = "password";
    olhoSignup.classList.remove("seeing");
    olhoSignup.src = "/assets/img/GERAL/olho-fechado.webp";
  }
});
//LOGIN
const olhoLogin = document.getElementById("olho-login");
const inputLogin = document.getElementById("input-login");
olhoLogin.addEventListener("click", () => {
  if (inputLogin.type === "password") {
    inputLogin.type = "text";
    olhoLogin.classList.add("seeing");
    olhoLogin.src = "/assets/img/GERAL/olho-aberto.webp";
  } else {
    inputLogin.type = "password";
    olhoLogin.classList.remove("seeing");
    olhoLogin.src = "/assets/img/GERAL/olho-fechado.webp";
  }
});
//TROCA DE SENHA
const inputsToggle = document.querySelectorAll(".input-toggle_type");
const olho = document.getElementById("olho-fechado_formSenha");
olho.addEventListener("click", () => {
  if (inputsToggle[0].type === "password") {
    inputsToggle.forEach((input) => {
      input.type = "text";
      olho.classList.add("seeing");
    });
    olho.src = "/assets/img/GERAL/olho-aberto.webp";
  } else {
    inputsToggle.forEach((input) => {
      input.type = "password";
      olho.classList.remove("seeing");
    });
    olho.src = "/assets/img/GERAL/olho-fechado.webp";
  }
});
