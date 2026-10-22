/* Utilidades compartilhadas por todas as páginas */
(function () {
  var C = LZ.contato;

  var ICONS = {
    bed: '<path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9h13a2.5 2.5 0 0 1 2.5 2.5V18M3 15h18M3 18v2M21 18v2M6 9V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V9"/>',
    bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V5.5A1.5 1.5 0 0 1 8.9 5M7 19l-1 2M17 19l1 2"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2.5M19 16v2.5M5 11h14"/><circle cx="8" cy="13.5" r=".6"/><circle cx="16" cy="13.5" r=".6"/>',
    area: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    phone: '<path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    whats: '<path d="M4 20l1.2-4A8 8 0 1 1 8.3 19Z"/><path d="M9 8.5c0 3.5 2.8 6.5 6.5 6.5l1-1.6-2.2-1-1 .9a4.5 4.5 0 0 1-2.1-2.1l.9-1-1-2.2Z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2.5 2.5M14.5 8.5 17 11"/>',
    home: '<path d="M4 11.5 12 5l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>',
    tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
    doc: '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>'
  };

  LZ.icon = function (name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  };

  /* Faixas de preço usadas na busca da home e nos filtros */
  LZ.faixas = {
    venda: [
      { id: "v1", nome: "Até R$ 400 mil", min: 0, max: 400000 },
      { id: "v2", nome: "R$ 400 mil a R$ 800 mil", min: 400000, max: 800000 },
      { id: "v3", nome: "R$ 800 mil a R$ 1,5 milhão", min: 800000, max: 1500000 },
      { id: "v4", nome: "Acima de R$ 1,5 milhão", min: 1500000, max: Infinity }
    ],
    aluguel: [
      { id: "a1", nome: "Até R$ 2.500/mês", min: 0, max: 2500 },
      { id: "a2", nome: "R$ 2.500 a R$ 4.000/mês", min: 2500, max: 4000 },
      { id: "a3", nome: "Acima de R$ 4.000/mês", min: 4000, max: Infinity }
    ]
  };

  LZ.faixaPorId = function (id) {
    return LZ.faixas.venda.concat(LZ.faixas.aluguel).filter(function (f) { return f.id === id; })[0];
  };

  /* Monta as <option> de faixa conforme a finalidade ("" = todas) */
  LZ.opcoesFaixa = function (finalidade, primeiro) {
    var opt = function (f) { return '<option value="' + f.id + '">' + f.nome + "</option>"; };
    var html = '<option value="">' + (primeiro || "Qualquer valor") + "</option>";
    if (finalidade === "venda") return html + LZ.faixas.venda.map(opt).join("");
    if (finalidade === "aluguel") return html + LZ.faixas.aluguel.map(opt).join("");
    return html +
      '<optgroup label="Venda">' + LZ.faixas.venda.map(opt).join("") + "</optgroup>" +
      '<optgroup label="Aluguel">' + LZ.faixas.aluguel.map(opt).join("") + "</optgroup>";
  };

  LZ.preco = function (im) {
    var v = im.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    return im.finalidade === "aluguel" ? v + "/mês" : v;
  };

  /* "De R$ 480.000" riscado, quando o imóvel baixou de preço */
  LZ.precoDe = function (im) {
    if (!im.precoAntigo) return "";
    return '<s class="price-old">De ' + LZ.preco({ preco: im.precoAntigo, finalidade: im.finalidade }) + "</s>";
  };

  LZ.area = function (m2) {
    if (m2 >= 10000) return (m2 / 10000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " ha";
    return m2.toLocaleString("pt-BR") + " m²";
  };

  LZ.whatsLink = function (msg) {
    return "https://wa.me/" + C.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");
  };

  LZ.urlImovel = function (im) {
    return "imovel.html?id=" + im.id;
  };

  LZ.specs = function (im) {
    var s = [];
    if (im.quartos) s.push(["bed", im.quartos + (im.quartos > 1 ? " quartos" : " quarto")]);
    s.push(["bath", im.banheiros + (im.banheiros > 1 ? " banheiros" : " banheiro")]);
    if (im.vagas) s.push(["car", im.vagas + (im.vagas > 1 ? " vagas" : " vaga")]);
    s.push(["area", LZ.area(im.area)]);
    return s;
  };

  /* Card de imóvel — variant: "" | "card--wide" */
  LZ.card = function (im, variant) {
    var specs = LZ.specs(im).map(function (s) {
      return "<li>" + LZ.icon(s[0]) + "<span>" + s[1] + "</span></li>";
    }).join("");
    return (
      '<article class="card ' + (variant || "") + '">' +
        '<a class="card__link" href="' + LZ.urlImovel(im) + '">' +
          '<div class="card__media">' +
            '<img src="' + LZ.foto(im.fotos[0], variant ? 1400 : 800) + '" alt="' + im.titulo + " em " + im.bairro + '" loading="lazy" width="800" height="600">' +
            '<span class="tag tag--' + im.finalidade + '">' + (im.finalidade === "venda" ? "Venda" : "Aluguel") + "</span>" +
          "</div>" +
          '<div class="card__body">' +
            '<p class="card__place">' + LZ.icon("pin") + im.bairro + '<span class="card__code">' + im.codigo + "</span></p>" +
            '<h3 class="card__title">' + im.titulo + "</h3>" +
            '<ul class="specs">' + specs + "</ul>" +
            '<p class="card__price">' + LZ.precoDe(im) + LZ.preco(im) + "</p>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  };

  /* Preenche contatos marcados com data-contact */
  function bindContacts() {
    var map = {
      whatsapp: function (el) {
        el.href = LZ.whatsLink(el.dataset.msg || "Olá, Sônia! Vim pelo site e gostaria de falar sobre imóveis.");
        el.target = "_blank"; el.rel = "noopener";
      },
      phone: function (el) { el.href = "tel:" + C.telefoneLink; },
      email: function (el) { el.href = "mailto:" + C.email; },
      instagram: function (el) {
        el.href = "https://instagram.com/" + C.instagram;
        el.target = "_blank"; el.rel = "noopener";
      }
    };
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      var fn = map[el.dataset.contact];
      if (fn) fn(el);
    });
    var text = {
      phone: C.telefoneExibicao, email: C.email, instagram: "@" + C.instagram,
      creci: C.creci, endereco: C.endereco
    };
    document.querySelectorAll("[data-text]").forEach(function (el) {
      if (text[el.dataset.text]) el.textContent = text[el.dataset.text];
    });
  }

  function nav() {
    var btn = document.querySelector(".menu-btn");
    var header = document.querySelector(".site-header");
    if (btn) {
      btn.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open);
        document.body.classList.toggle("no-scroll", open);
      });
    }
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-icon]").forEach(function (el) {
      el.outerHTML = LZ.icon(el.dataset.icon);
    });
    bindContacts();
    nav();
    var y = document.getElementById("ano");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
