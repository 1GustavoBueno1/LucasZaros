/* Detalhe do imóvel: conteúdo, galeria e WhatsApp com mensagem pronta */
(function () {
  var root = document.getElementById("imovel");
  var id = new URLSearchParams(location.search).get("id");
  var im = LZ.imoveis.filter(function (i) { return i.id === id; })[0];

  if (!im) {
    root.innerHTML =
      '<section class="container not-found">' +
        '<h1 class="display h-lg">Imóvel não encontrado</h1>' +
        '<p class="lead">O link pode estar incompleto ou o imóvel já saiu do site. Veja os imóveis disponíveis agora.</p>' +
        '<a class="btn btn--primary" href="imoveis.html">Ver imóveis disponíveis</a>' +
      "</section>";
    return;
  }

  document.title = im.titulo + " em " + im.bairro + " | Lucas Zaros";

  var fin = im.finalidade === "venda" ? "Venda" : "Aluguel";
  var preco = LZ.preco(im);
  var link = /^https?:/.test(location.href) ? " " + location.href : "";
  var msg = "Olá, Sônia! Tenho interesse no imóvel " + im.codigo + ": " + im.titulo +
    ", no bairro " + im.bairro + " (" + fin.toLowerCase() + ", " + preco + "). Pode me passar mais informações?" + link;

  var fatos = [
    { v: im.quartos || "—", l: im.suites ? "Quartos, " + im.suites + (im.suites > 1 ? " suítes" : " suíte") : "Quartos" },
    { v: im.banheiros, l: "Banheiros" },
    { v: im.vagas || "—", l: "Vagas" },
    { v: im.area.toLocaleString("pt-BR"), u: "m²", l: "Área construída" }
  ];

  var itens = im.itens.slice();
  if (im.terreno) itens.unshift("Terreno de " + LZ.area(im.terreno));

  root.innerHTML =
    '<section class="detail-head">' +
      '<div class="container">' +
        '<ol class="crumbs" aria-label="Você está em">' +
          '<li><a href="index.html">Início</a></li>' +
          '<li><a href="imoveis.html">Imóveis</a></li>' +
          '<li><a href="imoveis.html?bairro=' + encodeURIComponent(im.bairro) + '">' + im.bairro + "</a></li>" +
          "<li>" + im.codigo + "</li>" +
        "</ol>" +
        '<h1 class="display detail-title">' + im.titulo + "</h1>" +
        '<p class="detail-meta">' +
          "<span>" + LZ.icon("pin") + im.bairro + ", Rondonópolis – MT</span>" +
          "<span>" + LZ.tipos[im.tipo] + (im.finalidade === "venda" ? " à venda" : " para alugar") + "</span>" +
          "<span>Código " + im.codigo + "</span>" +
        "</p>" +
      "</div>" +
    "</section>" +

    '<div class="container detail">' +
      "<div>" +
        '<div class="gallery" aria-roledescription="galeria" aria-label="Fotos do imóvel">' +
          '<div class="gallery__main" tabindex="0">' +
            '<img id="g-img" src="' + LZ.foto(im.fotos[0]) + '" alt="">' +
            (im.fotos.length > 1
              ? '<button class="gallery__nav gallery__nav--prev" type="button" aria-label="Foto anterior">' + LZ.icon("left") + "</button>" +
                '<button class="gallery__nav gallery__nav--next" type="button" aria-label="Próxima foto">' + LZ.icon("right") + "</button>"
              : "") +
            '<p class="gallery__count" aria-live="polite"><b id="g-n">1</b> / ' + im.fotos.length + "</p>" +
          "</div>" +
          (im.fotos.length > 1
            ? '<div class="thumbs">' + im.fotos.map(function (f, i) {
                return '<button type="button" data-i="' + i + '" aria-label="Foto ' + (i + 1) + '"><img src="' + LZ.foto(f, 240) + '" alt="" loading="lazy"></button>';
              }).join("") + "</div>"
            : "") +
        "</div>" +

        '<dl class="facts">' + fatos.map(function (f) {
          return "<div><dt>" + f.l + "</dt><dd>" + f.v + (f.u ? "<small>" + f.u + "</small>" : "") + "</dd></div>";
        }).join("") + "</dl>" +

        '<div class="block">' +
          '<h2 class="display">Sobre o imóvel</h2>' +
          '<div class="prose">' + im.descricao.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>" +
        "</div>" +

        '<div class="block">' +
          '<h2 class="display">Características</h2>' +
          '<ul class="checklist">' + itens.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" +
        "</div>" +

        '<div class="block">' +
          '<h2 class="display">Localização</h2>' +
          '<div class="map-box">' +
            '<span class="map-box__pin" aria-hidden="true"></span>' +
            '<p class="map-box__label"><strong>' + im.bairro + "</strong>, Rondonópolis – MT. O endereço exato é passado no atendimento.</p>" +
          "</div>" +
        "</div>" +
      "</div>" +

      '<div class="buy-box-wrap">' +
        '<aside class="buy-box" aria-label="Valor e contato">' +
          '<p class="buy-box__label">' + (im.finalidade === "venda" ? "Valor de venda" : "Valor do aluguel") + "</p>" +
          '<p class="buy-box__price">' + LZ.precoDe(im) + preco + "</p>" +
          '<a class="btn btn--primary btn--block" data-contact="whatsapp" data-msg="' + msg.replace(/"/g, "&quot;") + '">' + LZ.icon("whats") + "Falar sobre este imóvel</a>" +
          '<a class="btn btn--ghost btn--block" data-contact="phone">' + LZ.icon("phone") + "Ligar para a Sônia</a>" +
          '<p class="buy-box__note">A mensagem do WhatsApp já vai com o código ' + im.codigo + ".</p>" +
          '<div class="agent">' +
            "<div><strong>Sônia</strong><span>Assistente do Lucas Zaros, CRECI/MT 17.566F</span></div>" +
          "</div>" +
        "</aside>" +
      "</div>" +
    "</div>" +

    '<div class="sticky-bar">' +
      '<p class="sticky-bar__price"><small>' + fin + "</small>" + preco + "</p>" +
      '<a class="btn btn--primary" data-contact="whatsapp" data-msg="' + msg.replace(/"/g, "&quot;") + '">' + LZ.icon("whats") + "WhatsApp</a>" +
    "</div>";

  document.body.classList.add("has-sticky");

  // Galeria
  var atual = 0;
  var img = document.getElementById("g-img");
  var nEl = document.getElementById("g-n");
  var thumbs = root.querySelectorAll(".thumbs button");

  function mostra(i) {
    atual = (i + im.fotos.length) % im.fotos.length;
    img.src = LZ.foto(im.fotos[atual]);
    img.alt = im.titulo + ", foto " + (atual + 1) + " de " + im.fotos.length;
    nEl.textContent = atual + 1;
    thumbs.forEach(function (t, k) {
      t.setAttribute("aria-current", k === atual ? "true" : "false");
      if (k === atual) {
        // rola só a faixa de miniaturas, nunca a página
        var box = t.parentNode;
        if (t.offsetLeft < box.scrollLeft || t.offsetLeft + t.offsetWidth > box.scrollLeft + box.clientWidth) {
          box.scrollLeft = t.offsetLeft - 16;
        }
      }
    });
  }

  // Pré-carrega as fotos para a troca ser imediata
  im.fotos.forEach(function (f) { new Image().src = LZ.foto(f); });

  var prev = root.querySelector(".gallery__nav--prev");
  var next = root.querySelector(".gallery__nav--next");
  if (prev) {
    prev.addEventListener("click", function () { mostra(atual - 1); });
    next.addEventListener("click", function () { mostra(atual + 1); });
    thumbs.forEach(function (t) {
      t.addEventListener("click", function () { mostra(Number(t.dataset.i)); });
    });
    var main = root.querySelector(".gallery__main");
    main.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") mostra(atual - 1);
      if (e.key === "ArrowRight") mostra(atual + 1);
    });
    var x0 = null;
    main.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    main.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) mostra(atual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
  mostra(0);

  // Similares: mesma finalidade primeiro
  var outros = LZ.imoveis.filter(function (i) { return i.id !== im.id; }).sort(function (a, b) {
    return (b.finalidade === im.finalidade) - (a.finalidade === im.finalidade);
  }).slice(0, 3);
  document.getElementById("similares").innerHTML = outros.map(function (i) { return LZ.card(i); }).join("");
  document.getElementById("similares-wrap").hidden = false;
})();
