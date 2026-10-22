/* Painel de oportunidades: lê e grava oportunidades/oportunidades.json e as
   fotos direto no repositório do GitHub. Cada ação vira um commit no branch
   publicado, e a Vercel atualiza o site sozinha. O token fica só neste aparelho. */
(function () {
  var JSON_PATH = "oportunidades/oportunidades.json";
  var FOTOS_DIR = "oportunidades/fotos/";
  var CHAVE = "lz-admin";

  var $ = function (id) { return document.getElementById(id); };
  var cfg = null;
  var lista = [];
  var editando = null;   // oportunidade em edição (null = nova)
  var fotos = [];        // { base } existentes ou { file, url } novas

  /* ---------- Configuração ---------- */

  function lerCfg() {
    try {
      var t = localStorage.getItem(CHAVE) || sessionStorage.getItem(CHAVE);
      return t ? JSON.parse(t) : null;
    } catch (e) { return null; }
  }
  function gravarCfg(c, lembrar) {
    try {
      localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE);
      (lembrar ? localStorage : sessionStorage).setItem(CHAVE, JSON.stringify(c));
    } catch (e) { /* sem armazenamento: vale só nesta aba */ }
  }

  /* ---------- GitHub ---------- */

  function gh(caminho, opcoes) {
    opcoes = opcoes || {};
    return fetch("https://api.github.com/repos/" + cfg.repo + caminho, {
      method: opcoes.method || "GET",
      headers: {
        Authorization: "Bearer " + cfg.token,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
      cache: "no-store"
    }).then(function (r) {
      if (r.ok) return r.json();
      var msg = {
        401: "Token inválido ou expirado. Gere um novo token e entre de novo.",
        403: "O token não tem permissão de escrita (Contents: Read and write) neste repositório.",
        404: "Repositório ou branch não encontrado, ou o token não tem acesso a ele.",
        409: "O site mudou enquanto você salvava. Tente de novo.",
        422: "O GitHub recusou a alteração. Atualize a página e tente de novo."
      }[r.status] || "Erro do GitHub (" + r.status + "). Tente de novo em instantes.";
      var err = new Error(msg); err.status = r.status;
      throw err;
    });
  }

  function b64ParaTexto(b64) {
    var bin = atob(b64.replace(/\n/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  // Estado atual do branch: commit, árvore e a lista publicada
  function carregar() {
    var estado = {};
    return gh("/git/ref/heads/" + encodeURIComponent(cfg.branch))
      .then(function (ref) {
        estado.commit = ref.object.sha;
        return gh("/git/commits/" + estado.commit);
      })
      .then(function (c) {
        estado.tree = c.tree.sha;
        return gh("/contents/" + JSON_PATH + "?ref=" + estado.commit).catch(function (e) {
          if (e.status === 404) return null;   // ainda não existe: lista vazia
          throw e;
        });
      })
      .then(function (arq) {
        estado.lista = arq ? JSON.parse(b64ParaTexto(arq.content)) : [];
        return estado;
      });
  }

  // Grava num único commit: novas fotos, fotos removidas e o JSON atualizado
  function salvar(alterar, mensagem, progresso) {
    return carregar().then(function (estado) {
      var mudanca = alterar(estado.lista);
      var novos = mudanca.novos || [];
      var apagar = mudanca.apagar || [];
      var feitos = 0;

      var blobs = novos.reduce(function (p, arq) {
        return p.then(function (acc) {
          if (progresso) progresso("Enviando fotos " + (feitos + 1) + " de " + novos.length + "…");
          return gh("/git/blobs", { method: "POST", body: { content: arq.base64, encoding: "base64" } })
            .then(function (b) { feitos++; acc.push({ path: arq.path, mode: "100644", type: "blob", sha: b.sha }); return acc; });
        });
      }, Promise.resolve([]));

      // Só apaga o que existe no repositório (o GitHub recusa caminhos inexistentes)
      var existentes = apagar.length
        ? gh("/git/trees/" + estado.tree + "?recursive=1").then(function (t) {
            var set = {};
            t.tree.forEach(function (n) { set[n.path] = true; });
            return apagar.filter(function (p) { return set[p]; });
          })
        : Promise.resolve([]);

      return Promise.all([blobs, existentes]).then(function (r) {
        if (progresso) progresso("Publicando…");
        var arvore = r[0]
          .concat(r[1].map(function (p) { return { path: p, mode: "100644", type: "blob", sha: null }; }))
          .concat([{ path: JSON_PATH, mode: "100644", type: "blob", content: JSON.stringify(mudanca.lista, null, 2) + "\n" }]);
        return gh("/git/trees", { method: "POST", body: { base_tree: estado.tree, tree: arvore } });
      }).then(function (t) {
        return gh("/git/commits", { method: "POST", body: { message: mensagem, tree: t.sha, parents: [estado.commit] } });
      }).then(function (c) {
        return gh("/git/refs/heads/" + encodeURIComponent(cfg.branch), { method: "PATCH", body: { sha: c.sha } });
      }).then(function () {
        lista = mudanca.lista;
        render();
      });
    });
  }

  /* ---------- Fotos: redimensiona no aparelho antes de enviar ---------- */

  function carregaImagem(file) {
    return new Promise(function (ok, falha) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () { ok({ img: img, url: url }); };
      img.onerror = function () { falha(new Error("Não deu para abrir a foto " + file.name + ". Use JPG ou PNG.")); };
      img.src = url;
    });
  }

  function jpeg(img, max, qualidade) {
    var k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    var c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", qualidade).split(",")[1];
  }

  /* ---------- Utilidades ---------- */

  function slug(t) {
    return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "imovel";
  }
  function inteiro(v) { var d = String(v || "").replace(/\D/g, ""); return d ? Number(d) : null; }
  function decimal(v) {
    var t = String(v || "").trim().replace(/\./g, "").replace(",", ".");
    var n = parseFloat(t);
    return isNaN(n) ? null : n;
  }
  function numTexto(n) { return n == null ? "" : String(n).replace(".", ","); }
  function milhar(n) { return n == null ? "" : n.toLocaleString("pt-BR"); }
  function proximoCodigo() {
    var max = lista.reduce(function (m, im) {
      var n = parseInt(String(im.codigo || "").replace(/\D/g, ""), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 100);
    return "LZ-" + (max + 1);
  }
  function srcFoto(base) { return LZ.foto(base, true); }

  function toast(msg, erro) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.toggle("is-erro", !!erro);
    t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.hidden = true; }, erro ? 7000 : 5000);
  }

  /* ---------- Lista ---------- */

  function render() {
    $("p-total").textContent = lista.length + (lista.length === 1 ? " oportunidade" : " oportunidades");
    $("p-lista").innerHTML = lista.length ? lista.map(function (im) {
      return (
        '<li class="adm-item">' +
          '<img src="' + srcFoto(im.fotos[0] || "") + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
          '<div class="adm-item__body">' +
            '<p class="adm-item__meta">' + LZ.esc(im.codigo || "") + " · " + LZ.esc(im.bairro) + " · " + im.fotos.length + " fotos</p>" +
            '<p class="adm-item__title">' + LZ.esc(im.titulo) + "</p>" +
            '<p class="adm-item__price">' + LZ.preco(im) + "</p>" +
          "</div>" +
          '<div class="adm-item__acoes">' +
            '<button class="adm-icon" type="button" data-editar="' + im.id + '" aria-label="Editar ' + LZ.esc(im.titulo) + '">' + LZ.icon("edit") + "</button>" +
            '<button class="adm-icon adm-icon--perigo" type="button" data-excluir="' + im.id + '" aria-label="Excluir ' + LZ.esc(im.titulo) + '">' + LZ.icon("trash") + "</button>" +
          "</div>" +
        "</li>"
      );
    }).join("") : '<li class="adm-vazio">Nenhuma oportunidade publicada. Toque em "Nova oportunidade" para começar.</li>';
  }

  /* ---------- Formulário ---------- */

  function renderFotos() {
    $("f-thumbs").innerHTML = fotos.map(function (f, i) {
      return (
        '<li class="adm-thumb' + (i === 0 ? " is-capa" : "") + '">' +
          '<img src="' + (f.url || srcFoto(f.base)) + '" alt="Foto ' + (i + 1) + '">' +
          (i === 0 ? '<span class="adm-thumb__capa">Capa</span>' : "") +
          '<div class="adm-thumb__acoes">' +
            (i > 0 ? '<button type="button" data-mover="' + i + '" aria-label="Mover foto ' + (i + 1) + ' para a esquerda">' + LZ.icon("left") + "</button>" : "") +
            '<button type="button" data-tirar="' + i + '" aria-label="Remover foto ' + (i + 1) + '">' + LZ.icon("close") + "</button>" +
          "</div>" +
        "</li>"
      );
    }).join("");
  }

  function abreForm(im) {
    editando = im || null;
    var f = function (id, v) { $(id).value = v == null ? "" : v; };
    $("form-op").querySelectorAll(".field").forEach(function (el) { el.classList.remove("is-invalid"); });
    $("e-fotos").textContent = "";
    $("f-progresso").textContent = "";
    $("f-titulo-h").textContent = im ? "Editar oportunidade" : "Nova oportunidade";
    $("f-codigo").textContent = im ? im.codigo || "Edição" : proximoCodigo();
    $("f-salvar").textContent = im ? "Salvar alterações" : "Publicar oportunidade";
    f("f-titulo", im && im.titulo);
    f("f-finalidade", im ? im.finalidade : "venda");
    f("f-tipo", im ? im.tipo : "casa");
    f("f-bairro", im && im.bairro);
    f("f-preco", im && milhar(im.preco));
    f("f-antigo", im && milhar(im.precoAntigo));
    f("f-quartos", im && im.quartos);
    f("f-suites", im && im.suites);
    f("f-banheiros", im && im.banheiros);
    f("f-vagas", im && im.vagas);
    f("f-area", im && numTexto(im.area));
    f("f-terreno", im && numTexto(im.terreno));
    f("f-descricao", im && (im.descricao || []).join("\n\n"));
    f("f-itens", im && (im.itens || []).join("\n"));
    fotos = im ? im.fotos.map(function (b) { return { base: b }; }) : [];
    renderFotos();
    $("dlg").showModal();
    $("dlg").querySelector(".sheet__body").scrollTop = 0;
  }

  function valida() {
    var ok = true;
    [["f-titulo", $("f-titulo").value.trim()], ["f-bairro", $("f-bairro").value.trim()], ["f-preco", inteiro($("f-preco").value)]]
      .forEach(function (c) {
        var vazio = !c[1];
        $(c[0]).closest(".field").classList.toggle("is-invalid", vazio);
        if (vazio && ok) { $(c[0]).focus(); ok = false; }
      });
    if (!fotos.length) { $("e-fotos").textContent = "Adicione pelo menos uma foto."; ok = false; }
    else $("e-fotos").textContent = "";
    return ok;
  }

  function enviar(e) {
    e.preventDefault();
    if (!valida()) return;
    var botao = $("f-salvar");
    var progresso = function (t) { $("f-progresso").textContent = t; };
    $("f-progresso").classList.remove("is-erro");
    botao.disabled = true;

    var id = editando ? editando.id : slug($("f-titulo").value) + "-" + Date.now().toString(36).slice(-4);
    var carimbo = Date.now().toString(36);
    var novos = [];
    var bases = [];

    // Prepara as fotos novas (grande e leve) na ordem escolhida
    var prepara = fotos.reduce(function (p, f, i) {
      return p.then(function () {
        if (f.base) { bases.push(f.base); return; }
        progresso("Preparando foto " + (i + 1) + " de " + fotos.length + "…");
        return carregaImagem(f.file).then(function (r) {
          var base = FOTOS_DIR + id + "/" + carimbo + "-" + (i + 1);
          novos.push({ path: base + ".jpg", base64: jpeg(r.img, 1600, 0.82) });
          novos.push({ path: base + "-p.jpg", base64: jpeg(r.img, 640, 0.78) });
          bases.push(base);
        });
      });
    }, Promise.resolve());

    prepara.then(function () {
      var para = function (s) { return s.split(/\n\s*\n/).map(function (x) { return x.trim().replace(/\s*\n\s*/g, " "); }).filter(Boolean); };
      var item = {
        id: id,
        codigo: editando ? editando.codigo : proximoCodigo(),
        titulo: $("f-titulo").value.trim(),
        tipo: $("f-tipo").value,
        finalidade: $("f-finalidade").value,
        preco: inteiro($("f-preco").value),
        precoAntigo: inteiro($("f-antigo").value),
        bairro: $("f-bairro").value.trim(),
        quartos: inteiro($("f-quartos").value),
        suites: inteiro($("f-suites").value),
        banheiros: inteiro($("f-banheiros").value),
        vagas: inteiro($("f-vagas").value),
        area: decimal($("f-area").value),
        terreno: decimal($("f-terreno").value),
        descricao: para($("f-descricao").value),
        itens: $("f-itens").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean),
        fotos: bases,
        publicadoEm: editando ? editando.publicadoEm : new Date().toISOString().slice(0, 10)
      };
      var removidas = editando ? editando.fotos.filter(function (b) { return bases.indexOf(b) < 0; }) : [];

      return salvar(function (atual) {
        var nova = editando
          ? atual.map(function (im) { return im.id === id ? item : im; })
          : [item].concat(atual);
        if (editando && !atual.some(function (im) { return im.id === id; })) nova = [item].concat(atual);
        return {
          lista: nova,
          novos: novos,
          apagar: removidas.reduce(function (a, b) { return a.concat([b + ".jpg", b + "-p.jpg"]); }, [])
        };
      }, (editando ? "Oportunidades: edita " : "Oportunidades: adiciona ") + item.codigo + " " + item.titulo, progresso);
    }).then(function () {
      $("dlg").close();
      toast((editando ? "Alterações salvas." : "Oportunidade publicada.") + " O site atualiza em cerca de 1 minuto.");
    }).catch(function (err) {
      // o aviso fica dentro do formulário, que está por cima da página
      $("f-progresso").classList.add("is-erro");
      progresso(err.message || "Não foi possível salvar. Tente de novo.");
    }).then(function () {
      botao.disabled = false;
    });
  }

  function excluir(id) {
    var im = lista.filter(function (x) { return x.id === id; })[0];
    if (!im || !confirm("Excluir “" + im.titulo + "”? As fotos também saem do site.")) return;
    toast("Excluindo…");
    salvar(function (atual) {
      var alvo = atual.filter(function (x) { return x.id === id; })[0] || im;
      return {
        lista: atual.filter(function (x) { return x.id !== id; }),
        apagar: alvo.fotos.reduce(function (a, b) { return a.concat([b + ".jpg", b + "-p.jpg"]); }, [])
      };
    }, "Oportunidades: exclui " + (im.codigo || "") + " " + im.titulo).then(function () {
      toast("Oportunidade excluída. O site atualiza em cerca de 1 minuto.");
    }).catch(function (err) { toast(err.message, true); });
  }

  /* ---------- Telas ---------- */

  function entrar() {
    $("conectar").hidden = true;
    $("painel").hidden = false;
    $("p-repo").textContent = cfg.repo + " (" + cfg.branch + ")";
    $("p-total").textContent = "Carregando…";
    return carregar().then(function (estado) {
      lista = estado.lista;
      render();
    });
  }

  function mostraConectar(erro) {
    $("painel").hidden = true;
    $("conectar").hidden = false;
    $("c-erro").textContent = erro || "";
    $("c-token").closest(".field").classList.toggle("is-invalid", !!erro);
  }

  // Opções do formulário
  Object.keys(LZ.tipos).forEach(function (k) {
    $("f-tipo").insertAdjacentHTML("beforeend", '<option value="' + k + '">' + LZ.tipos[k] + "</option>");
  });
  var bairros = (LZ.categorias || []).filter(function (c) { return c.id === "bairros"; })[0];
  if (bairros) $("l-bairros").innerHTML = bairros.grupos[0].itens.map(function (b) { return "<option value=\"" + b + "\">"; }).join("");

  $("form-conectar").addEventListener("submit", function (e) {
    e.preventDefault();
    var token = $("c-token").value.trim();
    if (!token) return mostraConectar("Cole o token do GitHub.");
    cfg = { token: token, repo: $("c-repo").value.trim(), branch: $("c-branch").value.trim() || "main" };
    entrar().then(function () {
      gravarCfg(cfg, $("c-lembrar").checked);
      $("c-token").value = "";
    }).catch(function (err) { cfg = null; mostraConectar(err.message); });
  });

  $("b-sair").addEventListener("click", function () {
    try { localStorage.removeItem(CHAVE); sessionStorage.removeItem(CHAVE); } catch (e) { /* ok */ }
    cfg = null; lista = [];
    mostraConectar();
  });

  $("b-nova").addEventListener("click", function () { abreForm(null); });

  $("p-lista").addEventListener("click", function (e) {
    var ed = e.target.closest("[data-editar]");
    var ex = e.target.closest("[data-excluir]");
    if (ed) abreForm(lista.filter(function (x) { return x.id === ed.dataset.editar; })[0]);
    if (ex) excluir(ex.dataset.excluir);
  });

  $("f-arquivos").addEventListener("change", function () {
    Array.prototype.forEach.call(this.files, function (file) {
      fotos.push({ file: file, url: URL.createObjectURL(file) });
    });
    this.value = "";
    $("e-fotos").textContent = "";
    renderFotos();
  });

  $("f-thumbs").addEventListener("click", function (e) {
    var m = e.target.closest("[data-mover]");
    var t = e.target.closest("[data-tirar]");
    if (m) { var i = Number(m.dataset.mover); fotos.splice(i - 1, 0, fotos.splice(i, 1)[0]); }
    if (t) fotos.splice(Number(t.dataset.tirar), 1);
    if (m || t) renderFotos();
  });

  $("form-op").addEventListener("submit", enviar);
  $("form-op").addEventListener("input", function (e) {
    var campo = e.target.closest(".field");
    if (campo) campo.classList.remove("is-invalid");
  });
  $("dlg").addEventListener("click", function (e) {
    if (e.target === $("dlg") || e.target.closest("[data-close]")) $("dlg").close();
  });

  cfg = lerCfg();
  if (cfg) entrar().catch(function (err) { mostraConectar(err.message); });
  else mostraConectar();
})();
