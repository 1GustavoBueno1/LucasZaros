/* ==========================================================================
   Dados do site — edite aqui.
   Contatos: os valores entre colchetes são placeholders. Troque pelos dados
   reais do Lucas antes de publicar (um único lugar alimenta o site inteiro).
   ========================================================================== */

window.LZ = window.LZ || {};

LZ.contato = {
  nome: "Lucas Zaros",
  creci: "CRECI/MT 17.566F",
  cidade: "Rondonópolis, Mato Grosso",
  whatsapp: "556699393860",             // só dígitos, com 55 + DDD
  telefoneLink: "+556699393860",
  telefoneExibicao: "(66) 9939-3860",
  email: "contato@[dominio].com.br",
  instagram: "lucaszaros",              // sem @
  endereco: "[Endereço do escritório], Rondonópolis – MT"
};

LZ.empresas = [
  {
    nome: "Baruk House",
    area: "Imóveis",
    texto: "Empreendimentos e imóveis residenciais selecionados em Rondonópolis."
  },
  {
    nome: "Alto Padrão em Foco",
    area: "Alto padrão",
    texto: "Curadoria e apresentação de imóveis de alto padrão, com o cuidado que esse comprador espera."
  },
  {
    nome: "Imobi Talks",
    area: "Podcast",
    texto: "Podcast com conversas sobre mercado imobiliário, investimento e decisões de compra, sem complicação."
  },
  {
    nome: "A Certa",
    area: "Administra Aluguel",
    texto: "Administração de aluguéis: anúncio, contrato, cobrança e acompanhamento do imóvel."
  }
];

