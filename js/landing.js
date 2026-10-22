/* Página inicial: números, vitrine, empresas do grupo e animações */
(function () {
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Números saem dos dados, para nunca ficarem desatualizados
  var total = LZ.imoveis.length;
  document.getElementById("f-imoveis").textContent = total;

  var maiorReducao = LZ.imoveis.reduce(function (m, im) {
    return im.precoAntigo ? Math.max(m, im.precoAntigo - im.preco) : m;
  }, 0);
  var fDesc = document.getElementById("f-desconto");
  if (maiorReducao > 0) fDesc.textContent = "R$ " + Math.round(maiorReducao / 1000) + " mil";
  else fDesc.closest(".fact").remove();

  // Vitrine: destaques primeiro, depois os demais
  var vitrine = LZ.imoveis.filter(function (i) { return i.destaque; })
    .concat(LZ.imoveis.filter(function (i) { return !i.destaque; }));
  document.getElementById("destaques").innerHTML = vitrine.map(function (im) {
    return LZ.card(im);
  }).join("") +
    '<a class="rail__more" href="imoveis.html"><span class="display">Ver todos<br>os imóveis</span>' + LZ.icon("arrow") + "</a>";

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
