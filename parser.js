// Montar o parser do Morphet -> estrutura de dados, map?

/*

  vetor de estados = ["0", "1", "2", "3", "4", "halt-accept"]
  transicoes = {"0": ["0","0","r", "0"]}
  transicoes = {"0": ["0","0","r", "0"]}
  transicoes = {"0": ["0","0","r", "0"]}
  transicoes = {"0": ["0","0","r", "0"]}
  transicoes = {"0": ["0","0","r", "0"]}


  ; Questao do par, impar 

  0 0 0 r 0
  0 1 1 r 0
  0 _ _ l 1

  1 0 0 r 2
  1 1 1 l 3

  2 _ 0 * halt-accept

  3 1 1 l 3
  3 0 1 r 4
  3 _ 1 r 4

  4 1 0 r 4
  4 0 1 r 4
  4 _ _ * halt-accept

*/

function parser(e) {
  e.preventDefault();
  const selector = document.querySelector("#inputMorphet");
  const input = selector.value;
  const removedComments = removeComments(input);

  const estados = new Set();

  const estrutura = parseEstrutura(removedComments);

  console.log(estrutura);

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
  var g = new dagreD3.graphlib.Graph().setGraph({});

  states.forEach(function (state) {
    g.setNode(state, { label: state });
  });

  estrutura.forEach(transicao => {
    g.setEdge(transicao.estadoAtual, transicao.proximoEstado, {
      label: `${transicao.leitura}, ${transicao.escrita}, ${transicao.direcao}`,
      labelStyle: "font-size:17px; text-decoration: none;",
      curve: d3.curveBasis 
    });
  })

  // Set some general styles
  g.nodes().forEach(function (v) {
    var node = g.node(v);
    node.rx = node.ry = 1;
  });

  // Add some custom colors based on state
  // g.node("0").style = "fill: #f77";
  // g.node('accept').style = "fill: #7f7";

  var svg = d3.select("svg"),
    inner = svg.select("g");

  // Set up zoom support
  var zoom = d3.zoom().on("zoom", function () {
    inner.attr("transform", d3.event.transform);
  });
  svg.call(zoom);

  console.log(d3.event);

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
