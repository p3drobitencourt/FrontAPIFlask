import { BarterRecord } from "./types.js";

export const barterDatabase: BarterRecord[] = [
  {
    id: "rec001",
    sourceId: "Artigo 1.1",
    category: "Conceito",
    title: "O que é Operação de Barter?",
    content: "O Barter é um mecanismo de financiamento de safras agrícolas no qual o produtor rural adquire insumos (como fertilizantes, sementes e defensivos) sem pagar em dinheiro, mas sim comprometendo uma parte de sua produção futura como forma de pagamento para a trading ou distribuidora."
  },
  {
    id: "rec002",
    sourceId: "Manual Cargill, p. 12",
    category: "Conceito",
    title: "Origem do Termo e Prática no Agronegócio",
    content: "A palavra 'barter' significa escambo ou troca direta. No agronegócio brasileiro, essa operação consolidou-se no início dos anos 2000 como alternativa ao crédito bancário tradicional, permitindo que trades e indústrias de insumos financiem diretamente os agricultores em troca de grãos físico pós-colheita."
  },
  {
    id: "rec003",
    sourceId: "Guia de Trocas Agro",
    category: "Conceito",
    title: "Principais Insumos Envolvidos no Barter",
    content: "Os fertilizantes (como NPK: Nitrogênio, Fósforo e Potássio e fontes de Enxofre) representam o maior volume físico e financeiro trocado via barter, seguidos por sementes transgênicas de soja e milho, e defensivos agrícolas como herbicidas, fungicidas e inseticidas."
  },
  {
    id: "rec004",
    sourceId: "Artigo Técnico Barter",
    category: "Conceito",
    title: "Vantagens para o Produtor Rural",
    content: "Para o produtor, as principais vantagens do barter são: 1) Mitigação do risco cambial e de flutuação de preços (travamento da relação de troca); 2) Ausência de desembolso financeiro imediato antes ou durante o plantio; 3) Simplificação da logística e faturamento, coordenados pela trading parceira."
  },
  {
    id: "rec005",
    sourceId: "Analise Finanças Agro",
    category: "Conceito",
    title: "Vantagens para as Tradings e Fornecedores",
    content: "Para as tradings de grãos, o barter assegura a originação de soja e milho para exportação com antecedência. Para os produtores de fertilizantes, garante a venda programada de matéria-prima e reduz a inadimplência, pois o recebimento ocorre direto em grãos transacionados por uma trading garantidora."
  },
  {
    id: "rec006",
    sourceId: "Fluxograma Operacional",
    category: "Operacional",
    title: "Como funciona o fluxo operacional do barter?",
    content: "O fluxo operacional do barter envolve três agentes: o Produtor (propõe a troca), o Fornecedor de Insumos (entrega o fertilizante) e a Trading/Indústria Química (recebe o grão pós-colheita, paga o fornecedor e entrega os dólares/reais restantes ou liquida o débito contratual do produtor)."
  },
  {
    id: "rec007",
    sourceId: "Cartilha ANDAV",
    category: "Operacional",
    title: "A Relação de Troca (Troca Química por Física)",
    content: "A relação de troca é expressa em sacas de grãos (como sacas de soja de 60kg ou sacas de milho) por tonelada de fertilizante ou pacote de insumos por hectare. Por exemplo: o produtor assina o contrato sabendo que pagará exatamente 18 sacas de soja por tonelada do adubo NPK contratado."
  },
  {
    id: "rec008",
    sourceId: "Curso Prático de Barter",
    category: "Operacional",
    title: "Momento de Fechamento do Contrato (Lock-In)",
    content: "O fechamento do barter ocorre meses antes do plantio (geralmente entre janeiro e abril para a safra de soja do mesmo ano). O produtor avalia a cotação do grão na Bolsa de Chicago (CBOT) e o custo dos fertilizantes. Quando a relação de troca atinge um patamar favorável, ele realiza o travamento (hedge)."
  },
  {
    id: "rec009",
    sourceId: "Logística Agro",
    category: "Operacional",
    title: "Logística de Entrega de Insumos vs Recebimento de Grãos",
    content: "A entrega física dos fertilizantes ocorre antes do início do plantio (normalmente entre julho e setembro). Já a devolução física do grão colhido pelo agricultor ocorre no início do ano seguinte (fevereiro a maio) nos armazéns credenciados da trading parceira."
  },
  {
    id: "rec010",
    sourceId: "Metodologia Trading",
    category: "Operacional",
    title: "Diferença entre Barter Físico e Financeiro",
    content: "No barter físico, o produtor entrega a produção física real (grãos limpos e secos) nos silos da trading. No barter financeiro, liquida-se o contrato com base no valor equivalente em dinheiro da quantidade contratada de grãos, usando a cotação média de mercado do dia do vencimento."
  },
  {
    id: "rec011",
    sourceId: "Aritmética Agro",
    category: "Cálculo",
    title: "Cálculo da relação de troca (Sacas de Soja por Tonelada)",
    content: "Para calcular a relação de troca: Relação = (Custo da Tonelada de Fertilizante em US$) / (Preço Futuro do Grão por saca em US$). Se a tonelada de adubo custa US$ 540 e o preço futuro da soja travado é US$ 30 por saca, a relação de troca é de exatamente 18 sacas de soja por tonelada (540 / 30 = 18)."
  },
  {
    id: "rec012",
    sourceId: "Simulação de Viabilidade",
    category: "Cálculo",
    title: "Exemplo Prático de Troca por Fertilizante NPK 04-14-08",
    content: "Para uma área que exige 400 kg de NPK por hectare, com adubo custando R$ 3.000/tonelada e a soja futura cotada a R$ 120/saca: O fertilizante custa R$ 1.200 por hectare. A relação de troca é 25 sacas de soja por tonelada de adubo. Logo, o custo por hectare é equivalente a 10 sacas de soja (1.200 / 120 = 10)."
  },
  {
    id: "rec013",
    sourceId: "Economia Aplicada",
    category: "Cálculo",
    title: "Impacto das Oscilações de Moedas e Bolsa",
    content: "Como o fertilizante é majoritariamente importado (precificados em dólar) e a soja é cotada internacionalmente pela CBOT em dólares, o barter protege o produtor de desvalorizações do Real, pois as duas pontas da transação (custo e receita) estão dolarizadas e se compensam mutuamente."
  },
  {
    id: "rec014",
    sourceId: "Tese Gestão de Risco",
    category: "Cálculo",
    title: "O Custo Financeiro Embutido na Troca",
    content: "Embora pareça uma transação direta de mercadoria, as empresas embutem taxas de juros, custos de originação administrativa e seguros agrícolas no valor total dos fertilizantes ofertados para barter. Geralmente a taxa embutida implícita varia de 1% a 2% ao mês sobre o prazo da operação."
  },
  {
    id: "rec015",
    sourceId: "Gestão Operacional",
    category: "Cálculo",
    title: "Cálculo do Ponto de Equilíbrio (Break-Even)",
    content: "O break-even do barter consiste em identificar a produtividade mínima (sacas por hectare) necessária para cobrir a parcela comprometida com a adubação. Se o produtor gasta 10 sacas/ha em barter de fertilizantes de um total histórico de 65 sacas/ha colhidas, o adubo consome 15.38% do seu potencial produtivo."
  },
  {
    id: "rec016",
    sourceId: "Lei n 8.929/1994",
    category: "Riscos & CPR",
    title: "O que é a CPR (Cédula de Produto Rural) no Barter?",
    content: "A CPR física ou financeira é o principal título de crédito e garantia utilizado em operações de barter. Ela é emitida pelo produtor rural, registrada em órgãos autorizados (como a B3) e formaliza a promessa de entrega futura de determinada quantidade de grãos (soja, milho, café) na qualidade acordada."
  },
  {
    id: "rec017",
    sourceId: "Manual de Crédito Rural",
    category: "Riscos & CPR",
    title: "Garantias Reais Associadas à CPR",
    content: "Para mitigar os riscos de inadimplência, a CPR emitida no barter pode conter cláusulas de Penhor Agrícola da safra (alienação fiadora sobre a lavoura plantada), Hipoteca das terras produtoras, ou até mesmo garantia pessoal/fidejussória (aval dos sócios ou proprietários)."
  },
  {
    id: "rec018",
    sourceId: "Informativo Agronômico",
    category: "Riscos & CPR",
    title: "Risco Climático e 'Frustração de Safra'",
    content: "O risco de frustração de safra por fatores biológicos ou climáticos (como secas extremas, excesso de chuvas na colheita ou pragas) recai sobre o produtor. Ele deve entregar o montante fixado de sacas descritas na CPR. Em caso de seca extrema, o produtor precisa honrar a dívida comprando grãos de terceiros."
  },
  {
    id: "rec019",
    sourceId: "Relatório de Mercado",
    category: "Riscos & CPR",
    title: "Cláusulas de 'Washout' em Contratos Agrícolas",
    content: "A cláusula de washout prevê o procedimento de indenização financeira à trading caso o produtor não entregue os grãos físicos pactuados. O cálculo do washout baseia-se na diferença de preço entre o valor contratado e o preço de mercado atual da soja no dia previsto para entrega física."
  },
  {
    id: "rec020",
    sourceId: "Estudo Jurídico Agro",
    category: "Riscos & CPR",
    title: "Risco de Crédito da Trading e Recuperação Judicial",
    content: "Caso o produtor rural entre em Recuperação Judicial (RJ), os contratos de barter garantidos por CPR física de entrega futura têm tratamento legal complexo. Súmulas recentes do STJ apontam que o penhor fiduciário ou adiantamento físico de insumos confere maior blindagem para a devolução das sacas."
  },
  {
    id: "rec021",
    sourceId: "Regulamento ICMS, Art 8",
    category: "Legislação & ICMS",
    title: "Tributação Básica de Saída de Insumos (Adubos)",
    content: "A comercialização de fertilizantes e componentes minerais para agricultura goza de isenções e reduções de alíquotas de ICMS em conformidade com o Convênio ICMS 100/97 do CONFAZ, que regula e incentiva tributos de insumos para agropecuária nacional com desconto expressivo."
  },
  {
    id: "rec022",
    sourceId: "Parecer Receita Federal",
    category: "Legislação & ICMS",
    title: "Tratamento de PIS e COFINS no Barter",
    content: "A operação de Barter é reconhecida tributariamente como uma permuta de ativos. PIS e COFINS incidentes sobre insumos rurais possuem regimes especiais com suspensão ou retenção na fonte. A trading de grãos acumula créditos e compensa-os nas etapas subsequentes de exportação isenta."
  },
  {
    id: "rec023",
    sourceId: "Manual Contábil Agro",
    category: "Legislação & ICMS",
    title: "Faturamento e Emissão de Notas Fiscais no Barter",
    content: "No barter clássico, devem ser emitidas pelo menos três Notas Fiscais estruturadas: 1) Nota de Venda de Fertilizantes emitida pelo fornecedor contra o produtor; 2) Nota de compra futura de grãos emitida pela Trading; 3) Nota de remessa física no momento da entrega dos grãos pelo produtor agrícola."
  },
  {
    id: "rec024",
    sourceId: "Jurisprudência Tributária",
    category: "Legislação & ICMS",
    title: "Distinção de Operações Triangulares de Barter",
    content: "Operações triangulares ocorrem quando o fornecedor de fertilizante faturará o produtor, mas a cobrança é enviada por cessão de direitos diretamente ao e-mail/silo da Trading. O fisco exige rigorosa documentação comercial (contrato tripartite) para evitar acusação de sonegação ou venda mascarada."
  },
  {
    id: "rec025",
    sourceId: "Livro Contabilidade do Campo",
    category: "Legislação & ICMS",
    title: "Registro de Custos com Variação Cambial",
    content: "No fechamento do balanço, o produtor contabiliza os adubos como custos de produção a valor presente. A variação cambial da soja futura associada deve ser registrada como ganho ou perda de instrumento financeiro de proteção (Hedge cambial simplificado ou derivativo de mercadorias)."
  },
  {
    id: "rec026",
    sourceId: "Guia Fósforo e Potássio",
    category: "Conceito",
    title: "Por que os fertilizantes são tão vitais no cerrado?",
    content: "O solo do Cerrado brasileiro, onde se concentra a maior produção de soja, é naturalmente ácido, de baixa fertilidade e com alta fixação de fósforo. Sem a aplicação em grande escala de fosfatos solúveis, calcário calcinado e potássio, a produtividade seria inviável, tornando a importação de adubo crítica."
  },
  {
    id: "rec027",
    sourceId: "Informativo Fertilizantes Br",
    category: "Operacional",
    title: "Vulnerabilidade Brasileira na Importação de Insumos",
    content: "O Brasil importa mais de 85% dos fertilizantes utilizados nacionalmente. Essa forte dependência de mercados estrangeiros (como Rússia, Bielorrússia, Canadá e China) expõe as safras a distorções de fretes marítimos e geopolíticas, o que gera grande volatilidade resolvida pelas travas de barter físico."
  },
  {
    id: "rec028",
    sourceId: "Manual Yara-Nutrição",
    category: "Cálculo",
    title: "NPK e o Papel do Enxofre e Micronutrientes",
    content: "Muitas transações de barter personalizam a formulação de adubação. Fórmulas comuns como NPK 02-20-20 ou NPK 04-14-08 contêm além dos macros, outros nutrientes como Carbonato de Cálcio e Zinco. Seu preço final por tonelada considera os teores puros desses elementos químicos."
  },
  {
    id: "rec029",
    sourceId: "Guia do Agrônomo",
    category: "Riscos & CPR",
    title: "Risco de Armazenagem e Qualidade na Entrega do Grão",
    content: "Ao entregar os grãos, o silo avalia o teor de umidade (limite de 14%), porcentagem de grãos avariados/ardidos (máximo 8%) e impurezas totais (limite 1%). Caso a soja esteja fora desses padrões, a trading aplica descontos de peso na pesagem do caminhão, impactando o saldo da CPR."
  },
  {
    id: "rec030",
    sourceId: "Legislação Federal, Lei 13.986/20",
    category: "Legislação & ICMS",
    title: "Nova Lei do Agro e Modernização da CPR",
    content: "A Lei n 13.986/2020 (conhecida como Lei do Agro) modernizou o barter ao unificar regras e permitir a emissão eletrônica da CPR (CPR Digital) com assinatura em certificado digital ICP-Brasil, além de facilitar salvaguardas fiduciárias e o patrimônio de afetação em terras agrícolas parciais."
  }
];
