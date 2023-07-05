# Morphett viewer project

Objetivo: Mostrar o funcionamento do código escrito no simulador Morphett na forma de um diagrama de estados.


### Como usar?

Caso queria abrir o projeto original, apenas de git clone no repositorio e abra o arquivo index.html no seu navegador que todas as dependecias já serão carregadas via cdn.

caso queria usar a versao online, pode usar o [link](https://victor99z.github.io/morphett-viewer/) online.

Ao clickar em Draw Example voce irá ter o exemplo inicial igual do morphett, pode inserir qualquer palavra pra verificar no campo de texto(input) logo abaixo da codificação da MT.

- Botão `RESET` limpa o campo da codificação da MT
- Botão `DRAW GRAPH` desenha o diagrama de estados
- Botão `SIMULATE` roda a palavra na MT e vai desenhando conforme passa pelas transições.

No ultimo campo (disabilitado) temos a simulação da nossa `fita` de trabalho.

![](morphet.webm)

### Restrições

- Simbolo inicial precisa ser "0"
- Não aceita voltar passos ou avançar, velocidade unica (250ms entre as transições)
- Só funciona para o modelo fita duplamente infinita.
- MT para se tiver em  um estado que inicial com "halt", como "halt-reject" ou "halt-accept"

### TODO:

- [] Testes com varios inputs
    - Apenas alguns inputs de MT e palavra foram testas. Alguns exemplos estão no arquivo exemplo.txt e outros podem ser encontrados [aqui](https://github.com/awmorp/turing/tree/gh-pages/machines)
- [x] Implementação de um modelo de mt que rode o código do morphett
- [x] Modificar as cores do diagram pra melhorar visualizar.
- [] Altamente urgente modificar o codigo da estrutura para virar uma classe. Organização ficara melhor.
- [] Colocar opção para aumentar ou diminuir a velocidade da animação. pode ser feito com um slider ou input do tipo number e colocando na variavel `timer` no arquivo parser.js dentro do `setInterval`
- [] Translate this README.md to english


### Quer contribuir? :smile:

- Caso tenha achado algum bug etc pode usar [github issues](https://github.com/victor99z/morphett-viewer/issues)
- Pull requests sao bem vindas. [como criar pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github)
