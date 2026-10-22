/* Utilidades compartilhadas por todas as páginas */
(function () {
  var C = LZ.contato;

  var ICONS = {
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    phone: '<path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    whats: '<path d="M4 20l1.2-4A8 8 0 1 1 8.3 19Z"/><path d="M9 8.5c0 3.5 2.8 6.5 6.5 6.5l1-1.6-2.2-1-1 .9a4.5 4.5 0 0 1-2.1-2.1l.9-1-1-2.2Z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2.5 2.5M14.5 8.5 17 11"/>',
    home: '<path d="M4 11.5 12 5l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>',
    tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4"/>',
    doc: '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>'
  };

  LZ.icon = function (name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  };

  LZ.whatsLink = function (msg) {
    return "https://wa.me/" + C.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");
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
    var header = document.querySelector(".site-header");
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
