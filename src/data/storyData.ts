import {
  ArchetypeResult,
  CharacterProfile,
  ChoiceRecord,
  OriginOption,
  StoryChapter,
  TensionOption,
  ValueDefinition,
  ValueKey,
} from '../types/story';

import heroCrossroadsImg from '../assets/images/hero_crossroads_1794510046392.jpg';
import chapterDepartureImg from '../assets/images/chapter_departure_1794510046091.jpg';
import chapterHorizonImg from '../assets/images/chapter_horizon_1794510047561.jpg';
import chapterTableSilenceImg from '../assets/images/chapter_table_silence_1794510513659.jpg';
import chapterSundayLightImg from '../assets/images/chapter_sunday_light_1794510514357.jpg';
import chapterReflectionImg from '../assets/images/chapter_reflection_1794510046949.jpg';

export const HERO_IMAGE = heroCrossroadsImg;
export const DEPARTURE_IMAGE = chapterDepartureImg;
export const HORIZON_IMAGE = chapterHorizonImg;
export const TABLE_SILENCE_IMAGE = chapterTableSilenceImg;
export const SUNDAY_LIGHT_IMAGE = chapterSundayLightImg;
export const REFLECTION_IMAGE = chapterReflectionImg;

export const VALUE_DEFINITIONS: ValueDefinition[] = [
  {
    key: 'autonomia',
    label: 'Autonomia',
    shortDesc: 'Fidelidade à própria voz, independência de critério e liberdade de escolha.',
    axisPole: 'Autodeterminação',
  },
  {
    key: 'pertencimento',
    label: 'Pertencimento',
    shortDesc: 'Cuidado com vínculos duradouros, raízes compartilhadas e lealdade afetiva.',
    axisPole: 'Vínculo e Raiz',
  },
  {
    key: 'proposito',
    label: 'Propósito',
    shortDesc: 'Busca por sentido, coerência ética e impacto que ultrapassa o imediato.',
    axisPole: 'Sentido e Direção',
  },
  {
    key: 'serenidade',
    label: 'Serenidade',
    shortDesc: 'Presença no agora, aceitação do imprevisto e equilíbrio emocional.',
    axisPole: 'Presença Lúcida',
  },
  {
    key: 'coragem',
    label: 'Coragem',
    shortDesc: 'Disposição para atravessar incertezas e sustentar verdades difíceis.',
    axisPole: 'Abertura ao Risco',
  },
  {
    key: 'empatia',
    label: 'Empatia',
    shortDesc: 'Escuta genuína da vulnerabilidade alheia e delicadeza nas relações.',
    axisPole: 'Escuta Humana',
  },
];

export const ORIGIN_OPTIONS: OriginOption[] = [
  {
    id: 'arquiteto',
    title: 'Guardião da Rotina',
    subtitle: 'Alguém que construiu um cotidiano estável, mas sente o chamado de algo ainda não vivido.',
    narrativeSeed:
      'acostumou-se a organizar os dias com precisão silenciosa, encontrando abrigo nas pequenas certezas da manhã.',
  },
  {
    id: 'viajante',
    title: 'Viajante de Fronteiras',
    subtitle: 'Alguém que já mudou de cidade ou de pele algumas vezes, buscando entender onde realmente pertence.',
    narrativeSeed:
      'carrega nas mãos a leveza de quem sabe recomeçar, embora às vezes se pergunte o que significa criar raiz.',
  },
  {
    id: 'observador',
    title: 'Observador Silencioso',
    subtitle: 'Alguém que escuta mais do que fala, percebendo nuances que escapam à pressa dos outros.',
    narrativeSeed:
      'costuma reparar nos intervalos entre as frases, guardando perguntas que raramente divide em voz alta.',
  },
  {
    id: 'construtora',
    title: 'Construtor de Pontes',
    subtitle: 'Alguém que frequentemente sustenta pessoas ao redor, mesmo quando esquece de perguntar por si.',
    narrativeSeed:
      'aprendeu cedo a ser porto seguro para quem ama, medindo seus passos pelo bem-estar daqueles à sua volta.',
  },
];

