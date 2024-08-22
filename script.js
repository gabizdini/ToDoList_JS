const lista = new LinkedList();
let tarefaId = 0;
function adicionarTarefa() {
  const descricao = document.getElementById("txtnovaTarefa").value.trim();
  const prioridade = document.getElementById("txtnovaPrioridade").value.trim();

  const novaTarefa = new Tarefa(
    descricao,
    prioridade,
    obterDataAtual(),
    obterHoraAtual(),
    tarefaId++
  );
  lista.adicionarElemento(novaTarefa);
  console.log(lista.toString());
  document.getElementById("txtnovaTarefa").value = "";
  document.getElementById("txtnovaPrioridade").value = "";
  document.getElementById("txtnovaTarefa").focus();
  atualizarLista();
}

function resolverTarefa() {
  const tarefa = lista.removerElemento();
  if (tarefa != null) {
    mensagemRemocao(tarefa);
    atualizarLista();
  } else {
    const mensagem = document.getElementById("mensagem-remocao");
    mensagem.innerHTML = "Nenhuma tarefa para concluir.";
  }
}

function removerTarefa(id) {
  let current = lista.head;
  while (current !== null) {
    if (current.dado._id === id) {
      
      if (current === lista.head) {
        lista.removerElemento(); 
        
      } else {
         if (current.prox) {
          current.prox.ant = current.ant;
        }
        if (current.ant) {
          current.ant.prox = current.prox;
        }
        lista.length--;
        if (!current.prox) {
          lista.tail = current.ant;
        }
        
      }
      
      atualizarLista();
      break;
    }
    
    current = current.prox;
  }
}



function TarefaInicio() {
  const mensagem = document.getElementById("mensagem-remocao");

  if (!lista.isEmpty()) {
    let tarefaInicio = lista.head.dado;

    mensagem.innerHTML = `Tarefa do início: ${tarefaInicio._descricao}, ${tarefaInicio._prioridade}, ${tarefaInicio._data}, ${tarefaInicio._hora}.`;
  } else {
    mensagem.innerHTML = "Lista Vazia.";
  }
  mensagem.style.display = "block";
}

function TarefaAntiga() {
  const mensagem = document.getElementById("mensagem-remocao");

  if (!lista.isEmpty()) {
    let tarefaAntiga = lista.head.dado;

    for (const tarefa of lista) {
      tarefaAntiga = comparaTarefasDataHora(tarefaAntiga, tarefa);
    }

    mensagem.innerHTML = `Tarefa mais antiga: ${tarefaAntiga._descricao}, ${tarefaAntiga._data}, ${tarefaAntiga._hora}.`;
  } else {
    mensagem.innerHTML = "Lista Vazia.";
  }
  mensagem.style.display = "block";
}

function mensagemRemocao(tarefaRealizada) {
  const mensagem = document.getElementById("mensagem-remocao");

  const dataAtual = new Date();
  const dataAtualFormatada = `${String(dataAtual.getDate()).padStart(
    2,
    "0"
  )}/${String(dataAtual.getMonth() + 1).padStart(
    2,
    "0"
  )}/${dataAtual.getFullYear()}`;
  const horaAtual = `${dataAtual
    .getHours()
    .toString()
    .padStart(2, "0")}:${dataAtual
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dataAtual.getSeconds().toString().padStart(2, "0")}`;

  mensagem.innerHTML = `Tarefa: ${
    tarefaRealizada.descricao
  } realizada em ${calcularDiferencaDias(
    tarefaRealizada._data,
    dataAtualFormatada
  )} e ${calcularDiferencaHoras(tarefaRealizada._hora, horaAtual)}.`;
  mensagem.style.display = "block";
}

function atualizarLista() {
  const listaTarefas = document.getElementById("list_listadeTarefas");
  listaTarefas.innerHTML = ""; 
  if (!lista.isEmpty()) {
    for (const tarefa of lista) {
      const novaLinha = document.createElement("li");

      // Adiciona o HTML para a tarefa e os dois botões
      novaLinha.innerHTML = `
        ${tarefa.toString()}
        <button class="btn-remover" onclick="removerTarefa(${tarefa._id})">Remover</button>
        <button class="btn-resolver" onclick="resolverTarefa(${tarefa._id})">Resolver</button>
      `;

      listaTarefas.appendChild(novaLinha);
    }
  } else {
    listaTarefas.innerHTML = "<li>Lista de Tarefas Vazia</li>";
  }
}


