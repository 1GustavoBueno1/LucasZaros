/* Imóveis: filtros, ordenação e sincronização com a URL */
(function () {
  var form = document.getElementById("filtros-form");
  var painel = document.getElementById("filtros");
  var lista = document.getElementById("resultados");
  var ordem = document.getElementById("ordem");
  var precoSel = document.getElementById("f-preco");
  var bairroSel = document.getElementById("f-bairro");
  var filterBtn = document.querySelector(".filter-btn");
  var verBtn = document.getElementById("ver-resultados");

  // Monta opções
  document.getElementById("f-tipos").innerHTML = Object.keys(LZ.tipos).map(function (k) {
    return '<input type="checkbox" name="tipo" id="t-' + k + '" value="' + k + '"><label for="t-' + k + '">' + LZ.tipos[k] + "</label>";
  }).join("");
  LZ.bairros.forEach(function (b) {
    bairroSel.insertAdjacentHTML("beforeend", "<option>" + b + "</option>");
  });

  function finalidade() { return form.querySelector('input[name="finalidade"]:checked').value; }

  function atualizaFaixas() {
    var atual = precoSel.value;
    precoSel.innerHTML = LZ.opcoesFaixa(finalidade());
    if (precoSel.querySelector('option[value="' + atual + '"]')) precoSel.value = atual;
  }

  // Estado inicial a partir da URL (vem da busca da home)
  var q = new URLSearchParams(location.search);
  if (q.get("finalidade")) {
    var r = form.querySelector('input[name="finalidade"][value="' + q.get("finalidade") + '"]');
    if (r) r.checked = true;
  }
  (q.get("tipo") || "").split(",").forEach(function (t) {
    var c = document.getElementById("t-" + t);
    if (c) c.checked = true;
  });
  if (q.get("quartos")) {
    var qr = document.getElementById("q-" + q.get("quartos"));
    if (qr) qr.checked = true;
  }
  atualizaFaixas();
  if (q.get("preco")) precoSel.value = q.get("preco");
  if (q.get("bairro")) bairroSel.value = q.get("bairro");
  if (q.get("ordem")) ordem.value = q.get("ordem");

  function lerFiltros() {
    return {
      finalidade: finalidade(),
      tipos: Array.from(form.querySelectorAll('input[name="tipo"]:checked')).map(function (c) { return c.value; }),
      quartos: Number(form.querySelector('input[name="quartos"]:checked').value || 0),
      preco: precoSel.value,
      bairro: bairroSel.value
    };
  }

  function filtrar(f) {
    var faixa = f.preco ? LZ.faixaPorId(f.preco) : null;
    var faixaFin = f.preco ? (f.preco.charAt(0) === "v" ? "venda" : "aluguel") : null;
    return LZ.imoveis.filter(function (im) {
      if (f.finalidade && im.finalidade !== f.finalidade) return false;
      if (f.tipos.length && f.tipos.indexOf(im.tipo) === -1) return false;
      if (f.quartos && im.quartos < f.quartos) return false;
      if (f.bairro && im.bairro !== f.bairro) return false;
      if (faixa && (im.finalidade !== faixaFin || im.preco < faixa.min || im.preco > faixa.max)) return false;
      return true;
    });
  }

  function ordenar(arr) {
    var o = ordem.value;
    return arr.slice().sort(function (a, b) {
      if (o === "menor") return a.preco - b.preco;
      if (o === "maior") return b.preco - a.preco;
      if (o === "area") return b.area - a.area;
      return (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0);
    });
  }

  function syncURL(f) {
    var p = new URLSearchParams();
    if (f.finalidade) p.set("finalidade", f.finalidade);
    if (f.tipos.length) p.set("tipo", f.tipos.join(","));
    if (f.quartos) p.set("quartos", f.quartos);
    if (f.preco) p.set("preco", f.preco);
    if (f.bairro) p.set("bairro", f.bairro);
    if (ordem.value !== "relevancia") p.set("ordem", ordem.value);
    var s = p.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
  }

  function render() {
    var f = lerFiltros();
    var res = ordenar(filtrar(f));
    var n = res.length;

    document.getElementById("count").textContent = n;
    document.getElementById("count-label").textContent = n === 1 ? "imóvel encontrado" : "imóveis encontrados";
    verBtn.textContent = n === 0 ? "Nenhum imóvel" : "Ver " + n + (n === 1 ? " imóvel" : " imóveis");

    var ativos = (f.finalidade ? 1 : 0) + f.tipos.length + (f.quartos ? 1 : 0) + (f.preco ? 1 : 0) + (f.bairro ? 1 : 0);
    filterBtn.setAttribute("data-count", ativos);

    lista.innerHTML = n
      ? res.map(function (im) { return LZ.card(im); }).join("")
      : '<div class="empty"><h2>Nenhum imóvel com esses filtros</h2>' +
        '<p class="muted">Tente outra faixa de preço ou outro bairro. Se não encontrar, a Sônia pode buscar opções fora do site.</p>' +
        '<button class="btn btn--ghost" type="button" data-clear>Limpar filtros</button></div>';

    syncURL(f);
  }

  function limpar() {
    form.reset();
    atualizaFaixas();
    precoSel.value = "";
    bairroSel.value = "";
    render();
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "finalidade") atualizaFaixas();
    render();
  });
  ordem.addEventListener("change", render);
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-clear]")) limpar();
  });

  // Painel de filtros no celular
  function abrir() {
    painel.classList.add("is-open");
    document.body.classList.add("no-scroll");
    painel.querySelector(".filters__close").focus();
  }
  function fechar() {
    painel.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    filterBtn.focus();
  }
  filterBtn.addEventListener("click", abrir);
  painel.querySelector(".filters__close").addEventListener("click", fechar);
  verBtn.addEventListener("click", fechar);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && painel.classList.contains("is-open")) fechar();
  });

  render();
})();