export const TENSION_OPTIONS: TensionOption[] = [
  {
    id: 'decepcionar',
    title: 'Entre agradar e ser fiel a si',
    question: 'Até que ponto estou vivendo escolhas minhas ou expectativas alheias?',
    narrativeSeed: 'uma inquietação antiga sobre o preço de desagradar quem caminha ao seu lado',
  },
  {
    id: 'seguranca',
    title: 'Entre a segurança e o sentido',
    question: 'O que estou adiando por medo de perder o chão que já conquistei?',
    narrativeSeed: 'a dúvida silenciosa entre proteger o que já é seguro ou arriscar pelo que faz sentido',
  },
  {
    id: 'pressa',
    title: 'Entre a conquista e a presença',
    question: 'Tenho corrido tanto para o amanhã que esqueci de habitar o hoje?',
    narrativeSeed: 'o cansaço sutil de quem planeja futuros distantes enquanto o presente escorre',
  },
  {
    id: 'controle',
    title: 'Entre o controle e a entrega',
    question: 'Como sigo caminhando quando meus planos não resistem à realidade?',
    narrativeSeed: 'o desconforto de encarar o imprevisto sem ter todas as respostas antecipadas',
  },
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'cap-1',
    index: 0,
    romanNumeral: 'I',
    chapterTitle: 'O Convite na Manhã Cinzenta',
    settingLabel: 'Capítulo I · O Limiar da Partida',
    image: DEPARTURE_IMAGE,
    imageCaption: 'Fig. 1 — Caderno aberto e bússola de latão sob a luz da primeira decisão.',
    dilemma: 'Seguir um chamado pessoal distante ou honrar um compromisso afetivo próximo',
    buildNarrative: (profile: CharacterProfile) => [
      `Logo cedo, a luz atravessa a janela com uma calma quase severa. ${profile.name}, que ${profile.origin.narrativeSeed}, segura uma carta aberta sobre a mesa de carvalho.`,
      `Trata-se de um convite inesperado para liderar um projeto transformador em outra cidade durante seis meses — exatamente o tipo de travessia capaz de responder a ${profile.tension.narrativeSeed}.`,
      `No entanto, há apenas duas semanas, você prometeu estar presente no momento mais delicado da vida de Clara, alguém que sempre esteve ao seu lado. O prazo de resposta termina hoje ao entardecer.`,
    ],
    choices: [
      {
        id: 'c1-autonomia',
        label: 'Aceitar o convite e partir, assumindo o desgaste da conversa difícil com Clara.',
        actionText:
          'Você respira fundo, escreve a confirmação e decide encarar Clara frente a frente ainda esta tarde, sem esconder o quanto essa escolha lhe custa.',
        reflectionNote: 'Priorizou o movimento próprio mesmo diante do risco de frustrar uma expectativa afetiva.',
        echoLine:
          'A decisão de partir ainda reverbera em sua memória como o primeiro sinal de que você não aceitaria permanecer pequeno para caber no conforto alheio.',
        revealedPerspective:
          'Você tende a proteger sua liberdade de crescimento mesmo quando ela exige conversas emocionalmente custosas.',
        weights: { autonomia: 3, coragem: 2, proposito: 1 },
      },
      {
        id: 'c1-pertencimento',
        label: 'Recusar o projeto agora para sustentar sua palavra junto a quem confia em você.',
        actionText:
          'Você dobra a carta com serenidade e escolhe honrar o vínculo presente, acreditando que uma conquista construída sobre uma ausência pesaria demais.',
        reflectionNote: 'Escolheu a integridade relacional e o cuidado imediato acima da oportunidade externa.',
        echoLine:
          'O gesto de permanecer ao lado de Clara deixou em você a certeza tranquila de que suas raízes não são descartáveis.',
        revealedPerspective:
          'Para você, a coerência nos vínculos humanos tem peso maior do que oportunidades brilhantes que exigem abandono.',
        weights: { pertencimento: 3, empatia: 2, serenidade: 1 },
      },
      {
        id: 'c1-proposito',
        label: 'Propor um formato híbrido e arriscar perder a vaga caso não aceitem suas condições.',
        actionText:
          'Em vez de escolher entre os extremos, você redige uma contraproposta honesta, expondo seus limites e tentando integrar responsabilidade e chamado.',
        reflectionNote: 'Buscou uma terceira via criativa, testando os limites do possível sem abrir mão dos próprios princípios.',
        echoLine:
          'A tentativa de negociar seus próprios termos mostrou que você prefere redesenhar o caminho a aceitar dilemas prontos.',
        revealedPerspective:
          'Você procura sínteses éticas: não gosta de sacrificar nem seu propósito nem suas relações sem antes tentar dialogar.',
        weights: { proposito: 2, coragem: 2, autonomia: 1, empatia: 1 },
      },
    ],
  },
  {
    id: 'cap-2',
    index: 1,
    romanNumeral: 'II',
    chapterTitle: 'A Verdade Sobre a Mesa',
    settingLabel: 'Capítulo II · A Clareza nas Relações',
    image: HORIZON_IMAGE,
    imageCaption: 'Fig. 2 — Terraço ao entardecer, quando o silêncio pede sinceridade.',
    dilemma: 'Oferecer a verdade desconfortável ou proteger a fragilidade do outro',
    buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => [
      `${priorEchoes[0] ?? ''}`,
      `No fim da tarde, no terraço de pedra diante da água calma, Rafael apresenta a ${profile.name} o plano ao qual dedicou o último ano inteiro. Ele está exausto, esperançoso e claramente cego para uma falha estrutural que pode levá-lo ao colapso financeiro em poucos meses.`,
      `Com a voz embargada, ele pergunta o que você realmente pensa. Você percebe que suas palavras hoje podem definir não apenas o próximo passo dele, mas o tom da amizade entre vocês.`,
    ],
    choices: [
      {
        id: 'c2-coragem',
        label: 'Apontar a falha com clareza direta, mesmo sabendo que ele pode se ferir e se afastar.',
        actionText:
          'Você apoia a mão na mesa e escolhe a franqueza respeitosa: mostra exatamente onde os números não fecham, recusando-se a oferecer um consolo vazio.',
        reflectionNote: 'Colocou a lucidez e a honestidade acima do alívio momentâneo.',
        echoLine:
          'As palavras diretas ditas a Rafael ainda lembram você de que a lealdade verdadeira às vezes soa áspera no primeiro instante.',
        revealedPerspective:
          'Você valoriza a verdade lúcida como forma de respeito, preferindo o desconforto breve à ilusão prolongada.',
        weights: { coragem: 3, proposito: 2, autonomia: 1 },
      },
      {
        id: 'c2-empatia',
        label: 'Acolher primeiro o cansaço dele e guardar as críticas técnicas para outro dia.',
        actionText:
          'Você percebe que hoje Rafael não tem estrutura emocional para um choque frontal; ouve em silêncio, valida seu esforço e marca uma conversa prática para a semana seguinte.',
        reflectionNote: 'Respeitou o tempo emocional do outro antes de introduzir a correção.',
        echoLine:
          'Ter respeitado o ritmo frágil de Rafael confirmou seu instinto de que nenhuma verdade floresce em solo exausto.',
        revealedPerspective:
          'Você compreende que a forma e o momento de dizer algo importam tanto quanto o conteúdo da verdade.',
        weights: { empatia: 3, serenidade: 2, pertencimento: 1 },
      },
      {
        id: 'c2-autonomia',
        label: 'Devolver a ele perguntas abertas para que descubra a falha por conta própria.',
        actionText:
          'Em vez de entregar um veredito, você pergunta sobre os cenários de risco e observa o olhar dele se estreitar aos poucos diante das próprias respostas.',
        reflectionNote: 'Confiou na autonomia do outro para enxergar o que precisava sem tutela.',
        echoLine:
          'As perguntas silenciosas feitas a Rafael reforçaram sua crença de que cada pessoa precisa amadurecer suas próprias conclusões.',
        revealedPerspective:
          'Você evita o papel de salvador ou juiz, acreditando que o despertar genuíno nasce da autoria do outro.',
        weights: { autonomia: 2, empatia: 2, serenidade: 1, proposito: 1 },
      },
    ],
  },
  {
    id: 'cap-3',
    index: 2,
    romanNumeral: 'III',
    chapterTitle: 'Quando o Plano Desaba',
    settingLabel: 'Capítulo III · O Encontro com o Imprevisto',
    image: HERO_IMAGE,
    imageCaption: 'Fig. 3 — A névoa na encosta lembra que nenhum mapa substitui o caminhar.',
    dilemma: 'Reagir ao colapso de um plano com controle rígido, adaptação serena ou reinvenção',
    buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => [
      `${priorEchoes[1] ?? ''}`,
      `Três semanas depois, o inesperado acontece: uma mudança abrupta de cenário cancela o recurso central com o qual ${profile.name} contava para os próximos meses. Todo o roteiro meticulosamente desenhado perde validade em uma única ligação.`,
      `A sensação de vazio bate forte no peito. Diante da página subitamente em branco, qual é o primeiro movimento interno que você escolhe sustentar?`,
    ],
    choices: [
      {
        id: 'c3-serenidade',
        label: 'Suspender a pressa por 48 horas e observar o que sobra quando a ansiedade baixa.',
        actionText:
          'Você fecha o computador, sai para caminhar sem destino e permite que o desconforto se assente antes de tomar qualquer decisão definitiva.',
        reflectionNote: 'Recusou o pânico reativo e escolheu lucidez antes da ação.',
        echoLine:
          'Aquela pausa voluntária no olho do furacão mostrou que sua calma não depende de que tudo esteja sob controle.',
        revealedPerspective:
          'Sua força aparece na capacidade de desacelerar quando o mundo acelera pelo medo.',
        weights: { serenidade: 3, autonomia: 2 },
      },
      {
        id: 'c3-coragem',
        label: 'Usar a ruptura como licença para tentar algo maior do que o plano original.',
        actionText:
          'Se o caminho seguro ruiu, nada mais o obriga a ser tímido. Você abre um novo rascunho e transforma o prejuízo em ponto de reinvenção.',
        reflectionNote: 'Respondeu à perda de controle com ousadia criativa.',
        echoLine:
          'Transformar o desabamento em recomeço provou que, no fundo, você não teme o novo tanto quanto teme a estagnação.',
        revealedPerspective:
          'Diante da instabilidade, você encontra energia na possibilidade de reescrever as regras do próprio jogo.',
        weights: { coragem: 3, proposito: 2, autonomia: 1 },
      },
      {
        id: 'c3-pertencimento',
        label: 'Compartilhar a vulnerabilidade com pessoas de confiança e pedir ajuda real.',
        actionText:
          'Contra o hábito de resolver tudo sozinho, você admite o tropeço para quem lhe quer bem e descobre alianças que não existiam enquanto parecia invulnerável.',
        reflectionNote: 'Substituiu a autossuficiência rígida pela interdependência.',
        echoLine:
          'Admitir que precisava de apoio revelou que sua vulnerabilidade não diminui sua dignidade — apenas a torna humana.',
        revealedPerspective:
          'Você cresce quando lembra que não precisa carregar o peso do mundo em silêncio solitário.',
        weights: { pertencimento: 3, empatia: 2, serenidade: 1 },
      },
    ],
  },
  {
    id: 'cap-4',
    index: 3,
    romanNumeral: 'IV',
    chapterTitle: 'O Preço da Harmonia',
    settingLabel: 'Capítulo IV · Voz e Pertencimento',
    image: TABLE_SILENCE_IMAGE,
    imageCaption: 'Fig. 4 — A mesa de nogueira ao entardecer: entre o acordo tácito e a palavra necessária.',
    dilemma: 'Silenciar para manter a paz aparente ou nomear uma injustiça sutil no grupo',
    buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => [
      `${priorEchoes[2] ?? ''}`,
      `Em um encontro com pessoas importantes para a sua trajetória, uma decisão injusta começa a ser tomada às custas de quem não está na sala para se defender. Todos parecem concordar por conveniência e pressa.`,
      `${profile.name} sente o coração acelerar. Falar agora significa quebrar a atmosfera agradável e talvez carregar o rótulo de difícil; calar significa preservar sua posição, mas levar consigo um incômodo ético difícil de digerir.`,
    ],
    choices: [
      {
        id: 'c4-proposito',
        label: 'Interromper educadamente e nomear a injustiça, mesmo ficando isolado na sala.',
        actionText:
          'Com voz firme e serena, você traz à mesa o nome de quem foi esquecido. O silêncio pesa por dez segundos eternos, mas sua consciência permanece inteira.',
        reflectionNote: 'Sustentou um princípio ético acima da conveniência social.',
        echoLine:
          'Ter quebrado o consenso confortável daquela sala permanece como marca de que sua voz não está à venda por aceitação.',
        revealedPerspective:
          'Para você, a integridade ética vale mais do que a simpatia fácil de um grupo.',
        weights: { proposito: 3, coragem: 2, autonomia: 1 },
      },
      {
        id: 'c4-empatia',
        label: 'Propor o adiamento da decisão até que a pessoa ausente possa ser ouvida.',
        actionText:
          'Você escolhe a diplomacia firme: evita o confronto agressivo, mas impede que a decisão seja fechada sem escuta justa.',
        reflectionNote: 'Defendeu o outro preservando pontes de diálogo no coletivo.',
        echoLine:
          'O pedido de escuta que você sustentou mostrou que firmeza e delicadeza podem habitar o mesmo gesto.',
        revealedPerspective:
          'Você busca justiça sem precisar destruir o espaço de conversa entre as pessoas.',
        weights: { empatia: 3, pertencimento: 2, proposito: 1 },
      },
      {
        id: 'c4-serenidade',
        label: 'Observar em silêncio na hora e agir nos bastidores depois para reparar o dano.',
        actionText:
          'Você evita o desgaste público improdutivo naquela mesa, mas procura os envolvidos individualmente logo após a reunião para reequilibrar a situação.',
        reflectionNote: 'Optou pela eficácia silenciosa em vez da exposição imediata.',
        echoLine:
          'A reparação discreta que você conduziu nos bastidores revelou um estilo de influência que dispensa aplausos.',
        revealedPerspective:
          'Você prefere resolver tensões reais no plano concreto a disputar palco no calor do momento.',
        weights: { serenidade: 2, pertencimento: 2, empatia: 1 },
      },
    ],
  },
  {
    id: 'cap-5',
    index: 4,
    romanNumeral: 'V',
    chapterTitle: 'Um Domingo Sem Tarefas',
    settingLabel: 'Capítulo V · O Uso do Próprio Tempo',
    image: SUNDAY_LIGHT_IMAGE,
    imageCaption: 'Fig. 5 — Luz da manhã sobre a mesa de domingo: o tempo livre revela o que amamos.',
    dilemma: 'Investir o raro tempo livre em legado futuro, presença contemplativa ou encontro afetivo',
    buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => [
      `${priorEchoes[3] ?? ''}`,
      `Pela primeira vez em meses, surge um domingo inteiro sem urgências, prazos ou expectativas externas. A casa está silenciosa e o telefone não chama. Diante desse espelho raro chamado tempo livre, ${profile.name} percebe que o modo como preenche o vazio diz muito sobre o que realmente valoriza.`,
    ],
    choices: [
      {
        id: 'c5-serenidade',
        label: 'Não produzir nada: cozinhar devagar, ler sem metas e habitar o próprio silêncio.',
        actionText:
          'Você desliga notificações e se permite existir sem utilidade mensurável por um dia inteiro, redescobrindo o prazer simples de estar vivo.',
        reflectionNote: 'Reivindicou o direito de ser em vez de apenas produzir.',
        echoLine:
          'Aquele domingo sem metas lembrou ao seu corpo que o valor de uma vida não se mede em produtividade.',
        revealedPerspective:
          'Você reconhece que a presença no instante vale tanto quanto qualquer realização futura.',
        weights: { serenidade: 3, autonomia: 2 },
      },
      {
        id: 'c5-proposito',
        label: 'Dedicar o dia silencioso ao projeto autoral que você sempre adia por falta de foco.',
        actionText:
          'Com alegria genuína e sem culpa, você abre seus rascunhos pessoais e trabalha horas seguidas naquilo que nasce exclusivamente do seu desejo criador.',
        reflectionNote: 'Usou a liberdade para alimentar a própria vocação silenciosa.',
        echoLine:
          'As horas dedicadas à sua criação íntima mostraram que o trabalho, quando nasce do sentido, também é descanso da alma.',
        revealedPerspective:
          'Construir algo com a própria assinatura traz a você uma vitalidade que o ócio passivo não substitui.',
        weights: { proposito: 3, coragem: 1, autonomia: 2 },
      },
      {
        id: 'c5-pertencimento',
        label: 'Reunir quem você ama sem motivo especial e cozinhar para celebrar a presença.',
        actionText:
          'Você manda uma mensagem curta a duas ou três pessoas queridas, abre a porta e transforma um domingo comum em memória partilhada.',
        reflectionNote: 'Escolheu transformar o tempo livre em calor humano e encontro.',
        echoLine:
          'As risadas ao redor da mesa confirmaram que, para você, a felicidade fica incompleta quando não é dividida.',
        revealedPerspective:
          'Seu senso de plenitude floresce na proximidade cotidiana e no cuidado simples com quem importa.',
        weights: { pertencimento: 3, empatia: 2, serenidade: 1 },
      },
    ],
  },
  {
    id: 'cap-6',
    index: 5,
    romanNumeral: 'VI',
    chapterTitle: 'O Espelho da Última Porta',
    settingLabel: 'Capítulo VI · A Síntese da Travessia',
    image: REFLECTION_IMAGE,
    imageCaption: 'Fig. 6 — Prismas sobre travertino: a mesma luz se revela de modos distintos conforme o ângulo.',
    dilemma: 'Definir o critério íntimo que guiará suas próximas escolhas daqui em diante',
    buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => [
      `${priorEchoes[4] ?? ''}`,
      `Meses depois daquela manhã cinzenta, ${profile.name} retorna ao mesmo limiar de pedra diante do horizonte aberto. As perguntas iniciais não desapareceram por mágica — mas agora elas têm contorno, história e peso real nas suas mãos.`,
      `Ao olhar para trás e reconhecer ${profile.tension.narrativeSeed}, qual promessa silenciosa você escolhe levar consigo para a próxima etapa da vida?`,
    ],
    choices: [
      {
        id: 'c6-autonomia',
        label: 'Nunca mais negociar minha verdade íntima em troca de aprovação passageira.',
        actionText:
          'Você sela consigo mesmo o compromisso da lucidez: ouvir o mundo com respeito, mas guardar a palavra final sobre a própria direção.',
        reflectionNote: 'Fechou a jornada afirmando soberania interior e clareza.',
        echoLine: 'Você escolheu a autenticidade como bússola permanente.',
        revealedPerspective:
          'Sua maturidade se apoia na coragem de ser autor da própria história, mesmo sem aplausos.',
        weights: { autonomia: 3, coragem: 2 },
      },
      {
        id: 'c6-empatia',
        label: 'Cuidar para que nenhuma conquista me torne indiferente à dor ou ao tempo do outro.',
        actionText:
          'Você escolhe a ternura lúcida: crescer sem endurecer, mantendo o coração aberto para escutar o que há de humano em cada encontro.',
        reflectionNote: 'Consagrou a sensibilidade e o vínculo como medidas de sucesso.',
        echoLine: 'Você escolheu a humanidade compartilhada como medida de valor.',
        revealedPerspective:
          'Para você, uma vida bem vivida é medida pela qualidade de presença que oferecemos ao mundo.',
        weights: { empatia: 3, pertencimento: 2, serenidade: 1 },
      },
      {
        id: 'c6-proposito',
        label: 'Aceitar que a incerteza faz parte do caminho e seguir construindo o que tem sentido.',
        actionText:
          'Você abandona a exigência de garantias absolutas e dá o próximo passo com serenidade e propósito, sabendo que clareza se constrói andando.',
        reflectionNote: 'Uniu serenidade diante do mistério com compromisso criativo.',
        echoLine: 'Você escolheu caminhar com sentido mesmo sem garantias prévias.',
        revealedPerspective:
          'Sua sabedoria nasce da união entre propósito claro e aceitação serena da impermanência.',
        weights: { proposito: 3, serenidade: 2, coragem: 1 },
      },
    ],
  },
];