function obterDataAtual() {
  let dataAtual = new Date();
  let dia = dataAtual.getDate();
  let mes = dataAtual.getMonth() + 1; 
  let ano = dataAtual.getFullYear();

  let dataFormatada = `${dia.toString().padStart(2, "0")}/${mes
    .toString()
    .padStart(2, "0")}/${ano}`;
  return dataFormatada;
}

function obterHoraAtual() {
  const data = new Date();
  const hora = data.getHours().toString().padStart(2, "0");
  const minuto = data.getMinutes().toString().padStart(2, "0");
  const segundo = data.getSeconds().toString().padStart(2, "0");
  return `${hora}:${minuto}:${segundo}`;
}

function calcularDiferencaHoras(hora1, hora2) {
  const [h1, m1, s1] = hora1.split(":").map(Number);
  const [h2, m2, s2] = hora2.split(":").map(Number);

  const diferencaSegundos =
    h2 * 3600 + m2 * 60 + s2 - (h1 * 3600 + m1 * 60 + s1);

  const horas = Math.floor(diferencaSegundos / 3600);
  const minutos = Math.floor((diferencaSegundos % 3600) / 60);
  const segundos = diferencaSegundos % 60;

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")} [horas:minutos:segundos]`;
}

function calcularDiferencaDias(dataInicial, dataFinal) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const [diaIni, mesIni, anoIni] = dataInicial.split("/").map(Number);
  const [diaFim, mesFim, anoFim] = dataFinal.split("/").map(Number);

  const dataIni = new Date(anoIni, mesIni - 1, diaIni); 
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);
  const diferencaMs = dataFim - dataIni;
  const diferencaDias = Math.floor(diferencaMs / msPorDia);
  return diferencaDias + " dias";
}

function converterDataFormatoISO8601(data) {
  const partes = data.split("/");
  const dia = partes[0].padStart(2, "0");
  const mes = partes[1].padStart(2, "0");
  const ano = partes[2];
  return `${ano}-${mes}-${dia}`;
}

function comparaTarefasDataHora(tarefa1, tarefa2) {
  const dataHoraTarefa1 = new Date(
    `${converterDataFormatoISO8601(tarefa1._data)}T${tarefa1._hora}`
  );
  const dataHoraTarefa2 = new Date(
    `${converterDataFormatoISO8601(tarefa2._data)}T${tarefa2._hora}`
  );
  if (dataHoraTarefa1.getTime() < dataHoraTarefa2.getTime()) {
    return tarefa1;
  } else {
    return tarefa2;
  }
}

function saveLinkedListToLocalStorage() {
  console.log("saveLinkedListToLocalStorage");
  let listaParaSalvar = [];
  for (const item of lista) {
    listaParaSalvar.push({
      _descricao: item.descricao,
      _prioridade: item.prioridade,
      _data: item.data,
      _hora: item.hora,
    });
    console.log(item.toString());
  }
  let jsonStr = JSON.stringify(listaParaSalvar);
  console.log(jsonStr);
  localStorage.setItem("myLinkedList", jsonStr);
  alert("Lista salva com sucesso!");
}

function loadLinkedListFromLocalStorage() {
  console.log("loadLinkedListFromLocalStorage");
  let jsonStr = localStorage.getItem("myLinkedList");
  if (jsonStr) {
    let listaCarregada = JSON.parse(jsonStr);
    for (let i = 0; i < listaCarregada.length; i++) {
      let obj = listaCarregada[i];
      let novaTarefa = new Tarefa(
        obj._descricao,
        obj._prioridade,
        obj._data,
        obj._hora
      );
      console.log(novaTarefa.toString());
      lista.addLast(novaTarefa);
    }
    atualizarLista();
    alert("Lista carregada com sucesso!");
  }
}

