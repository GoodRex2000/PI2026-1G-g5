document.addEventListener("DOMContentLoaded", () => {
    const quizConteudo = document.querySelector("#quiz_conteudo");

    if (!quizConteudo) {
        return;
    }

    const PLAYLISTS = {
        relaxamento: "https://open.spotify.com/playlist/5gHkW2g4Sw2ddCftexWjMF",
        foco: "https://open.spotify.com/playlist/23UVsIjFWxOr5evud05LsV",
        sono: "https://open.spotify.com/playlist/37i9dQZF1DWYcDQ1hSjOpY",
        emocoes: "https://open.spotify.com/playlist/3wj5mu2ylnT683zHSYBS7J"
    };

    const categorias = ["relaxamento", "foco", "sono", "emocoes"];
    const letras = ["A", "B", "C", "D"];
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

    const perguntas = [
        {
            titulo: "O que você mais quer ao apertar o play agora?",
            alternativas: [
                { texto: "Desacelerar e fazer uma pausa tranquila", pontos: { relaxamento: 3, sono: 1 } },
                { texto: "Entrar no ritmo de uma tarefa ou estudo", pontos: { foco: 3 } },
                { texto: "Criar um clima calmo para o fim do dia", pontos: { sono: 3, relaxamento: 1 } },
                { texto: "Acolher o que sinto e renovar minha energia", pontos: { emocoes: 3 } }
            ]
        },
        {
            titulo: "Em qual situação essa playlist vai acompanhar você?",
            alternativas: [
                { texto: "Em uma pausa depois de um dia agitado", pontos: { relaxamento: 3, emocoes: 1 } },
                { texto: "Durante uma sessão de estudo, leitura ou trabalho", pontos: { foco: 3 } },
                { texto: "Na rotina antes de deitar", pontos: { sono: 3, relaxamento: 1 } },
                { texto: "Quando eu quiser mudar o clima e levantar o ânimo", pontos: { emocoes: 3, foco: 1 } }
            ]
        },
        {
            titulo: "Qual paisagem sonora chama mais sua atenção?",
            alternativas: [
                { texto: "Natureza, água, vento e instrumentos delicados", pontos: { relaxamento: 3, sono: 1 } },
                { texto: "Batidas constantes e poucos vocais", pontos: { foco: 3, emocoes: 1 } },
                { texto: "Sons ambientes bem lentos e contínuos", pontos: { sono: 3, relaxamento: 1 } },
                { texto: "Melodias marcantes e músicas cheias de expressão", pontos: { emocoes: 3 } }
            ]
        },
        {
            titulo: "Que tipo de ritmo combina com o seu momento?",
            alternativas: [
                { texto: "Lento e leve, mas ainda desperto", pontos: { relaxamento: 3 } },
                { texto: "Regular, discreto e fácil de acompanhar", pontos: { foco: 3, relaxamento: 1 } },
                { texto: "Muito suave, quase como um embalo", pontos: { sono: 3 } },
                { texto: "Vivo, variado e com mais energia", pontos: { emocoes: 3, foco: 1 } }
            ]
        },
        {
            titulo: "O que a música deveria fazer ao seu redor?",
            alternativas: [
                { texto: "Abrir espaço para respirar e desacelerar", pontos: { relaxamento: 3 } },
                { texto: "Ajudar a deixar as distrações em segundo plano", pontos: { foco: 3 } },
                { texto: "Marcar que o dia está terminando", pontos: { sono: 3, relaxamento: 1 } },
                { texto: "Combinar com meu humor ou dar um novo impulso", pontos: { emocoes: 3 } }
            ]
        },
        {
            titulo: "Por quanto tempo você imagina essa escuta?",
            alternativas: [
                { texto: "Alguns minutos para fazer uma pausa", pontos: { relaxamento: 3, emocoes: 1 } },
                { texto: "Um bloco inteiro de atividade concentrada", pontos: { foco: 3 } },
                { texto: "Até eu me sentir pronto para encerrar o dia", pontos: { sono: 3 } },
                { texto: "O tempo de curtir, cantar ou mudar a energia", pontos: { emocoes: 3 } }
            ]
        },
        {
            titulo: "Como você gostaria de terminar essa experiência?",
            alternativas: [
                { texto: "Com uma sensação de leveza e espaço", pontos: { relaxamento: 3 } },
                { texto: "Com uma tarefa encaminhada ou concluída", pontos: { foco: 3 } },
                { texto: "Com o ambiente mais tranquilo para descansar", pontos: { sono: 3, relaxamento: 1 } },
                { texto: "Mais conectado com o que sinto e com nova energia", pontos: { emocoes: 3 } }
            ]
        }
    ];

    const resultados = {
        relaxamento: {
            categoria: "Relaxamento",
            icone: "≈",
            titulo: "Um respiro combina com você agora",
            mensagem: "Suas escolhas mostram preferência por sons leves e por uma pausa sem pressa. Esta playlist pode criar um fundo tranquilo para você desacelerar e aproveitar o momento."
        },
        foco: {
            categoria: "Foco",
            icone: "◎",
            titulo: "É hora de entrar no seu ritmo",
            mensagem: "Você escolheu constância, poucas distrações e companhia para uma atividade. Esta playlist foi pensada para preencher o ambiente sem disputar sua atenção."
        },
        sono: {
            categoria: "Sono",
            icone: "☾",
            titulo: "Seu momento combina com sons mais suaves",
            mensagem: "Suas respostas favoreceram ritmos lentos e um clima sereno para o fim do dia. Experimente esta playlist em volume confortável como parte da sua rotina noturna."
        },
        emocoes: {
            categoria: "Emoções",
            icone: "♡",
            titulo: "Expressão e energia combinam com você",
            mensagem: "Você se aproximou de músicas com presença, movimento e significado. Esta playlist pode acompanhar o seu humor, acolher o momento e trazer um novo impulso para o dia."
        }
    };

    const progresso = document.querySelector("#quiz_progresso");
    const progressoBarra = document.querySelector("#quiz_progresso_barra");
    const progressoTexto = document.querySelector("#quiz_progresso_texto");
    const progressoPorcentagem = document.querySelector("#quiz_progresso_porcentagem");

    let perguntaAtual = 0;
    let respostas = Array(perguntas.length).fill(null);
    let emTransicao = false;

    function atualizarProgresso(resultadoPronto = false) {
        const etapa = resultadoPronto ? perguntas.length : perguntaAtual + 1;
        const porcentagem = Math.round((etapa / perguntas.length) * 100);

        progressoBarra.style.width = `${porcentagem}%`;
        progresso.setAttribute("aria-valuenow", String(etapa));
        progressoTexto.textContent = resultadoPronto
            ? "Resultado pronto"
            : `Pergunta ${etapa} de ${perguntas.length}`;
        progressoPorcentagem.textContent = `${porcentagem}%`;
    }

    function renderizarPergunta(deveMoverFoco = true) {
        const pergunta = perguntas[perguntaAtual];
        const alternativaMarcada = respostas[perguntaAtual];

        atualizarProgresso();
        quizConteudo.innerHTML = `
            <form class="quiz_formulario quiz_tela">
                <fieldset>
                    <legend class="quiz_pergunta_titulo" tabindex="-1">${pergunta.titulo}</legend>
                    <p class="quiz_instrucao">Escolha a alternativa que mais se aproxima da sua preferência.</p>
                    <div class="quiz_alternativas">
                        ${pergunta.alternativas.map((alternativa, indice) => `
                            <label class="quiz_alternativa">
                                <input
                                    type="radio"
                                    name="resposta"
                                    value="${indice}"
                                    ${alternativaMarcada === indice ? "checked" : ""}
                                >
                                <span class="quiz_alternativa_letra" aria-hidden="true">${letras[indice]}</span>
                                <span class="quiz_alternativa_texto">${alternativa.texto}</span>
                                <span class="quiz_alternativa_check" aria-hidden="true">✓</span>
                            </label>
                        `).join("")}
                    </div>
                </fieldset>

                <div class="quiz_acoes">
                    ${perguntaAtual > 0
                        ? '<button class="botao botao_secundario quiz_voltar" type="button"><span aria-hidden="true">←</span> Voltar</button>'
                        : '<span class="quiz_acao_espacador" aria-hidden="true"></span>'}
                    <button class="botao botao_primario quiz_avancar" type="submit" ${alternativaMarcada === null ? "disabled" : ""}>
                        ${perguntaAtual === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta"}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </form>
        `;

        const formulario = quizConteudo.querySelector(".quiz_formulario");
        const botaoAvancar = quizConteudo.querySelector(".quiz_avancar");

        formulario.addEventListener("change", (evento) => {
            if (evento.target.name !== "resposta" || emTransicao) {
                return;
            }

            respostas[perguntaAtual] = Number(evento.target.value);
            botaoAvancar.disabled = false;
        });

        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            if (respostas[perguntaAtual] === null || emTransicao) {
                return;
            }

            formulario.querySelector("fieldset").disabled = true;
            botaoAvancar.disabled = true;

            if (perguntaAtual === perguntas.length - 1) {
                transicionar(renderizarResultado);
                return;
            }

            transicionar(() => {
                perguntaAtual += 1;
                renderizarPergunta();
            });
        });

        quizConteudo.querySelector(".quiz_voltar")?.addEventListener("click", () => {
            if (emTransicao) {
                return;
            }

            transicionar(() => {
                perguntaAtual -= 1;
                renderizarPergunta();
            });
        });

        if (deveMoverFoco) {
            moverFocoParaConteudo();
        }
    }

    function calcularPontuacao() {
        const pontuacao = Object.fromEntries(categorias.map((categoria) => [categoria, 0]));

        respostas.forEach((resposta, indicePergunta) => {
            const pontosDaAlternativa = perguntas[indicePergunta].alternativas[resposta].pontos;

            Object.entries(pontosDaAlternativa).forEach(([categoria, pontos]) => {
                pontuacao[categoria] += pontos;
            });
        });

        return pontuacao;
    }

    function obterCategoriaFinal() {
        const pontuacao = calcularPontuacao();
        const maiorPontuacao = Math.max(...Object.values(pontuacao));
        const categoriasEmpatadas = categorias.filter((categoria) => pontuacao[categoria] === maiorPontuacao);

        if (categoriasEmpatadas.length === 1) {
            return categoriasEmpatadas[0];
        }

        const pontosDoObjetivo = perguntas[0].alternativas[respostas[0]].pontos;
        const objetivoPrincipal = categorias
            .filter((categoria) => pontosDoObjetivo[categoria])
            .sort((categoriaA, categoriaB) => pontosDoObjetivo[categoriaB] - pontosDoObjetivo[categoriaA])[0];

        return categoriasEmpatadas.includes(objetivoPrincipal)
            ? objetivoPrincipal
            : categoriasEmpatadas[0];
    }

    function renderizarResultado() {
        const categoriaFinal = obterCategoriaFinal();
        const resultado = resultados[categoriaFinal];

        atualizarProgresso(true);
        quizConteudo.innerHTML = `
            <article class="quiz_resultado quiz_tela" data-resultado="${categoriaFinal}">
                <div class="quiz_resultado_icone" aria-hidden="true">${resultado.icone}</div>
                <span class="eyebrow">Sua recomendação: ${resultado.categoria}</span>
                <h3 class="quiz_resultado_titulo" tabindex="-1">${resultado.titulo}</h3>
                <p>${resultado.mensagem}</p>
                <p class="quiz_resultado_observacao">Esta é uma sugestão de playlist baseada nas suas preferências, não uma avaliação de saúde.</p>
                <div class="quiz_resultado_acoes">
                    <a class="botao botao_spotify" href="${PLAYLISTS[categoriaFinal]}" target="_blank" rel="noopener noreferrer" aria-label="Ouvir playlist de ${resultado.categoria} (abre em nova aba)">
                        <span class="spotify_ponto" aria-hidden="true"></span>
                        Ouvir playlist
                        <span aria-hidden="true">↗</span>
                    </a>
                    <button class="botao botao_secundario quiz_refazer" type="button">Refazer Quiz</button>
                </div>
            </article>
        `;

        quizConteudo.querySelector(".quiz_refazer").addEventListener("click", reiniciarQuiz);
        moverFocoParaConteudo();
    }

    function reiniciarQuiz() {
        perguntaAtual = 0;
        respostas = Array(perguntas.length).fill(null);
        transicionar(renderizarPergunta);
    }

    function transicionar(renderizar) {
        if (emTransicao) {
            return;
        }

        emTransicao = true;

        if (reduzirMovimento.matches) {
            renderizar();
            emTransicao = false;
            return;
        }

        quizConteudo.classList.add("esta_saindo");

        window.setTimeout(() => {
            renderizar();
            quizConteudo.classList.remove("esta_saindo");
            emTransicao = false;
        }, 180);
    }

    function moverFocoParaConteudo() {
        const atrasoDoFoco = reduzirMovimento.matches ? 0 : 60;

        window.setTimeout(() => {
            const titulo = quizConteudo.querySelector(".quiz_pergunta_titulo, .quiz_resultado_titulo");
            titulo?.focus({ preventScroll: true });
        }, atrasoDoFoco);
    }

    renderizarPergunta(false);
});