export const ARCHETYPE_CATALOG: Record<string, ArchetypeResult> = {
  autonomia_coragem: {
    id: 'autonomia_coragem',
    title: 'O Cartógrafo da Liberdade',
    subtitle: 'Guia-se pela autenticidade e pela coragem de abrir caminhos próprios.',
    summary:
      'Suas escolhas revelam uma mente independente que recusa roteiros herdados no piloto automático. Mesmo quando o preço é o desconforto de contrariar expectativas, você prefere a franqueza e o movimento próprio à estagnação confortável.',
    coreStrength: 'Capacidade rara de sustentar decisões impopulares sem perder o senso de direção.',
    blindSpot:
      'Às vezes a autossuficiência pode virar armadura, dificultando pedir ajuda ou permanecer tempo suficiente para aprofundar raízes.',
    lifePerspective:
      'Você enxerga a vida como território de autoria: ninguém pode caminhar sua estrada por você.',
    guidingQuestion:
      'Em qual área da sua vida você tem confundido independência com isolamento desnecessário?',
    journalPrompts: [
      'Qual decisão recente foi verdadeiramente sua — e qual ainda carrega o peso da expectativa de alguém?',
      'Se você soubesse que seria compreendido com amor, o que mudaria na sua rotina ainda este mês?',
      'Quem são as poucas pessoas com quem você se permite baixar a guarda sem sentir que perdeu liberdade?',
    ],
  },
  pertencimento_empatia: {
    id: 'pertencimento_empatia',
    title: 'A Guardiã dos Vínculos',
    subtitle: 'Mede o valor da vida pela profundidade das relações e pelo cuidado mútuo.',
    summary:
      'Ao longo da travessia, você demonstrou uma sensibilidade atenta ao impacto emocional de cada gesto. Suas escolhas mostram que conquistas isoladas têm pouco brilho se custarem a confiança ou o bem-estar de quem você ama.',
    coreStrength: 'Inteligência relacional profunda e capacidade de criar segurança afetiva onde chega.',
    blindSpot:
      'O cuidado genuíno pode deslizar para autoanulação quando você adia desejos legítimos para evitar qualquer atrito.',
    lifePerspective:
      'Você entende a existência como uma rede viva: somos mais inteiros quando caminhamos juntos.',
    guidingQuestion:
      'Onde você está dizendo "sim" para manter a paz externa enquanto acumula um "não" silencioso por dentro?',
    journalPrompts: [
      'Qual desejo seu foi colocado em pausa recentemente para atender à necessidade de outra pessoa?',
      'Como seria expressar um limite com a mesma ternura com que você acolhe os limites dos outros?',
      'Quais vínculos na sua vida atual são verdadeiramente recíprocos e quais vivem apenas do seu esforço?',
    ],
  },
  proposito_coragem: {
    id: 'proposito_coragem',
    title: 'O Arquiteto de Sentido',
    subtitle: 'Busca coerência ética entre o que pensa, sente e constrói no mundo.',
    summary:
      'Suas decisões apontam para uma inquietação fértil: não lhe basta que algo funcione — precisa fazer sentido. Você enfrenta conversas difíceis e rupturas de plano quando percebe que o caminho perdeu verdade ou justiça.',
    coreStrength: 'Firmeza ética e disposição de transformar crises em pontos de reinvenção consciente.',
    blindSpot:
      'A busca exigente por sentido elevado pode gerar dureza consigo mesmo nos dias comuns, imperfeitos ou improdutivos.',
    lifePerspective:
      'Você vê a vida como resposta ativa: cada escolha escreve que tipo de presença deixamos no mundo.',
    guidingQuestion:
      'Você tem se permitido descansar e celebrar o agora, ou só sente paz quando está "construindo" algo?',
    journalPrompts: [
      'O que continuaria valendo o seu esforço mesmo que ninguém jamais reconhecesse ou aplaudisse?',
      'Qual exigência excessiva consigo mesmo você poderia soltar hoje sem perder sua integridade?',
      'Que pequeno projeto ou causa adormecida está pedindo apenas um primeiro passo imperfeito?',
    ],
  },
  serenidade_autonomia: {
    id: 'serenidade_autonomia',
    title: 'O Navegador do Presente',
    subtitle: 'Encontra liberdade na lucidez calma e na recusa da pressa sem sentido.',
    summary:
      'Suas escolhas revelam uma sabedoria rara contra a urgência artificial: você observa antes de reagir, protege seu espaço interior e não confunde movimento frenético com evolução real.',
    coreStrength: 'Equilíbrio emocional diante do imprevisto e clareza para distinguir o essencial do ruído.',
    blindSpot:
      'O gosto pela paz e pelo distanciamento lúcido pode às vezes adiar confrontos necessários ou entregas arriscadas.',
    lifePerspective:
      'Você compreende que a qualidade da atenção é a própria matéria da vida.',
    guidingQuestion:
      'Há algum passo corajoso que você tem evitado chamando esse adiamento de "esperar o momento certo"?',
    journalPrompts: [
      'Em quais momentos do seu dia você sente que está verdadeiramente presente, sem pressa de chegar ao próximo ponto?',
      'Que ruído ou obrigação externa você aceitou por hábito, mas poderia encerrar com serenidade?',
      'O que o seu silêncio interior está tentando lhe dizer que a agenda cheia costuma abafar?',
    ],
  },
  empatia_proposito: {
    id: 'empatia_proposito',
    title: 'O Mediador Lúcido',
    subtitle: 'Une firmeza de valores com delicadeza humana para transformar ambientes.',
    summary:
      'Você recusa a falsa escolha entre ser forte e ser gentil. Ao longo da história, soube proteger princípios éticos e defender quem precisava de voz sem recorrer à brutalidade ou ao cinismo.',
    coreStrength: 'Capacidade de construir pontes justas mesmo em cenários de tensão e discordância.',
    blindSpot:
      'Carregar a responsabilidade de equilibrar todos os lados pode gerar exaustão silenciosa.',
    lifePerspective:
      'Você acredita que firmeza e compaixão são faces complementares da maturidade.',
    guidingQuestion:
      'Quem cuida do seu espaço de respiro quando você passa o dia mediando e sustentando o ambiente ao redor?',
    journalPrompts: [
      'Em que situação recente você conseguiu ser firme e gentil ao mesmo tempo — e o que tornou isso possível?',
      'Qual conflito você tem tentado suavizar quando talvez ele precise apenas de clareza direta?',
      'O que nutre sua própria energia antes que ela se transforme em cansaço emocional?',
    ],
  },
  serenidade_pertencimento: {
    id: 'serenidade_pertencimento',
    title: 'O Tecelão do Cotidiano',
    subtitle: 'Descobre grandeza nos gestos simples, na constância afetiva e no tempo vivido sem pressa.',
    summary:
      'Suas escolhas mostram uma percepção madura de que a vida não acontece apenas nos grandes eventos: ela mora nas conversas honestas, na mesa partilhada e na calma de saber quem se é.',
    coreStrength: 'Presença acolhedora que traz calma e humanidade para a rotina das pessoas próximas.',
    blindSpot:
      'O apreço pela harmonia cotidiana pode às vezes inibir mudanças mais ousadas que exigiriam ruptura temporária.',
    lifePerspective:
      'Você enxerga a felicidade não como troféu distante, mas como prática diária de cuidado e presença.',
    guidingQuestion:
      'Qual sonho pessoal merece espaço na sua rotina sem que você precise pedir desculpas por desejá-lo?',
    journalPrompts: [
      'Quais três momentos simples da última semana trouxeram a você sensação real de pertencimento?',
      'Existe alguma mudança que você deseja viver, mas teme alterar o equilíbrio familiar ou afetivo?',
      'Como você pode honrar seus vínculos atuais enquanto também abre espaço para novas versões de si?',
    ],
  },
};