(function () {
  /* Fotos ficam em imoveis/<pasta>/01.jpg, 02.jpg... (a 01 é a fachada/capa).
     Cada foto tem uma versão leve "-p.jpg", usada nos cards e nas miniaturas. */
  LZ.foto = function (f, w) {
    return f + (w && w <= 800 ? "-p.jpg" : ".jpg");
  };

  var fotos = function (pasta, total) {
    var arr = [];
    for (var i = 1; i <= total; i++) arr.push("imoveis/" + pasta + "/" + (i < 10 ? "0" : "") + i);
    return arr;
  };

  /* precoAntigo: valor "De ... por" (null quando não houver).
     vagas: null quando o anúncio não informa. */
  LZ.imoveis = [
    {
      id: "granville-2-quartos",
      codigo: "LZ-101",
      titulo: "Casa nova com 2 quartos e amplo quintal",
      tipo: "casa",
      finalidade: "venda",
      preco: 450000,
      precoAntigo: 480000,
      bairro: "Granville I",
      quartos: 2, suites: 1, banheiros: 2, vagas: 1,
      area: 79.46, terreno: 180,
      destaque: true,
      fotos: fotos("granville-2q", 18),
      resumo: "Fachada moderna, projeto luminotécnico e quintal grande para ampliar.",
      descricao: [
        "Casa nova à venda no Granville I, com fachada moderna e projeto luminotécnico. Terreno de 6 x 30 m e 79,46 m² construídos, em boa localização.",
        "São uma suíte e um quarto, banheiro social, sala de TV/estar com cozinha integrada, garagem coberta e lavanderia coberta. Corredor nas laterais e quintal na frente.",
        "O quintal dos fundos é grande e propício para ampliação: dá para fazer um terceiro quarto, piscina ou ofurô."
      ],
      itens: ["Fachada moderna", "Projeto luminotécnico", "01 suíte + 01 quarto", "Banheiro social", "Sala de TV/estar com cozinha integrada", "Corredor nas laterais", "Garagem coberta", "Quintal frontal", "Quintal grande para ampliação (3º quarto, piscina/ofurô)", "Lavanderia coberta", "Apta a financiar"]
    },
    {
      id: "granville-3-quartos",
      codigo: "LZ-102",
      titulo: "Casa nova com 3 quartos, área gourmet e quintal amplo",
      tipo: "casa",
      finalidade: "venda",
      preco: 560000,
      precoAntigo: 630000,
      bairro: "Granville I",
      quartos: 3, suites: 1, banheiros: 2, vagas: null,
      area: 105, terreno: 180,
      destaque: true,
      fotos: fotos("granville-3q", 28),
      resumo: "Três quartos, pé-direito alto, churrasqueira e quintal para piscina.",
      descricao: [
        "Casa nova à venda no Granville I, com fachada clássica, 105 m² construídos em terreno de 180 m² (6 x 30), em excelente localização.",
        "São três quartos, sendo uma suíte frontal, sala de TV/estar com pé-direito alto e projeto luminotécnico, área gourmet com churrasqueira, banheiro social, corredor lateral e lavanderia coberta.",
        "Acabamento 100% laje e porcelanato, portas laqueadas no cinza e paisagismo. Destaque para o grande quintal, pronto para uma futura ampliação (piscina, ofurô etc.)."
      ],
      itens: ["03 quartos, sendo 01 suíte frontal", "Sala com pé-direito alto e projeto luminotécnico", "Área gourmet com churrasqueira", "Banheiro social", "Corredor lateral", "Portas laqueadas no cinza", "100% laje e porcelanato", "Paisagismo/jardim", "Lavanderia coberta", "Quintal grande para ampliação"]
    },
    {
      id: "sagrada-familia-piscina",
      codigo: "LZ-103",
      titulo: "Casa em terreno inteiro com piscina e área gourmet",
      tipo: "casa",
      finalidade: "venda",
      preco: 500000,
      precoAntigo: 650000,
      bairro: "Parque Sagrada Família",
      quartos: 3, suites: 2, banheiros: 2, vagas: null,
      area: 147.56, terreno: 291.2,
      destaque: true,
      fotos: fotos("sagrada-familia-piscina", 21),
      resumo: "Terreno inteiro, piscina e gourmet amplo, perto do Sesc e do Clube dos Bancários.",
      descricao: [
        "Casa em terreno inteiro com piscina, num bairro tradicional e na melhor localização: próximo ao Sesc e ao Clube dos Bancários. São 291,20 m² de terreno e 147,56 m² construídos.",
        "Três dormitórios: uma suíte e um quarto na casa, mais uma suíte nos fundos. Sala de TV com painel, cozinha com planejados e área gourmet ampla com churrasqueira.",
        "Tem ainda piscina, lavanderia com estendal, despensa e corredor lateral."
      ],
      itens: ["Terreno inteiro (291,20 m²)", "03 dormitórios: 1 suíte + 1 quarto + 1 suíte nos fundos", "Sala de TV com painel", "Cozinha com planejados", "Área gourmet ampla com churrasqueira", "Piscina", "Lavanderia com estendal", "Despensa", "Corredor lateral", "Próximo ao Sesc e ao Clube dos Bancários", "Apta a financiar"]
    },
    {
      id: "santa-marta",
      codigo: "LZ-104",
      titulo: "Casa nova com 3 quartos, suíte com closet e varanda gourmet",
      tipo: "casa",
      finalidade: "venda",
      preco: 570000,
      precoAntigo: 675000,
      bairro: "Jardim Santa Marta",
      quartos: 3, suites: 1, banheiros: 3, vagas: 2,
      area: 129, terreno: 200,
      destaque: true,
      fotos: fotos("santa-marta", 16),
      resumo: "Melhor preço do bairro: fachada moderna, 100% blindex e garagem para dois carros.",
      descricao: [
        "Casa nova com o melhor preço do Jardim Santa Marta. Fachada moderna, 129 m² construídos em terreno de 200 m².",
        "Três dormitórios: suíte com closet e dois quartos em espaço privativo. Sala de TV/estar com pé-direito alto e sanca com iluminação em LED. A cozinha ampla tem churrasqueira e forma uma varanda gourmet integrada.",
        "Banheiro social, lavabo na área externa, lavanderia coberta, quintal gramado amplo e garagem coberta para dois carros. Cerca elétrica, 100% blindex, 100% porcelanato e bancadas em granito de alto padrão."
      ],
      itens: ["Suíte com closet", "02 quartos em espaço privativo", "Sala com pé-direito alto e sanca em LED", "Cozinha ampla com churrasqueira (varanda gourmet)", "Banheiro social", "Lavabo na área externa", "Lavanderia coberta", "Amplo quintal gramado", "Garagem coberta para 2 carros", "Cerca elétrica", "100% blindex", "100% porcelanato", "Bancadas em granito alto padrão", "Apto a financiar"]
    },
    {
      id: "sunflower",
      codigo: "LZ-105",
      titulo: "Casa nova com 3 quartos em localização privilegiada",
      tipo: "casa",
      finalidade: "venda",
      preco: 510000,
      precoAntigo: null,
      bairro: "Sunflower",
      quartos: 3, suites: 1, banheiros: 2, vagas: 1,
      area: 110, terreno: 180,
      destaque: true,
      fotos: fotos("sunflower", 18),
      resumo: "Sala com pé-direito alto integrada à cozinha. Aceita carro como parte do pagamento.",
      descricao: [
        "Casa nova à venda no Sunflower, em localização privilegiada. Terreno de 6 x 30 m e 110 m² construídos.",
        "Sala com pé-direito alto integrada à cozinha, três dormitórios (uma suíte e dois quartos) e banheiro social.",
        "Quintal na frente e nos fundos, lavanderia coberta e garagem coberta. Aceita carro como parte do pagamento."
      ],
      itens: ["Sala com pé-direito alto integrada à cozinha", "03 dormitórios: 01 suíte + 02 quartos", "Banheiro social", "Quintal frente e fundo", "Lavanderia coberta", "Garagem coberta", "Aceita carro como parte do pagamento", "Apta a financiar"]
    },
    {
      id: "sagrada-familia-moderna",
      codigo: "LZ-106",
      titulo: "Casa nova com fachada moderna e cozinha gourmet",
      tipo: "casa",
      finalidade: "venda",
      preco: 450000,
      precoAntigo: null,
      bairro: "Parque Sagrada Família",
      quartos: 2, suites: 1, banheiros: 1, vagas: 2,
      area: 88.75, terreno: 152.32,
      destaque: false,
      fotos: fotos("sagrada-familia-moderna", 21),
      resumo: "Churrasqueira, iluminação em LED e garagem para dois carros.",
      descricao: [
        "Casa nova com fachada moderna em localização privilegiada no Parque Sagrada Família. Terreno de 152,32 m² (16 x 9,52 m) e 88,75 m² construídos.",
        "Dois quartos, sendo uma suíte, banheiro, sala de TV/estar e cozinha gourmet com churrasqueira. Lavanderia, quintal nos fundos e garagem para dois carros.",
        "Acabamento 100% porcelanato, esquadrias de alumínio e iluminação em LED."
      ],
      itens: ["02 quartos, sendo 01 suíte", "01 banheiro", "Sala de TV/estar", "Cozinha gourmet com churrasqueira", "Garagem para 2 carros", "Lavanderia", "Quintal nos fundos", "100% porcelanato", "Esquadrias de alumínio", "Iluminação em LED"]
    }
  ];

  LZ.tipos = { casa: "Casa", apartamento: "Apartamento", comercial: "Comercial", rural: "Chácara" };

  LZ.bairros = Array.from(new Set(LZ.imoveis.map(function (i) { return i.bairro; }))).sort(function (a, b) {
    return a.localeCompare(b, "pt-BR");
  });
})();
