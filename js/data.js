/* ==========================================================================
   Dados do site — edite aqui.
   Um único lugar alimenta os contatos do site inteiro.
   ========================================================================== */

window.LZ = window.LZ || {};

LZ.contato = {
  nome: "Lucas Zaros",
  creci: "CRECI/MT 17.566F",
  cidade: "Rondonópolis, Mato Grosso",
  whatsapp: "556699393860",             // só dígitos, com 55 + DDD
  telefoneLink: "+556699393860",
  telefoneExibicao: "(66) 9939-3860",
  email: "lucaszaros@gmail.com",
  instagram: "lucaszaros"               // sem @
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

/* Categorias da seção "Explore por categoria".
   Cada item abre o WhatsApp com a mensagem do grupo ({x} = nome do item). */
LZ.categorias = [
  {
    id: "condominios", icone: "condo",
    titulo: "Condomínios fechados",
    texto: "Casas, sobrados, lotes e terrenos em condomínio.",
    grupos: [{
      nome: "Condomínios de Rondonópolis",
      msg: "quero ver imóveis no {x}",
      itens: ["Condomínio do Bosque I", "Condomínio do Bosque II", "Condomínio Natura", "Condomínio Porto Fino (Living Resort)", "Condomínio Royal Boulevard", "Condomínio Unique Higienópolis", "Condomínio Villa Toscana", "Condomínio Village do Cerrado"]
    }]
  },
  {
    id: "edificios", icone: "building",
    titulo: "Edifícios de alto padrão",
    texto: "Apartamentos e coberturas nos melhores prédios.",
    grupos: [{
      nome: "Edifícios de Rondonópolis",
      msg: "quero ver apartamentos no {x}",
      itens: ["Edifício Aurora Boreal", "Edifício Aurora Garden", "Edifício Bela Vista", "Edifício Belvedere", "Edifício Caravaggio", "Edifício Cidade Real", "Edifício Gardênia", "Edifício Grand Aurora", "Edifício Murano", "Edifício Portal do Sul", "Edifício Residencial Rondon", "Edifício Solar do Cerrado", "Edifício Splendore", "Edifício Taiamã", "Gran Lux Club Residence"]
    }]
  },
  {
    id: "bairros", icone: "pin",
    titulo: "Imóveis por bairro",
    texto: "Casas, terrenos e apartamentos em cada região.",
    busca: true,
    grupos: [{
      nome: "Bairros de Rondonópolis",
      msg: "quero ver imóveis no bairro {x}",
      itens: ["Celina Bezerra", "Centro", "Cidade Alta", "Cidade de Deus", "Cidade Salmen", "Colina Verde", "Conjunto São José III", "Coophalis", "Granville I", "Granville II", "Jardim Amizade", "Jardim Belo Horizonte", "Jardim dos Pioneiros", "Jardim Europa", "Jardim Ipanema", "Jardim Liberdade", "Jardim Lourdes", "Jardim Mato Grosso", "Jardim Olga", "Jardim Oliveira", "Jardim Paulista", "Jardim Primavera", "Jardim Santa Clara", "Jardim Santa Marta", "Jardim Três Américas", "Jardim Tropical", "Loteamento Alfredo de Castro", "Monte Líbano", "Novo Horizonte", "Parque das Rosas", "Parque dos Lírios", "Parque Residencial Buriti", "Parque Residencial Nova Era", "Parque Residencial Universitário", "Parque Rosa Bororó", "Parque Sagrada Família", "Parque São Jorge", "Recanto do Parque", "Residencial André Maggi", "Residencial Azaléia", "Sunflower", "Vila Aurora", "Vila Fagundes", "Vila José Sobrinho"]
    }]
  },
  {
    id: "alto-padrao", icone: "diamond", destaque: true,
    titulo: "Alto padrão",
    texto: "O recorte premium do mercado da cidade.",
    grupos: [
      { nome: "Por tipo", msg: "tenho interesse em {x}", itens: ["Casas em condomínio fechado", "Apartamentos amplos e coberturas", "Lançamentos de alto padrão"] },
      { nome: "Endereços de destaque", msg: "quero ver imóveis de alto padrão no {x}", itens: ["Condomínio Natura", "Condomínio Unique Higienópolis", "Edifício Belvedere", "Edifício Splendore", "Gran Lux Club Residence"] }
    ]
  },
  {
    id: "industrial", icone: "factory",
    titulo: "Industrial e galpões",
    texto: "Barracões, áreas e distritos industriais.",
    grupos: [
      { nome: "Por tipo", msg: "tenho interesse em {x}", itens: ["Barracões e galpões à venda", "Áreas e terrenos industriais", "Galpões e barracões para alugar"] },
      { nome: "Distritos industriais", msg: "quero ver imóveis no {x}", itens: ["Distrito Industrial Augusto Bortoli (Razia)", "Distrito Industrial Vetorasso"] }
    ]
  },
  {
    id: "comercial", icone: "store",
    titulo: "Comercial",
    texto: "Salas, pontos e imóveis comerciais.",
    grupos: [{ nome: "Por tipo", msg: "tenho interesse em {x}", itens: ["Salas comerciais e escritórios", "Pontos comerciais e lojas", "Salas e pontos no Centro"] }]
  },
  {
    id: "locacao", icone: "key",
    titulo: "Locação",
    texto: "Casas e apartamentos para alugar.",
    grupos: [
      { nome: "Quero alugar", msg: "procuro {x}", itens: ["Casas para alugar", "Apartamentos para alugar", "Galpões e barracões para alugar"] },
      { nome: "Sou proprietário", msg: "quero {x}", itens: ["Colocar meu imóvel para alugar"] }
    ]
  },
  {
    id: "rural", icone: "tree",
    titulo: "Chácaras e rural",
    texto: "Chácaras, sítios e áreas rurais na região.",
    grupos: [{ nome: "Por tipo", msg: "tenho interesse em {x}", itens: ["Chácaras à venda", "Sítios", "Terrenos e áreas rurais"] }]
  }
];
