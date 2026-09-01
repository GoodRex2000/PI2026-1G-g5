document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

    marcarPaginaAtual();
    prepararCabecalho();
    prepararAnimacoesDeEntrada();
    prepararRealceDosCards();
    prepararFiltros();
    prepararFaq();
    prepararFormulario();
    prepararOndasDeClique();

    function marcarPaginaAtual() {
        const paginaAtual = obterNomeDaPagina(window.location.pathname);
        let linkAtual = null;

        document.querySelectorAll("nav a").forEach((link) => {
            const destino = new URL(link.href, window.location.href);

            if (obterNomeDaPagina(destino.pathname) === paginaAtual) {
                link.setAttribute("aria-current", "page");
                linkAtual = link;
            }
        });

        if (!linkAtual) {
            return;
        }

        window.requestAnimationFrame(() => {
            const navegacao = linkAtual.closest("nav");
            const deslocamento = linkAtual.offsetLeft - ((navegacao.clientWidth - linkAtual.offsetWidth) / 2);

            navegacao.scrollLeft = Math.max(0, deslocamento);
        });
    }

    function obterNomeDaPagina(caminho) {
        const partes = caminho.split("/").filter(Boolean);
        return partes.at(-1) || "index.html";
    }

    function prepararCabecalho() {
        const cabecalho = document.querySelector(".site_header");

        if (!cabecalho) {
            return;
        }

        let atualizacaoPendente = false;

        const atualizar = () => {
            cabecalho.classList.toggle("scrolled", window.scrollY > 24);
            atualizacaoPendente = false;
        };

        window.addEventListener("scroll", () => {
            if (!atualizacaoPendente) {
                window.requestAnimationFrame(atualizar);
                atualizacaoPendente = true;
            }
        }, { passive: true });

        atualizar();
    }

    function prepararAnimacoesDeEntrada() {
        const seletores = [
            ".hero_conteudo > *",
            ".cabecalho_secao",
            ".imagem_moldura",
            ".secao_texto",
            ".beneficio",
            ".funcionamento",
            ".categoria",
            ".playlist",
            ".contato_intro",
            ".formulario_contato",
            ".faq_grupo",
            ".artigo_intro",
            ".artigo_grid > section",
            ".nota_fontes",
            ".quiz_intro_texto",
            ".quiz_visual",
            ".quiz_cabecalho",
            ".quiz_painel",
            ".cta_duvidas > *",
            ".cta_suporte > *",
            ".rodape_conteudo > *"
        ];

        const elementos = [...document.querySelectorAll(seletores.join(","))];

        elementos.forEach((elemento, indice) => {
            elemento.classList.add("reveal");
            elemento.style.setProperty("--reveal-delay", `${(indice % 4) * 65}ms`);
        });

        if (reduzirMovimento.matches || !("IntersectionObserver" in window)) {
            elementos.forEach((elemento) => elemento.classList.add("is_visible"));
            return;
        }

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) {
                    return;
                }

                entrada.target.classList.add("is_visible");
                observador.unobserve(entrada.target);
            });
        }, {
            rootMargin: "0px 0px -7% 0px",
            threshold: 0.1
        });

        elementos.forEach((elemento) => observador.observe(elemento));
    }

    function prepararRealceDosCards() {
        const cards = document.querySelectorAll(".playlist, .beneficio, .funcionamento, .categoria");
        const podeInclinar = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        cards.forEach((card) => {
            card.addEventListener("pointermove", (evento) => {
                const limites = card.getBoundingClientRect();
                const x = evento.clientX - limites.left;
                const y = evento.clientY - limites.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

                if (!podeInclinar || reduzirMovimento.matches || !card.classList.contains("playlist")) {
                    return;
                }

                const rotacaoY = ((x / limites.width) - 0.5) * 4;
                const rotacaoX = ((y / limites.height) - 0.5) * -4;

                card.style.setProperty("--rotate-x", `${rotacaoX.toFixed(2)}deg`);
                card.style.setProperty("--rotate-y", `${rotacaoY.toFixed(2)}deg`);
            });

            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--rotate-x", "0deg");
                card.style.setProperty("--rotate-y", "0deg");
            });
        });
    }

    function prepararFiltros() {
        const filtros = [...document.querySelectorAll("[data-filter]")];
        const playlists = [...document.querySelectorAll(".playlist[data-category]")];
        const categorias = document.querySelectorAll("[data-category-target]");
        const contador = document.querySelector("#contador_playlists");
        const avisoVazio = document.querySelector("#playlist_vazia");
        const secaoPlaylists = document.querySelector("#playlists");

        if (!filtros.length || !playlists.length) {
            return;
        }

        const aplicarFiltro = (filtro) => {
            let totalVisivel = 0;

            filtros.forEach((botao) => {
                const selecionado = botao.dataset.filter === filtro;
                botao.classList.toggle("ativo", selecionado);
                botao.setAttribute("aria-pressed", String(selecionado));
            });

            playlists.forEach((playlist, indice) => {
                const categoriasDoCard = playlist.dataset.category.split(" ");
                const deveAparecer = filtro === "todos" || categoriasDoCard.includes(filtro);

                playlist.hidden = !deveAparecer;

                if (!deveAparecer) {
                    return;
                }

                totalVisivel += 1;

                if (!reduzirMovimento.matches && typeof playlist.animate === "function") {
                    const animacao = playlist.animate([
                        { opacity: 0, transform: "perspective(900px) translateY(15px) scale(.985)" },
                        { opacity: 1, transform: "perspective(900px) translateY(0) scale(1)" }
                    ], {
                        duration: 340,
                        delay: indice * 35,
                        easing: "cubic-bezier(.2,.8,.2,1)",
                        fill: "both"
                    });

                    animacao.finished
                        .then(() => animacao.cancel())
                        .catch(() => {});
                }
            });

            if (contador) {
                contador.textContent = `${totalVisivel} ${totalVisivel === 1 ? "playlist" : "playlists"}`;
            }

            if (avisoVazio) {
                avisoVazio.hidden = totalVisivel !== 0;
            }
        };

        filtros.forEach((botao) => {
            botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filter));
        });

        categorias.forEach((categoria) => {
            const abrirCategoria = () => {
                aplicarFiltro(categoria.dataset.categoryTarget);
                secaoPlaylists?.scrollIntoView({
                    behavior: reduzirMovimento.matches ? "auto" : "smooth",
                    block: "start"
                });
            };

            categoria.addEventListener("click", abrirCategoria);
            categoria.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirCategoria();
                }
            });
        });
    }

    function prepararFaq() {
        const botoes = document.querySelectorAll(".pergunta_botao");

        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                const expandida = botao.getAttribute("aria-expanded") === "true";
                const resposta = botao.nextElementSibling;
                const icone = botao.querySelector(".pergunta_icone");

                botao.setAttribute("aria-expanded", String(!expandida));
                resposta.hidden = expandida;

                if (icone) {
                    icone.textContent = expandida ? "+" : "−";
                }
            });
        });
    }

    function prepararFormulario() {
        const formulario = document.querySelector("#formulario_contato");

        if (!formulario) {
            return;
        }

        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const mensagem = formulario.querySelector(".mensagem_formulario");

            if (mensagem) {
                mensagem.hidden = false;
            }

            formulario.reset();
        });
    }

    function prepararOndasDeClique() {
        document.addEventListener("pointerdown", (evento) => {
            const alvo = evento.target.closest("button, .botao, .playlist_link");

            if (!alvo || reduzirMovimento.matches) {
                return;
            }

            const limites = alvo.getBoundingClientRect();
            const tamanho = Math.max(limites.width, limites.height) * 1.8;
            const onda = document.createElement("span");

            onda.className = "ripple";
            onda.style.width = `${tamanho}px`;
            onda.style.height = `${tamanho}px`;
            onda.style.left = `${evento.clientX - limites.left}px`;
            onda.style.top = `${evento.clientY - limites.top}px`;

            alvo.querySelector(".ripple")?.remove();
            alvo.appendChild(onda);
            onda.addEventListener("animationend", () => onda.remove(), { once: true });
        });
    }
});
