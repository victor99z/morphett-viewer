
// Ordena a estrutura para que as transições com leitura * fiquem no final

function ordenar_estrutura(estrutura) {
  for (var i = 0; i < estrutura.length - 1; i++) {
    if (estrutura[i].leitura == "*") {
      if (estrutura[i + 1].estadoAtual == estrutura[i].estadoAtual) {
        let temp = estrutura[i];
        estrutura[i] = estrutura[i + 1];
        estrutura[i + 1] = temp;
      }
    }
  }
  return estrutura;
}

function buscar_transicao(estado_atual, simbolo, estrutura) {
  let transicao = estrutura.filter((transicao) => {
    if (transicao.estadoAtual == estado_atual)
      if (transicao.leitura == simbolo || transicao.leitura == "*")
        return {
          escrita: transicao.escrita,
          direcao: transicao.direcao,
          proximoEstado: transicao.proximoEstado,
        };
  });
  console.log(estado_atual + " ++ " + simbolo);
  return transicao[0] != undefined ? transicao[0] : false;
}


// Timer que ficara rodando para desenhar as transicoes da MT usando a biblioteca.
var timer = undefined;

// Lista que representa a fita da MT.
let machine_list = [];


function run_machine(e) {
  e.preventDefault();
  const machine_codec = document.querySelector("#inputMorphet");
  const inputc = document.querySelector("#inputcode");
  const printing = document.getElementById("drawhere");

  const machine_code = machine_codec.value;
  const input = inputc.value;
  const removedComments = removeComments(machine_code);

  let estrutura = parseEstrutura(removedComments);
  estrutura = ordenar_estrutura(estrutura);

  machine_list = [];
  input.split("").forEach((x) => machine_list.push(x));
  console.log(machine_list);
  console.log(estrutura);

  let estado_atual = "0";
  let cabecote = 0;

  if (timer != undefined) clearInterval(timer);
  timer = setInterval(() => {
    printing.value = machine_list.join("");
    let transicao = buscar_transicao(
      estado_atual,
      machine_list[cabecote],
      estrutura
    );
    console.log(transicao);
    if (transicao == false) {
      clearInterval(timer);
    }
    if (
      transicao.proximoEstado == "halt" ||
      transicao.proximoEstado == "halt-accept" ||
      transicao.proximoEstado == "halt-reject"
    ) {
      clearInterval(timer);
    }
    if (transicao.escrita != "*")
      machine_list[cabecote] =
        transicao.escrita == "*" ? machine_list[cabecote] : transicao.escrita;

    if (transicao.direcao == "l") cabecote--;
    else if (transicao.direcao == "r") cabecote++;

    if (cabecote < 0) {
      cabecote = 0;
      machine_list.splice(0, 0, "_");
    } else if (cabecote == machine_list.length) {
      machine_list.push("_");
    }

    estado_atual = transicao.proximoEstado;

    const estados = new Set();
    estrutura.forEach((transicao) => {
      estados.add(transicao.estadoAtual);
      estados.add(transicao.proximoEstado);
    });
    drawGraph(estados, estrutura, estado_atual);

    printing.value = machine_list.join("");
    console.log(machine_list);
  }, 250);
}

function parser(e) {
  e.preventDefault();
  const selector = document.querySelector("#inputMorphet");

  const input = selector.value;
  const removedComments = removeComments(input);

  const estrutura = parseEstrutura(removedComments);

  console.log(estrutura);

  const estados = new Set();

  estrutura.forEach((transicao) => {
    estados.add(transicao.estadoAtual);
    estados.add(transicao.proximoEstado);
  });

  drawGraph(estados, estrutura);
}

function removeComments(input) {
  const lines = input.split("\n");
  const linhasSemComentarios = lines.filter(
    (linha) => !linha.trim().startsWith(";")
  );
  const textoSemComentarios = linhasSemComentarios.join("\n");

  return textoSemComentarios;
}

function parseEstrutura(texto) {
  const linhas = texto.split("\n");
  const estrutura = [];

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (linha !== "") {
      const [estadoAtual, leitura, escrita, direcao, proximoEstado] =
        linha.split(/\s+/);
      estrutura.push({
        estadoAtual,
        leitura,
        escrita,
        direcao,
        proximoEstado,
      });
    }
  }

  return estrutura;
}

// Desenha o exemplo de MT do site morphett e coloca no input

function drawExample(event) {
  event.preventDefault();

  const selector = document.querySelector("#inputMorphet");

  selector.value = `
      ; This example program checks if the input string is a binary palindrome.
      ; Input: a string of 0's and 1's, eg '1001001'
      
      
      ; Machine starts in state 0.
      
      ; State 0: read the leftmost symbol
      0 0 _ r 1o
      0 1 _ r 1i
      0 _ _ * accept     ; Empty input
      
      ; State 1o, 1i: find the rightmost symbol
      1o _ _ l 2o
      1o * * r 1o
      
      1i _ _ l 2i
      1i * * r 1i
      
      ; State 2o, 2i: check if the rightmost symbol matches the most recently read left-hand symbol
      2o 0 _ l 3
      2o _ _ * accept
      2o * * * reject
      
      2i 1 _ l 3
      2i _ _ * accept
      2i * * * reject
      
      ; State 3, 4: return to left end of remaining input
      3 _ _ * accept
      3 * * l 4
      4 * * l 4
      4 _ _ r 0  ; Back to the beginning
      
      accept * : r accept2
      accept2 * ) * halt-accept
      
      reject _ : r reject2
      reject * _ l reject
      reject2 * ( * halt-reject`;
}

function drawGraph(states, estrutura) {
  return drawGraph(states, estrutura);
}
function drawGraph(states, estrutura, atual) {
  var g = new dagreD3.graphlib.Graph().setGraph({});

  states.forEach(function (state) {
    g.setNode(state, { 
      label: state,
      style: state == atual ? "fill: #fa98eb" : "fill: #bbe9f0",
    });
  });

  estrutura.forEach((transicao) => {
    g.setEdge(transicao.estadoAtual, transicao.proximoEstado, {
      label: `${transicao.leitura}, ${transicao.escrita}, ${transicao.direcao}`,
      labelStyle: "font-size:17px; text-decoration: none;",
      curve: d3.curveBasis,
    });
  });

  // Set some general styles
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    node.rx = node.ry = 1;
  });

  var svg = d3.select("svg"),
    inner = svg.select("g");

  // Set up zoom support
  var zoom = d3.zoom().on("zoom", function () {
    inner.attr("transform", d3.event.transform);
  });
  svg.call(zoom);

  //console.log(d3.event);

  // Create the renderer
  var render = new dagreD3.render();

  // Run the renderer. This is what draws the final graph.
  render(inner, g);

  // Center the graph
  var initialScale = 0.75;
  svg.call(
    zoom.transform,
    d3.zoomIdentity
      .translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20)
      .scale(initialScale)
  );

  svg.attr("height", g.graph().height * initialScale + 40);
}
