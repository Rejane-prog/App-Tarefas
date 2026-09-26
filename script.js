const formulario = document.querySelector("#form-tarefa");
const campoTarefa = document.querySelector("#tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const estadoVazio = document.querySelector("#estado-vazio");
const contador = document.querySelector("#contador");
const mensagem = document.querySelector("#mensagem");

let tarefas = carregarTarefas();

renderizarTarefas();

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const descricao = campoTarefa.value.trim();

  if (!descricao) {
    mensagem.textContent = "Digite uma descrição para a tarefa.";
    campoTarefa.focus();
    return;
  }

  const novaTarefa = {
    id: crypto.randomUUID(),
    descricao: descricao,
    concluida: false
  };

  tarefas.push(novaTarefa);

  salvarTarefas();
  renderizarTarefas();

  formulario.reset();
  mensagem.textContent = "";
  campoTarefa.focus();
});

function alternarConclusao(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return {
        ...tarefa,
        concluida: !tarefa.concluida
      };
    }

    return tarefa;
  });

  salvarTarefas();
  renderizarTarefas();
}

function removerTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);

  salvarTarefas();
  renderizarTarefas();
}

function renderizarTarefas() {
  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa) => {
    const item = document.createElement("li");
    item.className = "item-tarefa";

    if (tarefa.concluida) {
      item.classList.add("tarefa-concluida");
    }

    const conteudo = document.createElement("div");
    conteudo.className = "conteudo-tarefa";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox-tarefa";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute(
      "aria-label",
      `Marcar a tarefa ${tarefa.descricao} como concluída`
    );

    checkbox.addEventListener("change", () => {
      alternarConclusao(tarefa.id);
    });

    const texto = document.createElement("span");
    texto.className = "texto-tarefa";
    texto.textContent = tarefa.descricao;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-remover";
    botao.textContent = "Remover";
    botao.setAttribute(
      "aria-label",
      `Remover tarefa: ${tarefa.descricao}`
    );

    botao.addEventListener("click", () => {
      removerTarefa(tarefa.id);
    });

    conteudo.append(checkbox, texto);
    item.append(conteudo, botao);
    listaTarefas.appendChild(item);
  });

  atualizarInformacoes();
}

function atualizarInformacoes() {
  const quantidadeTotal = tarefas.length;
  const quantidadeConcluida = tarefas.filter(
    (tarefa) => tarefa.concluida
  ).length;

  estadoVazio.hidden = quantidadeTotal > 0;

  if (quantidadeTotal === 0) {
    contador.textContent = "0 tarefas";
    return;
  }

  contador.textContent =
    `${quantidadeConcluida} de ${quantidadeTotal} concluídas`;
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  try {
    const tarefasSalvas =
      JSON.parse(localStorage.getItem("tarefas")) || [];

    return tarefasSalvas.map((tarefa) => ({
      ...tarefa,
      concluida: tarefa.concluida || false
    }));
  } catch {
    return [];
  }
}