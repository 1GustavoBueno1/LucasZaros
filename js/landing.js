/* Página inicial: categorias, empresas do grupo, animações e barra do WhatsApp */
(function () {
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Categorias: cada uma abre um painel com os locais e tipos que o Lucas atende
  var cats = document.getElementById("cats");
  cats.innerHTML = LZ.categorias.map(function (c) {
    var total = c.grupos.reduce(function (n, g) { return n + g.itens.length; }, 0);
    return (
      '<li class="cat' + (c.destaque ? " cat--destaque" : "") + '" data-reveal>' +
        '<button class="cat__link" type="button" data-cat="' + c.id + '" aria-haspopup="dialog">' +
          '<span class="cat__ico">' + LZ.icon(c.icone) + "</span>" +
          '<span class="cat__body"><span class="cat__title">' + c.titulo + '</span><span class="cat__text">' + c.texto + "</span>" +
          '<span class="cat__count">Ver ' + total + (total > 1 ? " opções" : " opção") + "</span></span>" +
          '<span class="cat__go">' + LZ.icon("arrow") + "</span>" +
        "</button>" +
      "</li>"
    );
  }).join("");

  var sheet = document.getElementById("sheet");
  var body = document.getElementById("sheet-body");
  var busca = document.getElementById("sheet-search");
  var filtro = document.getElementById("sheet-filter");
  var semAcento = function (t) { return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
  var saudacao = "Olá, Sônia! Vim pelo site e ";

  function abre(c) {
    var total = c.grupos.reduce(function (n, g) { return n + g.itens.length; }, 0);
    document.getElementById("sheet-count").textContent = total + (total > 1 ? " opções" : " opção");
    document.getElementById("sheet-title").textContent = c.titulo;
    document.getElementById("sheet-text").textContent = c.texto + " Escolha um e a Sônia te envia o que está disponível.";
    body.innerHTML = c.grupos.map(function (g) {
      return (
        '<section class="sheet__group">' +
          (c.grupos.length > 1 ? '<h3 class="sheet__gname">' + g.nome + "</h3>" : "") +
          '<ul class="sheet__list">' + g.itens.map(function (it) {
            // nomes de lugar ficam como estão; tipos entram em minúscula na frase
            var nome = /(interesse em|procuro|quero) \{x\}/.test(g.msg) ? it.charAt(0).toLowerCase() + it.slice(1) : it;
            var msg = saudacao + g.msg.replace("{x}", nome) + ".";
            return '<li data-nome="' + semAcento(it) + '"><a href="' + LZ.whatsLink(msg) + '" target="_blank" rel="noopener"><span>' + it + "</span>" + LZ.icon("whats") + "</a></li>";
          }).join("") + "</ul>" +
        "</section>"
      );
    }).join("") + '<p class="sheet__empty" hidden>Nenhum bairro com esse nome. Fale com a Sônia pelo botão abaixo.</p>';
    document.getElementById("sheet-cta").href = LZ.whatsLink(saudacao + "quero ver opções de " + c.titulo.toLowerCase() + ".");
    busca.hidden = !c.busca;
    filtro.value = "";
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    document.body.classList.add("no-scroll");
    body.scrollTop = 0;
  }

  function fecha() {
    if (typeof sheet.close === "function") sheet.close(); else sheet.removeAttribute("open");
  }

  cats.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b) return;
    abre(LZ.categorias.filter(function (c) { return c.id === b.dataset.cat; })[0]);
  });
  sheet.addEventListener("close", function () { document.body.classList.remove("no-scroll"); });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet || e.target.closest("[data-close]")) fecha();
  });
  filtro.addEventListener("input", function () {
    var q = semAcento(filtro.value.trim());
    var vistos = 0;
    body.querySelectorAll("li[data-nome]").forEach(function (li) {
      var ok = !q || li.dataset.nome.indexOf(q) > -1;
      li.hidden = !ok;
      if (ok) vistos++;
    });
    body.querySelector(".sheet__empty").hidden = vistos > 0;
  });

  // Empresas do grupo, como as caixas iluminadas do escritório
  document.getElementById("grupo").innerHTML = LZ.empresas.map(function (e) {
    return (
      '<li class="lightbox" data-light>' +
        '<p class="lightbox__area">' + e.area + "</p>" +
        '<h3 class="display lightbox__name">' + e.nome + "</h3>" +
        '<p class="lightbox__text">' + e.texto + "</p>" +
      "</li>"
    );
  }).join("");

  // Revelar ao rolar; as caixas "acendem" uma de cada vez
  var alvos = document.querySelectorAll("[data-reveal], [data-light]");
  if (reduz || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var irmaos = Array.prototype.slice.call(el.parentNode.children);
        var atraso = (irmaos.indexOf(el) * (el.hasAttribute("data-light") ? 260 : 120)) + "ms";
        el.style.transitionDelay = atraso;
        el.style.animationDelay = atraso;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.25 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  // Barra do WhatsApp no celular: aparece depois do topo, some no contato final
  var dock = document.querySelector(".dock");
  var heroAcoes = document.querySelector(".hero__actions");
  var cta = document.getElementById("contato");
  if (dock && "IntersectionObserver" in window) {
    var heroVisivel = true, ctaVisivel = false;
    var atualiza = function () {
      var mostra = !heroVisivel && !ctaVisivel;
      dock.classList.toggle("is-on", mostra);
      dock.setAttribute("aria-hidden", !mostra);
      dock.querySelector("a").tabIndex = mostra ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroVisivel = e[0].isIntersecting; atualiza(); }).observe(heroAcoes);
    new IntersectionObserver(function (e) { ctaVisivel = e[0].isIntersecting; atualiza(); }).observe(cta);
  }
})();
