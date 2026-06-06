// === Chiví Korá — i18n: Translations ===
// Todas las strings de UI en español, inglés y portugués brasileño.
// Clave → { es, en, pt }

export type Lang = 'es' | 'en' | 'pt';

export type TranslationKey = keyof typeof translations;

export const translations = {
  // ── Tutorial ──────────────────────────────────────────────────────────
  tutorial_paso1_titulo: {
    es: 'El tablero',
    en: 'The Board',
    pt: 'O tabuleiro',
  },
  tutorial_paso1_texto: {
    es: 'El Chiví Korá se juega en un grafo de 29 nodos: una grilla de 5×5 más una cueva de 4 nodos al pie del tablero. Las líneas muestran las conexiones válidas entre nodos.',
    en: 'Chiví Korá is played on a 29-node graph: a 5×5 grid plus a 4-node cave at the foot of the board. The lines show valid connections between nodes.',
    pt: 'O Chiví Korá é jogado em um grafo de 29 nós: uma grade 5×5 mais uma caverna de 4 nós ao pé do tabuleiro. As linhas mostram as conexões válidas entre os nós.',
  },
  tutorial_paso2_titulo: {
    es: 'Las piezas',
    en: 'The Pieces',
    pt: 'As peças',
  },
  tutorial_paso2_texto: {
    es: 'El Yaguareté (jaguar) empieza en la Cueva (nodo 27). Los Perros empiezan en las filas superiores. Son 15 perros contra 1 yaguareté.',
    en: 'The Jaguar starts in the Cave (node 27). The Dogs start in the upper rows. 15 dogs against 1 jaguar.',
    pt: 'A Onça-pintada começa na Caverna (nó 27). Os Cachorros começam nas fileiras superiores. São 15 cachorros contra 1 onça-pintada.',
  },
  tutorial_paso3_titulo: {
    es: 'El Yaguareté se mueve libre',
    en: 'The Jaguar Moves Freely',
    pt: 'A Onça-pintada se move livremente',
  },
  tutorial_paso3_texto: {
    es: 'El Yaguareté puede moverse en cualquier dirección: arriba, abajo, lateral o diagonal. Un paso por turno. Tiene hasta 8 movimientos posibles.',
    en: 'The Jaguar can move in any direction: up, down, sideways, or diagonal. One step per turn. Up to 8 possible moves.',
    pt: 'A Onça-pintada pode se mover em qualquer direção: para cima, para baixo, lateral ou diagonal. Um passo por turno. Até 8 movimentos possíveis.',
  },
  tutorial_paso4_titulo: {
    es: 'Los perros también se mueven libre',
    en: 'The Dogs Also Move Freely',
    pt: 'Os cachorros também se movem livremente',
  },
  tutorial_paso4_texto: {
    es: 'Acá ves un perro en el centro del tablero. Puede moverse en las 8 direcciones, igual que el Yaguareté. Los perros ya no están limitados a avanzar solamente.',
    en: 'Here you see a dog in the center of the board. It can move in all 8 directions, just like the Jaguar. Dogs are no longer limited to moving forward only.',
    pt: 'Aqui você vê um cachorro no centro do tabuleiro. Ele pode se mover nas 8 direções, assim como a Onça-pintada. Os cachorros não estão mais limitados a avançar somente.',
  },
  tutorial_paso5_titulo: {
    es: 'Cómo captura el Yaguareté',
    en: 'How the Jaguar Captures',
    pt: 'Como a Onça-pintada captura',
  },
  tutorial_paso5_texto: {
    es: 'El Yaguareté salta sobre un perro adyacente hacia un nodo vacío detrás de él. El perro capturado se retira del tablero.',
    en: 'The Jaguar jumps over an adjacent dog onto an empty node behind it. The captured dog is removed from the board.',
    pt: 'A Onça-pintada salta sobre um cachorro adjacente para um nó vazio atrás dele. O cachorro capturado é retirado do tabuleiro.',
  },
  tutorial_paso6_titulo: {
    es: 'Cómo ganan los perros',
    en: 'How the Dogs Win',
    pt: 'Como os cachorros vencem',
  },
  tutorial_paso6_texto: {
    es: 'Los perros ganan acorralando al Yaguareté. Si el Yaguareté no tiene ningún movimiento válido (ni salto), pierde. Con los perros bien posicionados, incluso con pocos se puede lograr el cerco.',
    en: 'The dogs win by cornering the Jaguar. If the Jaguar has no valid moves (not even a jump), it loses. With well-positioned dogs, even a few can achieve the trap.',
    pt: 'Os cachorros vencem encurralando a Onça-pintada. Se a Onça-pintada não tiver nenhum movimento válido (nem salto), ela perde. Com cachorros bem posicionados, mesmo com poucos é possível fazer o cerco.',
  },
  tutorial_paso7_titulo: {
    es: 'Cómo gana el Yaguareté',
    en: 'How the Jaguar Wins',
    pt: 'Como a Onça-pintada vence',
  },
  tutorial_paso7_texto: {
    es: 'El Yaguareté gana capturando perros. Cuando quedan exactamente 6 perros en el tablero, el Yaguareté se libera y gana la partida.',
    en: 'The Jaguar wins by capturing dogs. When exactly 6 dogs remain on the board, the Jaguar breaks free and wins the game.',
    pt: 'A Onça-pintada vence capturando cachorros. Quando restam exatamente 6 cachorros no tabuleiro, a Onça-pintada se liberta e vence a partida.',
  },

  // ── Botones del tutorial ──────────────────────────────────────────────
  anterior:  { es: 'Anterior',         en: 'Previous',       pt: 'Anterior' },
  siguiente: { es: 'Siguiente',         en: 'Next',           pt: 'Próximo' },
  finalizar: { es: 'Finalizar',         en: 'Finish',         pt: 'Finalizar' },
  saltar_tutorial: { es: 'Saltear tutorial', en: 'Skip tutorial', pt: 'Pular tutorial' },
  saltar:          { es: 'Saltar',          en: 'Skip',           pt: 'Pular' },
  jugar_ahora:     { es: 'Jugar ahora',     en: 'Play now',       pt: 'Jogar agora' },

  // ── Game Setup ────────────────────────────────────────────────────────
  jugas_como:    { es: 'Jugás como',    en: 'You play as',     pt: 'Você joga como' },
  dificultad:    { es: 'Dificultad',    en: 'Difficulty',      pt: 'Dificuldade' },
  facil:         { es: 'Fácil',         en: 'Easy',            pt: 'Fácil' },
  facil_desc:    { es: 'IA básica',     en: 'Basic AI',        pt: 'IA básica' },
  normal:        { es: 'Normal',        en: 'Normal',          pt: 'Normal' },
  normal_desc:   { es: 'IA media',      en: 'Medium AI',       pt: 'IA média' },
  dificil:       { es: 'Difícil',       en: 'Hard',            pt: 'Difícil' },
  dificil_desc:  { es: 'IA avanzada',   en: 'Advanced AI',     pt: 'IA avançada' },
  empezar_partida: { es: 'Empezar partida', en: 'Start game',  pt: 'Começar partida' },
  yaguarete_label: { es: 'Yaguareté',   en: 'Jaguar',          pt: 'Onça-pintada' },
  perros_label:    { es: 'Perros',      en: 'Dogs',            pt: 'Cachorros' },
  atacas:        { es: 'atacás',        en: 'attack',          pt: 'ataca' },
  defendes:      { es: 'defendés',      en: 'defend',          pt: 'defende' },
  profundidad_n: { es: 'profundidad {n}', en: 'depth {n}',     pt: 'profundidade {n}' },
  game_setup_subtitle: { es: 'El Juego del Yaguareté · Patrimonio mbya guaraní', en: 'The Jaguar Game · Mbya Guaraní Heritage', pt: 'O Jogo da Onça · Patrimônio Mbya Guarani' },

  cambiar_modo: { es: 'Cambiar modo', en: 'Change mode', pt: 'Mudar modo' },

  // ── Game Over ─────────────────────────────────────────────────────────
  gano_yaguarete:  { es: '¡Ganó el Yaguareté!',  en: 'The Jaguar Wins!',   pt: 'A Onça-pintada venceu!' },
  ganaron_perros:  { es: '¡Ganaron los Perros!',  en: 'The Dogs Win!',      pt: 'Os Cachorros venceram!' },
  jugar_de_nuevo:  { es: 'Jugar de nuevo',         en: 'Play again',         pt: 'Jogar de novo' },
  menu_principal:  { es: 'Menú principal',         en: 'Main menu',          pt: 'Menu principal' },
  gano_yaguarete_desc: {
    es: 'El Yaguareté se libera. Con solo 6 perros en el tablero, el jaguar recupera su dominio de la selva.',
    en: 'The Jaguar breaks free. With only 6 dogs on the board, the jaguar reclaims its dominion over the jungle.',
    pt: 'A Onça-pintada se liberta. Com apenas 6 cachorros no tabuleiro, a onça retoma seu domínio da selva.',
  },
  ganaron_perros_desc: {
    es: 'Los perros han acorralado al Yaguareté. Sin movimientos disponibles, el jaguar queda atrapado en la selva.',
    en: 'The dogs have cornered the Jaguar. With no available moves, the jaguar is trapped in the jungle.',
    pt: 'Os cachorros encurralaram a Onça-pintada. Sem movimentos disponíveis, a onça fica presa na selva.',
  },
  gano_yaguarete_cultural: {
    es: 'En la cosmovisión mbya guaraní, el Yaguareté representa la fuerza vital de la selva. Cuando escapa del cerco, la comunidad renueva su vínculo con la naturaleza.',
    en: 'In the Mbya Guaraní worldview, the Jaguar represents the vital force of the jungle. When it escapes the trap, the community renews its bond with nature.',
    pt: 'Na cosmovisão Mbya Guarani, a Onça-pintada representa a força vital da selva. Quando escapa do cerco, a comunidade renova seu vínculo com a natureza.',
  },
  ganaron_perros_cultural: {
    es: 'Acorralar al Yaguareté es parte del juego. Los perros, guardianes de la oscuridad según la tradición, cumplen su misión de proteger el espacio comunitario.',
    en: 'Cornering the Jaguar is part of the game. The dogs, guardians of darkness according to tradition, fulfill their mission to protect the community space.',
    pt: 'Encurralar a Onça-pintada faz parte do jogo. Os cachorros, guardiões da escuridão segundo a tradição, cumprem sua missão de proteger o espaço comunitário.',
  },

  // ── Estado del juego ──────────────────────────────────────────────────
  turno_yaguarete: { es: 'Turno del Yaguareté', en: "Jaguar's turn",  pt: 'Turno da Onça-pintada' },
  turno_perros:    { es: 'Turno de los Perros',  en: "Dogs' turn",     pt: 'Turno dos Cachorros' },
  yaguarete_acorralado: { es: '¡Yaguareté acorralado!', en: 'Jaguar cornered!', pt: 'Onça-pintada encurralada!' },

  // ── Tablero ───────────────────────────────────────────────────────────
  tablero_label: { es: 'Tablero del Chiví Korá', en: 'Chiví Korá Board', pt: 'Tabuleiro do Chiví Korá' },

  // ── Piezas (aria-labels) ──────────────────────────────────────────────
  pieza_yaguarete: { es: 'Yaguareté', en: 'Jaguar', pt: 'Onça-pintada' },
  pieza_perro:     { es: 'Perro',     en: 'Dog',    pt: 'Cachorro' },
  pieza_yaguarete_nodo: { es: 'Yaguareté en nodo {n}', en: 'Jaguar at node {n}', pt: 'Onça-pintada no nó {n}' },
  pieza_perro_nodo:     { es: 'Perro en nodo {n}',     en: 'Dog at node {n}',     pt: 'Cachorro no nó {n}' },

  // ── Historial ─────────────────────────────────────────────────────────
  historial_titulo: { es: 'Historial de movimientos', en: 'Move history',         pt: 'Histórico de movimentos' },
  turno_label:      { es: 'Turno', en: 'Turn',                                     pt: 'Turno' },
  captura:          { es: 'captura', en: 'capture',                                 pt: 'captura' },
  historial_n_moves: { es: 'Historial · {n} movimientos', en: 'History · {n} moves', pt: 'Histórico · {n} movimentos' },
  captura_en_nodo:   { es: 'Captura en nodo {n}', en: 'Capture at node {n}',         pt: 'Captura no nó {n}' },

  // ── Panel Cultural ────────────────────────────────────────────────────
  cultural_titulo: { es: 'Chiví Korá', en: 'Chiví Korá', pt: 'Chiví Korá' },
  cultural_intro: {
    es: 'El Chiví Korá es un juego de tablero tradicional de la cultura mbya guaraní, originario de la región de Misiones, en el noreste argentino, y presente también en comunidades de Paraguay.',
    en: 'Chiví Korá is a traditional board game of the Mbya Guaraní culture, originating in the Misiones region of northeastern Argentina, and also present in communities in Paraguay.',
    pt: 'O Chiví Korá é um jogo de tabuleiro tradicional da cultura Mbya Guarani, originário da região de Misiones, no nordeste argentino, e presente também em comunidades do Paraguai.',
  },
  cultural_yaguarete_titulo: { es: 'El Yaguareté', en: 'The Jaguar', pt: 'A Onça-pintada' },
  cultural_yaguarete_texto: {
    es: 'El yaguareté (Panthera onca) es el felino más grande de América. En la cosmovisión mbya, representa la fuerza vital, la soberanía territorial y la memoria de los montes. Acorralarlo significa simbólicamente alejarlo de la comunidad.',
    en: 'The jaguar (Panthera onca) is the largest feline in the Americas. In the Mbya worldview, it represents vital force, territorial sovereignty, and the memory of the hills. Cornering it symbolically means driving it away from the community.',
    pt: 'A onça-pintada (Panthera onca) é o maior felino das Américas. Na cosmovisão Mbya, ela representa a força vital, a soberania territorial e a memória das matas. Encurralá-la significa simbolicamente afastá-la da comunidade.',
  },
  cultural_perros_titulo: { es: 'Los Perros — Checupe', en: 'The Dogs — Checupe', pt: 'Os Cachorros — Checupe' },
  cultural_perros_texto: {
    es: 'Los perros del tablero son Checupe — una raza tradicional que los mayores recuerdan como compañera de caza y guardiana de la oscuridad. El juego evoca esa alianza entre el pueblo y sus perros para contener al felino más grande de América.',
    en: 'The dogs on the board are Checupe — a traditional breed remembered by elders as a hunting companion and guardian of the darkness. The game evokes that alliance between the people and their dogs to contain the largest feline in the Americas.',
    pt: 'Os cachorros do tabuleiro são Checupe — uma raça tradicional que os mais velhos lembram como companheira de caça e guardiã da escuridão. O jogo evoca essa aliança entre o povo e seus cachorros para conter o maior felino das Américas.',
  },
  cultural_significado_titulo: { es: 'El significado profundo', en: 'The Deeper Meaning', pt: 'O significado profundo' },
  cultural_significado_texto: {
    es: '"Korá" significa corral (del castellano). El juego recrea simbólicamente la relación entre la comunidad (los perros) y las fuerzas de la naturaleza (el yaguareté) — no como enemigo, sino como parte del equilibrio del mundo.',
    en: '"Korá" means corral (from Spanish). The game symbolically recreates the relationship between the community (the dogs) and the forces of nature (the jaguar) — not as an enemy, but as part of the world\'s balance.',
    pt: '"Korá" significa curral (do espanhol). O jogo recria simbolicamente a relação entre a comunidade (os cachorros) e as forças da natureza (a onça-pintada) — não como inimiga, mas como parte do equilíbrio do mundo.',
  },
  cultural_footer: {
    es: 'Este juego forma parte del patrimonio cultural inmaterial de los pueblos guaraníes. Respeto y reconocimiento para las comunidades que lo mantienen vivo.',
    en: 'This game is part of the intangible cultural heritage of the Guaraní peoples. Respect and recognition for the communities that keep it alive.',
    pt: 'Este jogo faz parte do patrimônio cultural imaterial dos povos Guarani. Respeito e reconhecimento às comunidades que o mantêm vivo.',
  },
  sobre_el_juego: { es: 'Sobre el juego', en: 'About the game', pt: 'Sobre o jogo' },

  // ── UI General ────────────────────────────────────────────────────────
  ia_pensando:       { es: 'La IA está pensando...',  en: 'AI is thinking...',     pt: 'A IA está pensando...' },
  activar_sonidos:   { es: 'Activar sonidos',         en: 'Enable sounds',         pt: 'Ativar sons' },
  silenciar:         { es: 'Silenciar',               en: 'Mute',                  pt: 'Silenciar' },
  nueva_partida:     { es: 'Nueva partida',           en: 'New game',              pt: 'Nova partida' },
  perros_restantes:  { es: '🐕 Perros: {n}/15',       en: '🐕 Dogs: {n}/15',        pt: '🐕 Cachorros: {n}/15' },
  yaguarete_capturado: { es: '🐆 Yaguareté: capturado', en: '🐆 Jaguar: captured', pt: '🐆 Onça-pintada: capturada' },
  umbral_alcanzado:  { es: 'Umbral de 6 perros alcanzado', en: '6-dog threshold reached', pt: 'Limite de 6 cachorros atingido' },
  cueva:             { es: 'Cueva',                   en: 'Cave',                  pt: 'Caverna' },
} as const;