export function computeJourneyAnalysis(
  profile: CharacterProfile,
  records: ChoiceRecord[]
): {
  scores: Record<ValueKey, number>;
  sortedValues: Array<{ definition: ValueDefinition; score: number }>;
  archetype: ArchetypeResult;
  localSynthesis: string;
} {
  const raw: Record<ValueKey, number> = {
    autonomia: 1,
    pertencimento: 1,
    proposito: 1,
    serenidade: 1,
    coragem: 1,
    empatia: 1,
  };

  for (const record of records) {
    for (const [k, v] of Object.entries(record.choice.weights)) {
      const key = k as ValueKey;
      raw[key] += v ?? 0;
    }
  }

  const maxPossible = Math.max(...Object.values(raw), 10);

  const scores: Record<ValueKey, number> = {
    autonomia: Math.min(98, Math.round((raw.autonomia / maxPossible) * 86 + 12)),
    pertencimento: Math.min(98, Math.round((raw.pertencimento / maxPossible) * 86 + 12)),
    proposito: Math.min(98, Math.round((raw.proposito / maxPossible) * 86 + 12)),
    serenidade: Math.min(98, Math.round((raw.serenidade / maxPossible) * 86 + 12)),
    coragem: Math.min(98, Math.round((raw.coragem / maxPossible) * 86 + 12)),
    empatia: Math.min(98, Math.round((raw.empatia / maxPossible) * 86 + 12)),
  };

  const sortedValues = VALUE_DEFINITIONS.map((definition) => ({
    definition,
    score: scores[definition.key],
  })).sort((a, b) => b.score - a.score);

  const first = sortedValues[0].definition.key;
  const second = sortedValues[1].definition.key;

  const pairKey = `${first}_${second}`;
  const reversePairKey = `${second}_${first}`;

  let archetype: ArchetypeResult =
    ARCHETYPE_CATALOG[pairKey] || ARCHETYPE_CATALOG[reversePairKey];

  if (!archetype) {
    if (first === 'autonomia' || first === 'coragem') {
      archetype =
        second === 'serenidade'
          ? ARCHETYPE_CATALOG.serenidade_autonomia
          : ARCHETYPE_CATALOG.autonomia_coragem;
    } else if (first === 'pertencimento') {
      archetype =
        second === 'serenidade'
          ? ARCHETYPE_CATALOG.serenidade_pertencimento
          : ARCHETYPE_CATALOG.pertencimento_empatia;
    } else if (first === 'proposito') {
      archetype =
        second === 'empatia'
          ? ARCHETYPE_CATALOG.empatia_proposito
          : ARCHETYPE_CATALOG.proposito_coragem;
    } else if (first === 'serenidade') {
      archetype =
        second === 'pertencimento' || second === 'empatia'
          ? ARCHETYPE_CATALOG.serenidade_pertencimento
          : ARCHETYPE_CATALOG.serenidade_autonomia;
    } else {
      archetype = ARCHETYPE_CATALOG.empatia_proposito;
    }
  }

  const top1 = sortedValues[0].definition.label;
  const top2 = sortedValues[1].definition.label;
  const lowest = sortedValues[sortedValues.length - 1].definition.label;

  const localSynthesis = `Ao conduzir ${profile.name} desde o ponto de partida de "${profile.origin.title}", você enfrentou ${profile.tension.narrativeSeed} com um padrão consistente: suas decisões deram prioridade clara a ${top1} e ${top2}.\n\nMais do que responder a dilemas fictícios, cada clique revelou aquilo que você protege quando duas coisas boas entram em conflito. Ao mesmo tempo, o menor peso dado a ${lowest} não indica ausência de valor, mas aponta uma fronteira silenciosa que merece atenção gentil na sua próxima fase.`;

  return { scores, sortedValues, archetype, localSynthesis };
}
