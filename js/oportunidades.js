/* Oportunidades da semana: lista, filtro e detalhe com galeria */
(function () {
  var grid = document.getElementById("op-grid");
  var status = document.getElementById("op-status");
  var filtros = document.getElementById("op-filtros");
  var sheet = document.getElementById("op-sheet");
  var detalhe = document.getElementById("op-detalhe");
  var lista = [];

  function specs(im) {
    var s = [];
    if (im.quartos) s.push(["bed", im.quartos + (im.quartos > 1 ? " quartos" : " quarto")]);
    if (im.banheiros) s.push(["bath", im.banheiros + (im.banheiros > 1 ? " banheiros" : " banheiro")]);
    if (im.vagas) s.push(["car", im.vagas + (im.vagas > 1 ? " vagas" : " vaga")]);
    if (im.area) s.push(["area", LZ.area(im.area)]);
    return s;
  }

  function baixou(im) {
    return im.precoAntigo && im.precoAntigo > im.preco ? im.precoAntigo - im.preco : 0;
  }

  function card(im) {
    var desc = baixou(im);
    return (
      '<li class="op-card" data-fin="' + im.finalidade + '">' +
        '<button class="op-card__link" type="button" data-id="' + im.id + '" aria-haspopup="dialog">' +
          '<span class="op-card__media">' +
            (im.fotos[0] ? '<img src="' + LZ.foto(im.fotos[0], true) + '" alt="" loading="lazy" width="640" height="640">' : "") +
            '<span class="op-tag">' + (im.finalidade === "aluguel" ? "Aluguel" : "Venda") + "</span>" +
            (desc ? '<span class="op-tag op-tag--baixou">Baixou ' + LZ.dinheiro(desc) + "</span>" : "") +
            (im.fotos.length > 1 ? '<span class="op-card__n">' + im.fotos.length + " fotos</span>" : "") +
          "</span>" +
          '<span class="op-card__body">' +
            '<span class="op-card__place">' + LZ.icon("pin") + im.bairro + (im.codigo ? '<span class="op-card__code">' + im.codigo + "</span>" : "") + "</span>" +
            '<span class="op-card__title">' + im.titulo + "</span>" +
            '<span class="op-specs">' + specs(im).map(function (s) { return "<span>" + LZ.icon(s[0]) + s[1] + "</span>"; }).join("") + "</span>" +
            '<span class="op-card__price">' +
              (desc ? '<s>De ' + LZ.dinheiro(im.precoAntigo) + "</s>" : "") +
              LZ.preco(im) +
            "</span>" +
          "</span>" +
        "</button>" +
      "</li>"
    );
  }

  function mostraFiltros() {
    var fins = lista.reduce(function (a, im) { if (a.indexOf(im.finalidade) < 0) a.push(im.finalidade); return a; }, []);
    if (fins.length < 2) return;
    var op = [["", "Todas"], ["venda", "Venda"], ["aluguel", "Aluguel"]];
    filtros.innerHTML = op.map(function (o, i) {
      return '<button type="button" class="op-chip" data-f="' + o[0] + '" aria-pressed="' + (i === 0) + '">' + o[1] + "</button>";
    }).join("");
    filtros.hidden = false;
    filtros.addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]");
      if (!b) return;
      filtros.querySelectorAll("[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      grid.querySelectorAll(".op-card").forEach(function (c) {
        c.hidden = !!b.dataset.f && c.dataset.fin !== b.dataset.f;
      });
    });
  }

  function abre(im) {
    var desc = baixou(im);
    var fatos = [];
    if (im.quartos) fatos.push([im.quartos, im.suites ? "Quartos, " + im.suites + (im.suites > 1 ? " suítes" : " suíte") : "Quartos"]);
    if (im.banheiros) fatos.push([im.banheiros, "Banheiros"]);
    if (im.vagas) fatos.push([im.vagas, "Vagas"]);
    if (im.area) fatos.push([LZ.area(im.area), "Construída"]);
    if (im.terreno) fatos.push([LZ.area(im.terreno), "Terreno"]);

    detalhe.innerHTML =
      '<div class="op-gal">' +
        '<div class="op-gal__track" id="op-track" tabindex="0" aria-label="Fotos do imóvel, role para o lado">' +
          im.fotos.map(function (f, i) {
            return '<img src="' + LZ.foto(f) + '" alt="Foto ' + (i + 1) + " de " + im.fotos.length + '" loading="' + (i < 2 ? "eager" : "lazy") + '">';
          }).join("") +
        "</div>" +
        (im.fotos.length > 1
          ? '<button class="op-gal__nav op-gal__nav--prev" type="button" data-nav="-1" aria-label="Foto anterior">' + LZ.icon("left") + "</button>" +
            '<button class="op-gal__nav op-gal__nav--next" type="button" data-nav="1" aria-label="Próxima foto">' + LZ.icon("right") + "</button>" +
            '<p class="op-gal__count" aria-live="polite"><b id="op-n">1</b> / ' + im.fotos.length + "</p>"
          : "") +
      "</div>" +
      '<div class="op-info">' +
        '<p class="op-info__place">' + LZ.icon("pin") + im.bairro + ", Rondonópolis – MT" +
          (im.codigo ? " · " + im.codigo : "") + "</p>" +
        '<h2 class="display op-info__title" id="op-title">' + im.titulo + "</h2>" +
        '<p class="op-info__price">' +
          (desc ? '<s>De ' + LZ.dinheiro(im.precoAntigo) + "</s>" : "") +
          "<strong>" + LZ.preco(im) + "</strong>" +
          (desc ? '<span class="op-tag op-tag--baixou">Baixou ' + LZ.dinheiro(desc) + "</span>" : "") +
        "</p>" +
        (fatos.length ? '<dl class="op-fatos">' + fatos.map(function (f) { return "<div><dt>" + f[1] + "</dt><dd>" + f[0] + "</dd></div>"; }).join("") + "</dl>" : "") +
        (im.descricao && im.descricao.length ? '<div class="op-prose">' + im.descricao.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>" : "") +
        (im.itens && im.itens.length ? '<h3 class="op-sub">Destaques</h3><ul class="op-itens">' + im.itens.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" : "") +
      "</div>";

    var link = /^https?:/.test(location.href) ? " " + location.href.split("#")[0] + "#" + im.id : "";
    document.getElementById("op-whats").href = LZ.whatsLink(
      "Olá, Sônia! Vi nas oportunidades da semana " + (im.codigo ? "o imóvel " + im.codigo + ": " : "") +
      im.titulo + ", no bairro " + im.bairro + " (" + LZ.preco(im) + "). Pode me passar mais informações?" + link
    );

    var track = document.getElementById("op-track");
    var n = document.getElementById("op-n");
    if (n) {
      track.addEventListener("scroll", function () {
        n.textContent = Math.round(track.scrollLeft / track.clientWidth) + 1;
      }, { passive: true });
    }

    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    document.body.classList.add("no-scroll");
    detalhe.scrollTop = 0;
    if (location.hash !== "#" + im.id) history.replaceState(null, "", "#" + im.id);
  }

  function fecha() {
    if (typeof sheet.close === "function") sheet.close(); else sheet.removeAttribute("open");
  }

  sheet.addEventListener("close", function () {
    document.body.classList.remove("no-scroll");
    history.replaceState(null, "", location.pathname + location.search);
  });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet || e.target.closest("[data-close]")) return fecha();
    var nav = e.target.closest("[data-nav]");
    if (nav) {
      var track = document.getElementById("op-track");
      track.scrollBy({ left: track.clientWidth * Number(nav.dataset.nav), behavior: "smooth" });
    }
  });
  sheet.addEventListener("keydown", function (e) {
    var track = document.getElementById("op-track");
    if (!track || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    track.scrollBy({ left: track.clientWidth * (e.key === "ArrowLeft" ? -1 : 1), behavior: "smooth" });
  });

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-id]");
    if (b) abre(lista.filter(function (im) { return im.id === b.dataset.id; })[0]);
  });

  fetch("oportunidades/oportunidades.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (dados) {
      // textos vêm do painel: escapa antes de montar o HTML
      lista = dados.map(function (im) {
        var o = {};
        Object.keys(im).forEach(function (k) {
          var v = im[k];
          o[k] = typeof v === "string" ? LZ.esc(v) : Array.isArray(v) && k !== "fotos" ? v.map(LZ.esc) : v;
        });
        return o;
      });
      if (!lista.length) {
        status.innerHTML = "Nenhuma oportunidade publicada nesta semana. Conte o que você procura e a Sônia te avisa quando aparecer.";
        return;
      }
      status.textContent = lista.length + (lista.length > 1 ? " oportunidades nesta semana" : " oportunidade nesta semana");
      grid.innerHTML = lista.map(card).join("");
      mostraFiltros();
      var alvo = location.hash.slice(1);
      var im = alvo && lista.filter(function (i) { return i.id === alvo; })[0];
      if (im) abre(im);
    })
    .catch(function () {
      status.textContent = "Não foi possível carregar as oportunidades. Atualize a página ou fale com a Sônia pelo WhatsApp.";
    });
})();
