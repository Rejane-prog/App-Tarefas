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

  tarefas.push({
    id: crypto.randomUUID(),
    descricao
  });

  salvarTarefas();
  renderizarTarefas();
  formulario.reset();
  mensagem.textContent = "";
  campoTarefa.focus();
});

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

    const texto = document.createElement("span");
    texto.className = "texto-tarefa";
    texto.textContent = tarefa.descricao;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-remover";
    botao.textContent = "Remover";
    botao.setAttribute("aria-label", `Remover tarefa: ${tarefa.descricao}`);
    botao.addEventListener("click", () => removerTarefa(tarefa.id));

    item.append(texto, botao);
    listaTarefas.appendChild(item);
  });

  estadoVazio.hidden = tarefas.length > 0;
  contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? "tarefa" : "tarefas"}`;
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
  try {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
  } catch {
    return [];
  }
}
