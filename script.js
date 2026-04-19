const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const hiScoreEl = document.getElementById("hi-score");
const coinsEl = document.getElementById("coins");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const boostEl = document.getElementById("boost");
const bossStatusEl = document.getElementById("boss-status");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const settingsBtn = document.getElementById("settings-btn");
const shopBtn = document.getElementById("shop-btn");
const pauseBtn = document.getElementById("pause-btn");
const hacksPanel = document.getElementById("hacks-panel");
const hackBtn = document.getElementById("hack-btn");
const stopTimeBtn = document.getElementById("stop-time-btn");
const shooterBtn = document.getElementById("shooter-btn");

const settingsPanel = document.getElementById("settings-panel");
const shopPanel = document.getElementById("shop-panel");
const shopCoinsEl = document.getElementById("shop-coins");
const shopItemsEl = document.getElementById("shop-items");
const shopLimitedFooterEl = document.getElementById("shop-limited-footer");
const closeShopBtn = document.getElementById("close-shop");
const difficultySelect = document.getElementById("difficulty");
const soundToggle = document.getElementById("sound-toggle");
const musicToggle = document.getElementById("music-toggle");
const themeSelect = document.getElementById("theme-select");
const brightnessRange = document.getElementById("brightness-range");
const brightnessValue = document.getElementById("brightness-value");
const languageSelect = document.getElementById("language-select");
const skinSelect = document.getElementById("skin-select");
const backgroundSelect = document.getElementById("background-select");
const pointsInput = document.getElementById("points-input");
const applyPointsBtn = document.getElementById("apply-points");
const levelInput = document.getElementById("level-input");
const applyLevelBtn = document.getElementById("apply-level");
const livesInput = document.getElementById("lives-input");
const applyLivesBtn = document.getElementById("apply-lives");
const coinsInput = document.getElementById("coins-input");
const applyCoinsBtn = document.getElementById("apply-coins");
const hackSkinSelect = document.getElementById("hack-skin-select");
const applyHackSkinBtn = document.getElementById("apply-hack-skin");
const hackBackgroundSelect = document.getElementById("hack-background-select");
const applyHackBackgroundBtn = document.getElementById("apply-hack-background");
const hackCometSelect = document.getElementById("hack-comet-select");
const applyHackCometBtn = document.getElementById("apply-hack-comet");
const saveSettingsBtn = document.getElementById("save-settings");
const closeSettingsBtn = document.getElementById("close-settings");

let running = false;
let paused = false;
let wasRunningBeforeSettings = false;
let wasRunningBeforeShop = false;
let lastHudUpdateAt = 0;
let musicTimer = null;
let musicStep = 0;
let activeMusicTrackId = null;

const SETTINGS_KEY = "cometCollectorSettings";
const HIGHSCORE_KEY = "cometCollectorHighScore";
const PROGRESS_KEY = "cometCollectorProgress";

const I18N = {
  en: {
    gameTitle: "Comet Collector",
    labelScore: "Score",
    labelHiScore: "Hi Score",
    labelCoins: "Coins",
    labelLives: "Lives",
    labelLevel: "Level",
    labelBoost: "Boost",
    labelBoss: "Boss",
    controlsHelp: "Move: Arrow keys or A / D. On mobile: drag your finger.",
    settingsBtn: "Settings",
    shopBtn: "Shop",
    restartBtn: "Restart Game",
    pause: "Pause",
    resume: "Resume",
    hacksTitle: "Hacks",
    hacksTip: "Press Z to show or hide",
    pointsChanger: "Points Changer",
    levelSetter: "Level Setter",
    lifeSetter: "Life Adder",
    coinAdder: "Coin Adder",
    skinSetter: "Skin Setter",
    backgroundSetter: "Background Setter",
    cometSetter: "Comet Variant Setter",
    shopTitle: "Space Shop",
    settingsTitle: "Game Settings",
    close: "Close",
    save: "Save",
    start: "Start",
    bgMusic: "Background Music",
    soundFx: "Sound Effects",
    theme: "Theme",
    bright: "Bright",
    dark: "Dark",
    brightness: "Brightness",
    language: "Language",
    none: "None",
    hpShort: "HP",
    boostShield: "Shield",
    boostDouble: "Double Points",
    boostSlow: "Slow Time",
    shopOwned: "Owned",
    shopExpired: "Expired",
    shopCoinPrice: "coins",
    shopLimitedDivider: "Limited-Time Items",
    shopLimitedStatus: "Limited-time event status",
    limitedGeneric: "Limited-time",
    limitedEnded: "Limited-time event ended",
    limitedDaysLeft: "Limited-time: {count} day{suffix} left",
    limitedMinsLeft: "Limited-time: {count} min left",
    limitedItemPrefix: "Limited item.",
    overlayReadyTitle: "Ready to Play?",
    overlayReadyText: "Catch shiny comets and dodge meteors. Good luck, captain!",
    overlayBossTitle: "Boss Level {level}: {name}!",
    overlayBossText: "Tap/click the boss to shoot it. Beat it to unlock this boss skin and background!",
    overlayBossFight: "Fight",
    rewardSkin: "skin",
    rewardBackground: "background",
    rewardAnd: "and",
    overlayBossWinLead: "Boss defeated! You unlocked {rewards}.",
    overlayBossWinAll: "Boss defeated! All skins and backgrounds are already unlocked.",
    overlayBossWinTail: "Keep going to reach the next boss!",
    overlayVictoryTitle: "Victory!",
    overlayContinue: "Continue",
    overlayGameOverTitle: "Game Over!",
    overlayGameOverText: "You scored {score} points. Hi score: {highScore}. Want another space run?",
    overlayPlayAgain: "Play Again",
    shopUnlockCatSkinTitle: "Cat Skin",
    shopUnlockCatSkinDesc: "Unlocks the Cat skin.",
    shopUnlockRobotSkinTitle: "Robot Skin",
    shopUnlockRobotSkinDesc: "Unlocks the Robot skin.",
    shopUnlockCatvilleBgTitle: "Catville Background",
    shopUnlockCatvilleBgDesc: "Unlocks the Catville background.",
    shopUnlockMechBgTitle: "Mech City Background",
    shopUnlockMechBgDesc: "Unlocks the Mech City background.",
    shopUnlockCrystalCometTitle: "Crystal Comets",
    shopUnlockCrystalCometDesc: "Unlocks Crystal comet variant.",
    shopUnlockRainbowCometTitle: "Rainbow Comets",
    shopUnlockRainbowCometDesc: "Unlocks Rainbow comet variant.",
    shopUnlockPlasmaCometTitle: "Plasma Comets",
    shopUnlockPlasmaCometDesc: "Unlocks Plasma comet variant.",
    shopUnlockSteakSkinTitle: "Steak Skin",
    shopUnlockSteakhouseBgTitle: "Steakhouse Sky",
    shopUnlockSteakCometTitle: "Steak Comets",
    shopSpeedUpTitle: "Ship Engine +",
    shopSpeedUpDesc: "Permanent speed boost. Max 3 levels.",
    shopDoubleTimeTitle: "Double Points 45s",
    shopDoubleTimeDesc: "Limited-time double points boost.",
    shopSlowTimeTitle: "Slow Time 30s",
    shopSlowTimeDesc: "Limited-time slow-fall effect.",
    shopExtraLifeTitle: "Extra Life",
    shopExtraLifeDesc: "Get +1 life instantly.",
  },
  es: {
    gameTitle: "Recolector de Cometas",
    labelScore: "Puntos",
    labelHiScore: "Record",
    labelCoins: "Monedas",
    labelLives: "Vidas",
    labelLevel: "Nivel",
    labelBoost: "Poder",
    labelBoss: "Jefe",
    controlsHelp: "Mover: Flechas o A / D. En movil: arrastra tu dedo.",
    settingsBtn: "Ajustes",
    shopBtn: "Tienda",
    restartBtn: "Reiniciar",
    pause: "Pausa",
    resume: "Continuar",
    hacksTitle: "Trucos",
    hacksTip: "Presiona Z para mostrar u ocultar",
    pointsChanger: "Cambiar Puntos",
    levelSetter: "Cambiar Nivel",
    lifeSetter: "Sumar Vidas",
    coinAdder: "Agregar Monedas",
    skinSetter: "Cambiar Skin",
    backgroundSetter: "Cambiar Fondo",
    cometSetter: "Cambiar Cometa",
    shopTitle: "Tienda Espacial",
    settingsTitle: "Ajustes del Juego",
    close: "Cerrar",
    save: "Guardar",
    start: "Jugar",
    bgMusic: "Musica de Fondo",
    soundFx: "Efectos de Sonido",
    theme: "Tema",
    bright: "Claro",
    dark: "Oscuro",
    brightness: "Brillo",
    language: "Idioma",
    none: "Nada",
    hpShort: "PV",
    boostShield: "Escudo",
    boostDouble: "Puntos Dobles",
    boostSlow: "Tiempo Lento",
    shopOwned: "Comprado",
    shopExpired: "Expirado",
    shopCoinPrice: "monedas",
    shopLimitedDivider: "Objetos por Tiempo Limitado",
    shopLimitedStatus: "Estado del evento limitado",
    limitedGeneric: "Tiempo limitado",
    limitedEnded: "Evento de tiempo limitado terminado",
    limitedDaysLeft: "Tiempo limitado: quedan {count} dia{suffix}",
    limitedMinsLeft: "Tiempo limitado: quedan {count} min",
    limitedItemPrefix: "Objeto limitado.",
    overlayReadyTitle: "Listo para Jugar?",
    overlayReadyText: "Atrapa cometas brillantes y esquiva meteoros. Buena suerte, capitan!",
    overlayBossTitle: "Jefe Nivel {level}: {name}!",
    overlayBossText: "Toca al jefe para dispararle. Ganale para desbloquear su skin y fondo!",
    overlayBossFight: "Pelear",
    rewardSkin: "skin",
    rewardBackground: "fondo",
    rewardAnd: "y",
    overlayBossWinLead: "Jefe derrotado! Desbloqueaste {rewards}.",
    overlayBossWinAll: "Jefe derrotado! Ya tienes todos los skins y fondos.",
    overlayBossWinTail: "Sigue jugando para llegar al siguiente jefe!",
    overlayVictoryTitle: "Victoria!",
    overlayContinue: "Continuar",
    overlayGameOverTitle: "Fin del Juego!",
    overlayGameOverText: "Hiciste {score} puntos. Record: {highScore}. Quieres otra partida espacial?",
    overlayPlayAgain: "Jugar Otra Vez",
    shopUnlockCatSkinTitle: "Skin de Gato",
    shopUnlockCatSkinDesc: "Desbloquea la skin de Gato.",
    shopUnlockRobotSkinTitle: "Skin de Robot",
    shopUnlockRobotSkinDesc: "Desbloquea la skin de Robot.",
    shopUnlockCatvilleBgTitle: "Fondo Catville",
    shopUnlockCatvilleBgDesc: "Desbloquea el fondo Catville.",
    shopUnlockMechBgTitle: "Fondo Ciudad Mech",
    shopUnlockMechBgDesc: "Desbloquea el fondo Ciudad Mech.",
    shopUnlockCrystalCometTitle: "Cometas Cristal",
    shopUnlockCrystalCometDesc: "Desbloquea la variante Cristal.",
    shopUnlockRainbowCometTitle: "Cometas Arcoiris",
    shopUnlockRainbowCometDesc: "Desbloquea la variante Arcoiris.",
    shopUnlockPlasmaCometTitle: "Cometas Plasma",
    shopUnlockPlasmaCometDesc: "Desbloquea la variante Plasma.",
    shopUnlockSteakSkinTitle: "Skin de Steak",
    shopUnlockSteakhouseBgTitle: "Fondo Steakhouse",
    shopUnlockSteakCometTitle: "Cometas Steak",
    shopSpeedUpTitle: "Motor de Nave +",
    shopSpeedUpDesc: "Mejora de velocidad permanente. Max 3 niveles.",
    shopDoubleTimeTitle: "Puntos Dobles 45s",
    shopDoubleTimeDesc: "Poder de puntos dobles por tiempo limitado.",
    shopSlowTimeTitle: "Tiempo Lento 30s",
    shopSlowTimeDesc: "Efecto de caida lenta por tiempo limitado.",
    shopExtraLifeTitle: "Vida Extra",
    shopExtraLifeDesc: "Consigue +1 vida al instante.",
  },
};

function getStrings() {
  return I18N[state.settings.language] || I18N.en;
}

function formatI18n(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

const SKINS = {
  classic: { name: "Classic", body: "#ff7a00", glass: "#ffe4c4", wing: "#ef4444" },
  neon: { name: "Neon", body: "#11d3bc", glass: "#d9fff8", wing: "#1a9f8e" },
  solar: { name: "Solar", body: "#f97316", glass: "#fff4c2", wing: "#b45309" },
  ice: { name: "Ice", body: "#60a5fa", glass: "#e0f2fe", wing: "#2563eb" },
  lava: { name: "Lava", body: "#ef4444", glass: "#fee2e2", wing: "#7f1d1d" },
  forest: { name: "Forest", body: "#22c55e", glass: "#dcfce7", wing: "#166534" },
  cat: { name: "Cat", body: "#f59e0b", glass: "#ffedd5", wing: "#9a3412" },
  robot: { name: "Robot", body: "#94a3b8", glass: "#e2e8f0", wing: "#334155" },
  dragon: { name: "Dragon", body: "#22c55e", glass: "#dcfce7", wing: "#14532d" },
  shark: { name: "Shark", body: "#38bdf8", glass: "#e0f2fe", wing: "#0c4a6e" },
  ghost: { name: "Ghost", body: "#c4b5fd", glass: "#f5f3ff", wing: "#7c3aed" },
  beetle: { name: "Beetle", body: "#84cc16", glass: "#ecfccb", wing: "#365314" },
  steak: { name: "Steak", body: "#b91c1c", glass: "#fecaca", wing: "#7f1d1d" },
};

const SKIN_ORDER = [
  "classic",
  "neon",
  "solar",
  "ice",
  "lava",
  "forest",
  "cat",
  "robot",
  "dragon",
  "shark",
  "ghost",
  "beetle",
  "steak",
];
const BACKGROUNDS = {
  deep: { name: "Deep Space", top: "#022342", mid: "#174a75", bottom: "#0f7c8f", star: "255,255,255" },
  candy: { name: "Candy Sky", top: "#5b2a86", mid: "#f06595", bottom: "#ffa94d", star: "255,250,211" },
  aurora: { name: "Aurora Glow", top: "#023047", mid: "#2a9d8f", bottom: "#8ecae6", star: "224,255,252" },
  sunset: { name: "Sunset Rush", top: "#7f1d1d", mid: "#ef4444", bottom: "#f59e0b", star: "255,239,213" },
  glacier: { name: "Glacier Night", top: "#0f172a", mid: "#1d4ed8", bottom: "#38bdf8", star: "219,244,255" },
  jungle: { name: "Jungle Glow", top: "#052e16", mid: "#166534", bottom: "#65a30d", star: "229,255,204" },
  catville: { name: "Catville", top: "#78350f", mid: "#f59e0b", bottom: "#fde68a", star: "255,245,200" },
  mech: { name: "Mech City", top: "#111827", mid: "#374151", bottom: "#9ca3af", star: "214,219,229" },
  drake: { name: "Dragon Lair", top: "#14532d", mid: "#166534", bottom: "#84cc16", star: "227,255,214" },
  reef: { name: "Shark Reef", top: "#0c4a6e", mid: "#0369a1", bottom: "#67e8f9", star: "212,246,255" },
  haunted: { name: "Haunted Sky", top: "#2e1065", mid: "#5b21b6", bottom: "#a78bfa", star: "237,233,254" },
  hive: { name: "Bug Hive", top: "#3f6212", mid: "#65a30d", bottom: "#bef264", star: "248,255,197" },
  steakhouse: { name: "Steakhouse Sky", top: "#3f0d12", mid: "#7f1d1d", bottom: "#f97316", star: "255,225,190" },
};
const BACKGROUND_ORDER = [
  "deep",
  "candy",
  "aurora",
  "sunset",
  "glacier",
  "jungle",
  "catville",
  "mech",
  "drake",
  "reef",
  "haunted",
  "hive",
  "steakhouse",
];
const COMET_VARIANTS = {
  star: { name: "Star Burst", mode: "star", fill: "#ffd447", glow: "rgba(255,255,255,0.75)" },
  crystal: { name: "Crystal", mode: "diamond", fill: "#67e8f9", glow: "rgba(217,249,255,0.9)" },
  rainbow: { name: "Rainbow", mode: "rainbow", fill: "#f472b6", glow: "rgba(255,243,138,0.9)" },
  plasma: { name: "Plasma", mode: "orb", fill: "#a78bfa", glow: "rgba(224,231,255,0.9)" },
  steak: { name: "Steak", mode: "steak", fill: "#dc2626", glow: "rgba(255,229,220,0.9)" },
};
const COMET_VARIANT_ORDER = ["star", "crystal", "rainbow", "plasma", "steak"];
const LIMITED_TIME_EVENT_END_ISO = "2026-05-31T23:59:59Z";
const LIMITED_TIME_EVENT_END_MS = Date.parse(LIMITED_TIME_EVENT_END_ISO);

const BOSS_TEMPLATES = [
  {
    id: "cat-king",
    name: "Cat King",
    body: "#f59e0b",
    eye: "#fff7ed",
    pupil: "#7c2d12",
    mouth: "#dc2626",
    shape: "cat",
    rewardSkin: "cat",
    rewardBackground: "catville",
    hpBoost: 0,
    spawnRate: 26,
  },
  {
    id: "mecha-core",
    name: "Mecha Core",
    body: "#94a3b8",
    eye: "#f8fafc",
    pupil: "#334155",
    mouth: "#ef4444",
    shape: "robot",
    rewardSkin: "robot",
    rewardBackground: "mech",
    hpBoost: 4,
    spawnRate: 23,
  },
  {
    id: "drake-boss",
    name: "Emerald Drake",
    body: "#22c55e",
    eye: "#dcfce7",
    pupil: "#14532d",
    mouth: "#ef4444",
    shape: "dragon",
    rewardSkin: "dragon",
    rewardBackground: "drake",
    hpBoost: 6,
    spawnRate: 22,
  },
  {
    id: "shark-lord",
    name: "Shark Lord",
    body: "#38bdf8",
    eye: "#e0f2fe",
    pupil: "#0c4a6e",
    mouth: "#dc2626",
    shape: "shark",
    rewardSkin: "shark",
    rewardBackground: "reef",
    hpBoost: 8,
    spawnRate: 22,
  },
  {
    id: "ghost-queen",
    name: "Ghost Queen",
    body: "#c4b5fd",
    eye: "#f5f3ff",
    pupil: "#5b21b6",
    mouth: "#7c3aed",
    shape: "ghost",
    rewardSkin: "ghost",
    rewardBackground: "haunted",
    hpBoost: 10,
    spawnRate: 21,
  },
  {
    id: "bug-emperor",
    name: "Bug Emperor",
    body: "#84cc16",
    eye: "#ecfccb",
    pupil: "#365314",
    mouth: "#b91c1c",
    shape: "beetle",
    rewardSkin: "beetle",
    rewardBackground: "hive",
    hpBoost: 12,
    spawnRate: 20,
  },
];
const HUD_UPDATE_INTERVAL_MS = 110;
const MAX_PARTICLES = 260;
const BACKGROUND_STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 97) % canvas.width,
  y: (i * 61) % canvas.height,
  size: (i % 3) + 1,
  alpha: 0.25 + (i % 5) * 0.08,
  speed: 0.014 + (i % 7) * 0.003,
}));

const hudSnapshot = {
  score: null,
  highScore: null,
  coins: null,
  lives: null,
  level: null,
  boost: null,
  boss: null,
};

const DIFFICULTY_PRESETS = {
  easy: { startLives: 4, playerSpeed: 9.2, spawnAdjust: 7, cometShift: 0.1 },
  normal: { startLives: 3, playerSpeed: 8, spawnAdjust: 0, cometShift: 0 },
  hard: { startLives: 2, playerSpeed: 7.2, spawnAdjust: -6, cometShift: -0.08 },
};

const BOOST_DETAILS = {
  shield: { labelKey: "boostShield", durationMs: 9000, color: "#56e5ff", symbol: "S" },
  double: { labelKey: "boostDouble", durationMs: 9000, color: "#8cf45d", symbol: "2x" },
  slow: { labelKey: "boostSlow", durationMs: 7000, color: "#a58bff", symbol: "~" },
};

const MUSIC_TRACKS = {
  calm: {
    wave: "triangle",
    noteMs: 260,
    notes: [
      392, 440, 523.25, 440,
      349.23, 392, 440, null,
      329.63, 392, 440, 523.25,
      392, 349.23, 329.63, null,
    ],
  },
  rush: {
    wave: "square",
    noteMs: 205,
    notes: [
      523.25, 659.25, 783.99, 659.25,
      587.33, 739.99, 880, 739.99,
      659.25, 783.99, 987.77, 783.99,
      587.33, 659.25, 739.99, null,
    ],
  },
  boss: {
    wave: "sawtooth",
    noteMs: 180,
    notes: [
      196, 196, 233.08, 196,
      174.61, 196, 233.08, 261.63,
      196, 174.61, 146.83, 174.61,
      196, 233.08, 261.63, null,
    ],
  },
};

const state = {
  score: 0,
  highScore: 0,
  coins: 0,
  lives: 3,
  level: 1,
  nextBossLevel: 100,
  spawnTick: 0,
  targetX: null,
  activeBoost: null,
  boss: null,
  bossShooterUntil: 0,
  bossLastShotAt: 0,
  settings: {
    difficulty: "normal",
    sound: true,
    music: true,
    theme: "bright",
    brightness: 100,
    language: "en",
    skin: "classic",
    background: "deep",
    cometVariant: "star",
  },
  unlockedSkins: ["classic"],
  unlockedBackgrounds: ["deep"],
  unlockedCometVariants: ["star"],
  shop: {
    speedLevel: 0,
  },
  hackUnlocked: false,
  stopBadUntil: 0,
  shooterUntil: 0,
  shooterLastShotAt: 0,
  keys: {
    left: false,
    right: false,
  },
  player: {
    x: canvas.width / 2,
    y: canvas.height - 70,
    w: 80,
    h: 40,
    speed: 8,
  },
  items: [],
  particles: [],
};

function resetGame() {
  const preset = getPreset();
  state.score = 0;
  state.lives = preset.startLives;
  state.level = 1;
  state.spawnTick = 0;
  state.items = [];
  state.particles = [];
  state.targetX = null;
  state.activeBoost = null;
  state.stopBadUntil = 0;
  state.shooterUntil = 0;
  state.bossShooterUntil = 0;
  state.bossLastShotAt = 0;
  state.shooterLastShotAt = 0;
  state.boss = null;
  state.nextBossLevel = Math.max(100, Math.ceil(state.level / 100) * 100);
  state.player.x = canvas.width / 2;
  state.player.speed = preset.playerSpeed + state.shop.speedLevel * 0.7;
  paused = false;
  setPauseButtonLabel();
  updateHud();
}

function updateHud(force = true) {
  const strings = getStrings();
  const now = performance.now();
  if (!force && now - lastHudUpdateAt < HUD_UPDATE_INTERVAL_MS) {
    return;
  }
  lastHudUpdateAt = now;

  if (hudSnapshot.score !== state.score) {
    scoreEl.textContent = state.score;
    hudSnapshot.score = state.score;
  }
  if (hudSnapshot.highScore !== state.highScore) {
    hiScoreEl.textContent = state.highScore;
    hudSnapshot.highScore = state.highScore;
  }
  if (hudSnapshot.coins !== state.coins) {
    coinsEl.textContent = state.coins;
    hudSnapshot.coins = state.coins;
  }
  if (hudSnapshot.lives !== state.lives) {
    livesEl.textContent = state.lives;
    hudSnapshot.lives = state.lives;
  }
  if (hudSnapshot.level !== state.level) {
    levelEl.textContent = state.level;
    hudSnapshot.level = state.level;
  }

  const bossText = state.boss
    ? `${strings.hpShort} ${state.boss.hp}/${state.boss.maxHp}`
    : strings.none;
  if (hudSnapshot.boss !== bossText) {
    bossStatusEl.textContent = bossText;
    hudSnapshot.boss = bossText;
  }

  let boostText = strings.none;
  if (state.activeBoost) {
    const msLeft = Math.max(0, state.activeBoost.expiresAt - now);
    const seconds = (msLeft / 1000).toFixed(1);
    const boostDetails = BOOST_DETAILS[state.activeBoost.type];
    const boostLabel = strings[boostDetails.labelKey] || boostDetails.labelKey;
    boostText = `${boostLabel} (${seconds}s)`;
  }

  if (hudSnapshot.boost !== boostText) {
    boostEl.textContent = boostText;
    hudSnapshot.boost = boostText;
  }
}

function setPauseButtonLabel() {
  const strings = getStrings();
  pauseBtn.textContent = paused ? strings.resume : strings.pause;
}

function applyVisualSettings() {
  const brightness = Math.max(65, Math.min(130, Number(state.settings.brightness) || 100));
  document.documentElement.style.setProperty("--ui-brightness", String(brightness / 100));
  document.body.classList.toggle("dark-theme", state.settings.theme === "dark");
  brightnessValue.textContent = `${brightness}%`;
}

function applyLanguageToUi() {
  const strings = getStrings();
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setText("game-title", strings.gameTitle);
  setText("label-score", strings.labelScore);
  setText("label-hi-score", strings.labelHiScore);
  setText("label-coins", strings.labelCoins);
  setText("label-lives", strings.labelLives);
  setText("label-level", strings.labelLevel);
  setText("label-boost", strings.labelBoost);
  setText("label-boss", strings.labelBoss);
  setText("controls-help", strings.controlsHelp);
  setText("settings-btn", strings.settingsBtn);
  setText("shop-btn", strings.shopBtn);
  setText("restart", strings.restartBtn);
  setText("hacks-title", strings.hacksTitle);
  setText("hacks-tip", strings.hacksTip);
  setText("label-points-input", strings.pointsChanger);
  setText("label-level-input", strings.levelSetter);
  setText("label-lives-input", strings.lifeSetter);
  setText("label-coins-input", strings.coinAdder);
  setText("label-hack-skin", strings.skinSetter);
  setText("label-hack-background", strings.backgroundSetter);
  setText("label-hack-comet", strings.cometSetter);
  setText("shop-title", strings.shopTitle);
  setText("settings-title", strings.settingsTitle);
  setText("save-settings", strings.save);
  setText("close-settings", strings.close);
  setText("close-shop", strings.close);

  const soundLabel = document.querySelector('label[for="sound-toggle"] span');
  const musicLabel = document.querySelector('label[for="music-toggle"] span');
  const themeLabel = document.querySelector('label[for="theme-select"]');
  const brightnessLabel = document.querySelector('label[for="brightness-range"]');
  const languageLabel = document.querySelector('label[for="language-select"]');
  if (soundLabel) soundLabel.textContent = strings.soundFx;
  if (musicLabel) musicLabel.textContent = strings.bgMusic;
  if (themeLabel) themeLabel.textContent = strings.theme;
  if (brightnessLabel) brightnessLabel.textContent = strings.brightness;
  if (languageLabel) languageLabel.textContent = strings.language;

  const brightOption = themeSelect.querySelector('option[value="bright"]');
  const darkOption = themeSelect.querySelector('option[value="dark"]');
  if (brightOption) brightOption.textContent = strings.bright;
  if (darkOption) darkOption.textContent = strings.dark;

  if (startBtn.textContent.trim().length === 0 || startBtn.textContent === I18N.en.start || startBtn.textContent === I18N.es.start) {
    startBtn.textContent = strings.start;
  }

  setPauseButtonLabel();
  if (!shopPanel.classList.contains("hidden")) {
    renderShop();
  }
  updateHud(true);
}

function togglePause() {
  if (overlay.classList.contains("hidden") === false) return;
  if (settingsPanel.classList.contains("hidden") === false) return;
  if (shopPanel.classList.contains("hidden") === false) return;

  paused = !paused;
  running = !paused;
  setPauseButtonLabel();
  syncMusicPlayback();
}

function loadHighScore() {
  const raw = localStorage.getItem(HIGHSCORE_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  state.highScore = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.unlockedSkins)) {
      state.unlockedSkins = parsed.unlockedSkins.filter((skinId) => SKINS[skinId]);
      if (state.unlockedSkins.length === 0) {
        state.unlockedSkins = ["classic"];
      }
    }
    if (Array.isArray(parsed.unlockedBackgrounds)) {
      state.unlockedBackgrounds = parsed.unlockedBackgrounds.filter((bgId) => BACKGROUNDS[bgId]);
      if (state.unlockedBackgrounds.length === 0) {
        state.unlockedBackgrounds = ["deep"];
      }
    }
    if (Array.isArray(parsed.unlockedCometVariants)) {
      state.unlockedCometVariants = parsed.unlockedCometVariants.filter((id) => COMET_VARIANTS[id]);
      if (state.unlockedCometVariants.length === 0) {
        state.unlockedCometVariants = ["star"];
      }
    }
    if (Number.isFinite(parsed.coins)) {
      state.coins = Math.max(0, Math.floor(parsed.coins));
    }
    if (parsed.shop && Number.isFinite(parsed.shop.speedLevel)) {
      state.shop.speedLevel = Math.max(0, Math.min(3, Math.floor(parsed.shop.speedLevel)));
    }
  } catch {
    // Keep defaults on malformed data.
  }
}

function saveProgress() {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      unlockedSkins: state.unlockedSkins,
      unlockedBackgrounds: state.unlockedBackgrounds,
      unlockedCometVariants: state.unlockedCometVariants,
      coins: state.coins,
      shop: state.shop,
    })
  );
}

function renderSkinOptions() {
  skinSelect.innerHTML = "";
  for (const skinId of state.unlockedSkins) {
    const option = document.createElement("option");
    option.value = skinId;
    option.textContent = SKINS[skinId].name;
    skinSelect.appendChild(option);
  }
}

function renderBackgroundOptions() {
  backgroundSelect.innerHTML = "";
  for (const bgId of state.unlockedBackgrounds) {
    const option = document.createElement("option");
    option.value = bgId;
    option.textContent = BACKGROUNDS[bgId].name;
    backgroundSelect.appendChild(option);
  }
}

function renderHackSkinOptions() {
  hackSkinSelect.innerHTML = "";
  for (const skinId of SKIN_ORDER) {
    const option = document.createElement("option");
    option.value = skinId;
    option.textContent = SKINS[skinId].name;
    hackSkinSelect.appendChild(option);
  }
}

function renderHackBackgroundOptions() {
  hackBackgroundSelect.innerHTML = "";
  for (const bgId of BACKGROUND_ORDER) {
    const option = document.createElement("option");
    option.value = bgId;
    option.textContent = BACKGROUNDS[bgId].name;
    hackBackgroundSelect.appendChild(option);
  }
}

function renderHackCometOptions() {
  hackCometSelect.innerHTML = "";
  for (const cometId of COMET_VARIANT_ORDER) {
    const option = document.createElement("option");
    option.value = cometId;
    option.textContent = COMET_VARIANTS[cometId].name;
    hackCometSelect.appendChild(option);
  }
}

function addCoins(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.coins += amount;
  saveProgress();
  updateHud(false);
  shopCoinsEl.textContent = state.coins;
}

function spendCoins(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return false;
  if (state.coins < amount) return false;
  state.coins -= amount;
  saveProgress();
  updateHud();
  shopCoinsEl.textContent = state.coins;
  return true;
}

function isLimitedTimeOfferActive() {
  return Number.isFinite(LIMITED_TIME_EVENT_END_MS) && Date.now() <= LIMITED_TIME_EVENT_END_MS;
}

function getLimitedTimeLabel() {
  const strings = getStrings();
  if (!Number.isFinite(LIMITED_TIME_EVENT_END_MS)) return strings.limitedGeneric;
  const remaining = LIMITED_TIME_EVENT_END_MS - Date.now();
  if (remaining <= 0) return strings.limitedEnded;

  const hours = Math.floor(remaining / 3600000);
  if (hours >= 48) {
    const days = Math.ceil(hours / 24);
    return formatI18n(strings.limitedDaysLeft, {
      count: days,
      suffix: days === 1 ? "" : "s",
    });
  }

  const mins = Math.max(1, Math.floor(remaining / 60000));
  return formatI18n(strings.limitedMinsLeft, { count: mins });
}

function getShopItems() {
  const strings = getStrings();
  const limitedTimeActive = isLimitedTimeOfferActive();
  const limitedTimeLabel = getLimitedTimeLabel();

  return [
    {
      id: "unlock-cat-skin",
      title: strings.shopUnlockCatSkinTitle,
      desc: strings.shopUnlockCatSkinDesc,
      cost: 140,
      owned: state.unlockedSkins.includes("cat"),
      buy: () => unlockSkinById("cat"),
    },
    {
      id: "unlock-robot-skin",
      title: strings.shopUnlockRobotSkinTitle,
      desc: strings.shopUnlockRobotSkinDesc,
      cost: 170,
      owned: state.unlockedSkins.includes("robot"),
      buy: () => unlockSkinById("robot"),
    },
    {
      id: "unlock-catville-bg",
      title: strings.shopUnlockCatvilleBgTitle,
      desc: strings.shopUnlockCatvilleBgDesc,
      cost: 140,
      owned: state.unlockedBackgrounds.includes("catville"),
      buy: () => unlockBackgroundById("catville"),
    },
    {
      id: "unlock-mech-bg",
      title: strings.shopUnlockMechBgTitle,
      desc: strings.shopUnlockMechBgDesc,
      cost: 170,
      owned: state.unlockedBackgrounds.includes("mech"),
      buy: () => unlockBackgroundById("mech"),
    },
    {
      id: "unlock-crystal-comet",
      title: strings.shopUnlockCrystalCometTitle,
      desc: strings.shopUnlockCrystalCometDesc,
      cost: 130,
      owned: state.unlockedCometVariants.includes("crystal"),
      buy: () => unlockCometVariantById("crystal"),
    },
    {
      id: "unlock-rainbow-comet",
      title: strings.shopUnlockRainbowCometTitle,
      desc: strings.shopUnlockRainbowCometDesc,
      cost: 160,
      owned: state.unlockedCometVariants.includes("rainbow"),
      buy: () => unlockCometVariantById("rainbow"),
    },
    {
      id: "unlock-plasma-comet",
      title: strings.shopUnlockPlasmaCometTitle,
      desc: strings.shopUnlockPlasmaCometDesc,
      cost: 190,
      owned: state.unlockedCometVariants.includes("plasma"),
      buy: () => unlockCometVariantById("plasma"),
    },
    {
      id: "unlock-steak-skin",
      title: strings.shopUnlockSteakSkinTitle,
      desc: `${strings.limitedItemPrefix} ${limitedTimeLabel}.`,
      cost: 220,
      limited: true,
      owned: state.unlockedSkins.includes("steak"),
      available: limitedTimeActive,
      buy: () => unlockSkinById("steak"),
    },
    {
      id: "unlock-steakhouse-bg",
      title: strings.shopUnlockSteakhouseBgTitle,
      desc: `${strings.limitedItemPrefix} ${limitedTimeLabel}.`,
      cost: 200,
      limited: true,
      owned: state.unlockedBackgrounds.includes("steakhouse"),
      available: limitedTimeActive,
      buy: () => unlockBackgroundById("steakhouse"),
    },
    {
      id: "unlock-steak-comet",
      title: strings.shopUnlockSteakCometTitle,
      desc: `${strings.limitedItemPrefix} ${limitedTimeLabel}.`,
      cost: 210,
      limited: true,
      owned: state.unlockedCometVariants.includes("steak"),
      available: limitedTimeActive,
      buy: () => unlockCometVariantById("steak"),
    },
    {
      id: "speed-up",
      title: strings.shopSpeedUpTitle,
      desc: strings.shopSpeedUpDesc,
      cost: 120,
      owned: state.shop.speedLevel >= 3,
      buy: () => {
        state.shop.speedLevel += 1;
        state.player.speed = getPreset().playerSpeed + state.shop.speedLevel * 0.7;
        saveProgress();
      },
    },
    {
      id: "double-time",
      title: strings.shopDoubleTimeTitle,
      desc: strings.shopDoubleTimeDesc,
      cost: 90,
      owned: false,
      buy: () => {
        const now = performance.now();
        const expiresAt = now + 45000;
        if (state.activeBoost?.type === "double") {
          state.activeBoost.expiresAt = Math.max(state.activeBoost.expiresAt, expiresAt);
        } else {
          state.activeBoost = { type: "double", expiresAt };
        }
      },
    },
    {
      id: "slow-time",
      title: strings.shopSlowTimeTitle,
      desc: strings.shopSlowTimeDesc,
      cost: 75,
      owned: false,
      buy: () => {
        const now = performance.now();
        const expiresAt = now + 30000;
        if (state.activeBoost?.type === "slow") {
          state.activeBoost.expiresAt = Math.max(state.activeBoost.expiresAt, expiresAt);
        } else {
          state.activeBoost = { type: "slow", expiresAt };
        }
      },
    },
    {
      id: "extra-life",
      title: strings.shopExtraLifeTitle,
      desc: strings.shopExtraLifeDesc,
      cost: 65,
      owned: false,
      buy: () => {
        state.lives += 1;
      },
    },
  ];
}

function renderShop() {
  const strings = getStrings();
  shopCoinsEl.textContent = state.coins;
  shopItemsEl.innerHTML = "";

  const items = getShopItems();
  const renderShopRow = (item) => {
    const row = document.createElement("div");
    row.className = "shop-item";

    const left = document.createElement("div");
    const title = document.createElement("p");
    title.className = "shop-item-title";
    title.textContent = item.title;
    const desc = document.createElement("p");
    desc.className = "shop-item-desc";
    desc.textContent = item.desc;
    left.appendChild(title);
    left.appendChild(desc);

    const action = document.createElement("button");
    const available = item.available !== false;
    if (item.owned) {
      action.textContent = strings.shopOwned;
      action.disabled = true;
    } else if (!available) {
      action.textContent = strings.shopExpired;
      action.disabled = true;
    } else {
      action.textContent = `${item.cost} ${strings.shopCoinPrice}`;
      action.disabled = state.coins < item.cost;
      action.addEventListener("click", () => {
        if (!spendCoins(item.cost)) return;
        item.buy();
        renderSkinOptions();
        renderBackgroundOptions();
        renderHackCometOptions();
        applySettingsToForm();
        updateHud();
        renderShop();
      });
    }

    row.appendChild(left);
    row.appendChild(action);
    shopItemsEl.appendChild(row);
  };

  const regularItems = items.filter((item) => !item.limited);
  const limitedItems = items.filter((item) => item.limited);

  for (const item of regularItems) {
    renderShopRow(item);
  }

  if (limitedItems.length > 0) {
    const divider = document.createElement("p");
    divider.className = "shop-limited-divider";
    divider.textContent = strings.shopLimitedDivider;
    shopItemsEl.appendChild(divider);
    for (const item of limitedItems) {
      renderShopRow(item);
    }
  }

  shopLimitedFooterEl.textContent = `${strings.shopLimitedStatus}: ${getLimitedTimeLabel()}.`;
}

function openShop() {
  wasRunningBeforeShop = running;
  running = false;
  syncMusicPlayback();
  renderShop();
  shopPanel.classList.remove("hidden");
}

function closeShop(restorePlay) {
  shopPanel.classList.add("hidden");
  if (restorePlay && wasRunningBeforeShop && overlay.classList.contains("hidden")) {
    running = true;
  }
  syncMusicPlayback();
}

function saveHighScoreIfNeeded() {
  if (state.score <= state.highScore) return;
  state.highScore = state.score;
  localStorage.setItem(HIGHSCORE_KEY, String(state.highScore));
}

function unlockHackButton() {
  if (!state.hackUnlocked) {
    state.hackUnlocked = true;
    pointsInput.value = state.score;
    levelInput.value = state.level;
    livesInput.value = state.lives;
    coinsInput.value = 100;
    renderHackSkinOptions();
    renderHackBackgroundOptions();
    renderHackCometOptions();
    hackSkinSelect.value = state.settings.skin;
    hackBackgroundSelect.value = state.settings.background;
    hackCometSelect.value = state.settings.cometVariant;
  }

  const opening = hacksPanel.classList.contains("hack-hidden");
  hacksPanel.classList.toggle("hack-hidden", !opening);
  hacksPanel.classList.toggle("hack-visible", opening);

  beep(780, 0.06, "triangle");
  setTimeout(() => beep(1040, 0.06, "triangle"), 70);
}

function activateHackMode() {
  if (!state.hackUnlocked) return;

  const filtered = [];
  let removedBad = 0;
  for (const item of state.items) {
    if (item.type === "bad") {
      removedBad += 1;
      addBurst(item.x, item.y, "#56e5ff", 10);
      continue;
    }
    filtered.push(item);
  }

  state.items = filtered;
  state.score += 50 + removedBad * 5;
  state.lives += 1;
  activateBoost("double");
  updateHud();
  beep(420, 0.09, "square");
  setTimeout(() => beep(660, 0.09, "square"), 90);
}

function stopBadCometsTime() {
  if (!state.hackUnlocked) return;
  state.stopBadUntil = performance.now() + 7000;
  addBurst(state.player.x, state.player.y - 24, "#6bc5ff", 24);
  beep(540, 0.08, "triangle");
  setTimeout(() => beep(460, 0.08, "triangle"), 90);
}

function activateBadCometShooter() {
  if (!state.hackUnlocked) return;
  state.shooterUntil = performance.now() + 9000;
  state.shooterLastShotAt = 0;
  addBurst(state.player.x, state.player.y - 24, "#8cf45d", 24);
  beep(700, 0.08, "square");
}

function autoShootBadComet(now) {
  if (now >= state.shooterUntil) return;
  if (now - state.shooterLastShotAt < 300) return;

  let targetIndex = -1;
  let bestDist = Infinity;
  for (let i = 0; i < state.items.length; i++) {
    const item = state.items[i];
    if (item.type !== "bad") continue;
    const dx = item.x - state.player.x;
    const dy = item.y - state.player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      bestDist = dist;
      targetIndex = i;
    }
  }

  if (targetIndex < 0) return;

  const target = state.items[targetIndex];
  state.items.splice(targetIndex, 1);
  state.score += 6;
  state.shooterLastShotAt = now;
  addBurst(target.x, target.y, "#8cf45d", 16);
  beep(860, 0.04, "triangle");
  updateHud();
}

function applyManualPoints() {
  const nextScore = Number.parseInt(pointsInput.value, 10);
  if (!Number.isFinite(nextScore)) return;
  state.score = Math.max(0, Math.min(999999, nextScore));
  state.level = Math.floor(state.score / 120) + 1;
  state.nextBossLevel = Math.max(100, Math.ceil(state.level / 100) * 100);
  levelInput.value = state.level;
  saveHighScoreIfNeeded();
  updateHud();
}

function applyManualLevel() {
  const nextLevel = Number.parseInt(levelInput.value, 10);
  if (!Number.isFinite(nextLevel)) return;

  state.level = Math.max(1, Math.min(9999, nextLevel));
  state.score = (state.level - 1) * 120;
  state.nextBossLevel = Math.max(100, Math.ceil(state.level / 100) * 100);
  state.boss = null;
  state.bossShooterUntil = 0;
  pointsInput.value = state.score;
  saveHighScoreIfNeeded();
  updateHud();
}

function applyManualLives() {
  const addLives = Number.parseInt(livesInput.value, 10);
  if (!Number.isFinite(addLives)) return;

  state.lives = Math.max(0, Math.min(9999, state.lives + Math.max(0, addLives)));
  updateHud();
}

function applyHackCoins() {
  const amount = Number.parseInt(coinsInput.value, 10);
  if (!Number.isFinite(amount)) return;
  addCoins(Math.max(0, amount));
}

function applyHackSkin() {
  const skinId = hackSkinSelect.value;
  if (!SKINS[skinId]) return;

  if (!state.unlockedSkins.includes(skinId)) {
    state.unlockedSkins.push(skinId);
    saveProgress();
  }

  state.settings.skin = skinId;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  renderSkinOptions();
  skinSelect.value = skinId;
}

function applyHackBackground() {
  const bgId = hackBackgroundSelect.value;
  if (!BACKGROUNDS[bgId]) return;

  if (!state.unlockedBackgrounds.includes(bgId)) {
    state.unlockedBackgrounds.push(bgId);
    saveProgress();
  }

  state.settings.background = bgId;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  renderBackgroundOptions();
  backgroundSelect.value = bgId;
}

function applyHackCometVariant() {
  const cometId = hackCometSelect.value;
  if (!COMET_VARIANTS[cometId]) return;

  if (!state.unlockedCometVariants.includes(cometId)) {
    state.unlockedCometVariants.push(cometId);
    saveProgress();
  }

  state.settings.cometVariant = cometId;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function startBossBattle() {
  const strings = getStrings();
  const stage = Math.floor(state.nextBossLevel / 100);
  const template = BOSS_TEMPLATES[(stage - 1) % BOSS_TEMPLATES.length];
  const hp = (stage === 1 ? 16 : 20 + stage * 6) + template.hpBoost;
  state.boss = {
    x: canvas.width / 2,
    y: 110,
    r: 70,
    hp,
    maxHp: hp,
    t: 0,
    spawnTick: 0,
    template,
  };
  state.bossShooterUntil = performance.now() + 120000;
  state.bossLastShotAt = 0;
  state.items = state.items.filter((item) => item.type !== "bad");
  showOverlay(
    formatI18n(strings.overlayBossTitle, { level: state.nextBossLevel, name: template.name }),
    strings.overlayBossText,
    strings.overlayBossFight
  );
  running = false;
  paused = false;
  setPauseButtonLabel();
  updateHud();
}

function unlockNextSkin() {
  for (const skinId of SKIN_ORDER) {
    if (!state.unlockedSkins.includes(skinId)) {
      state.unlockedSkins.push(skinId);
      state.settings.skin = skinId;
      saveProgress();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
      return SKINS[skinId].name;
    }
  }
  return null;
}

function unlockNextBackground() {
  for (const bgId of BACKGROUND_ORDER) {
    if (!state.unlockedBackgrounds.includes(bgId)) {
      state.unlockedBackgrounds.push(bgId);
      state.settings.background = bgId;
      saveProgress();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
      return BACKGROUNDS[bgId].name;
    }
  }
  return null;
}

function unlockSkinById(skinId) {
  if (!SKINS[skinId]) return null;
  if (state.unlockedSkins.includes(skinId)) return null;
  state.unlockedSkins.push(skinId);
  state.settings.skin = skinId;
  saveProgress();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  return SKINS[skinId].name;
}

function unlockBackgroundById(bgId) {
  if (!BACKGROUNDS[bgId]) return null;
  if (state.unlockedBackgrounds.includes(bgId)) return null;
  state.unlockedBackgrounds.push(bgId);
  state.settings.background = bgId;
  saveProgress();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  return BACKGROUNDS[bgId].name;
}

function unlockCometVariantById(cometId) {
  if (!COMET_VARIANTS[cometId]) return null;
  if (state.unlockedCometVariants.includes(cometId)) return null;
  state.unlockedCometVariants.push(cometId);
  state.settings.cometVariant = cometId;
  saveProgress();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  return COMET_VARIANTS[cometId].name;
}

function defeatBoss() {
  const strings = getStrings();
  const template = state.boss?.template;
  const unlockedSkinName = template ? unlockSkinById(template.rewardSkin) : unlockNextSkin();
  const unlockedBackgroundName = template
    ? unlockBackgroundById(template.rewardBackground)
    : unlockNextBackground();
  state.score += 250;
  addCoins(80);
  saveHighScoreIfNeeded();
  state.nextBossLevel += 100;
  state.boss = null;
  state.bossShooterUntil = 0;
  updateHud();

  const rewards = [];
  if (unlockedSkinName) rewards.push(`${unlockedSkinName} ${strings.rewardSkin}`);
  if (unlockedBackgroundName) rewards.push(`${unlockedBackgroundName} ${strings.rewardBackground}`);
  const rewardText = rewards.length > 0
    ? formatI18n(strings.overlayBossWinLead, { rewards: rewards.join(` ${strings.rewardAnd} `) })
    : strings.overlayBossWinAll;

  showOverlay(
    strings.overlayVictoryTitle,
    `${rewardText} ${strings.overlayBossWinTail}`,
    strings.overlayContinue
  );
  running = false;
}

function updateBoss(now) {
  if (!state.boss) return;
  const boss = state.boss;
  const template = boss.template || BOSS_TEMPLATES[0];
  boss.t += 0.02;
  boss.x = canvas.width / 2 + Math.sin(boss.t) * (canvas.width * 0.34);
  boss.spawnTick += 1;

  if (boss.spawnTick >= template.spawnRate) {
    boss.spawnTick = 0;
    const r = rand(22, 34);
    state.items.push({
      x: boss.x + rand(-boss.r * 0.6, boss.r * 0.6),
      y: boss.y + boss.r * 0.6,
      r,
      vy: rand(2.8, 5),
      spin: rand(-0.08, 0.08),
      angle: rand(0, Math.PI * 2),
      type: "bad",
    });
  }

  if (now > state.bossShooterUntil) {
    state.bossShooterUntil = now + 120000;
  }

  // Boss-only shooter: auto-fire so the battle always progresses.
  if (now < state.bossShooterUntil && now - state.bossLastShotAt > 260) {
    boss.hp -= 1;
    state.bossLastShotAt = now;
    addBurst(boss.x + rand(-18, 18), boss.y + rand(-18, 18), "#8cf45d", 4);
    if (boss.hp <= 0) {
      defeatBoss();
      return;
    }
    updateHud(false);
  }
}

function shootAt(x, y) {
  const now = performance.now();

  if (state.boss && now < state.bossShooterUntil) {
    const dxBoss = state.boss.x - x;
    const dyBoss = state.boss.y - y;
    if (Math.hypot(dxBoss, dyBoss) <= state.boss.r + 65) {
      state.boss.hp -= 1;
      state.bossLastShotAt = now;
      addBurst(x, y, "#ffd447", 10);
      beep(940, 0.04, "triangle");
      if (state.boss.hp <= 0) {
        defeatBoss();
      }
      updateHud();
      return true;
    }
  }

  if (now >= state.shooterUntil) return false;

  let hitIndex = -1;
  let bestDist = Infinity;
  for (let i = 0; i < state.items.length; i++) {
    const item = state.items[i];
    if (item.type !== "bad") continue;
    const dx = item.x - x;
    const dy = item.y - y;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist && dist <= item.r + 70) {
      bestDist = dist;
      hitIndex = i;
    }
  }

  if (hitIndex >= 0) {
    const hit = state.items[hitIndex];
    state.items.splice(hitIndex, 1);
    state.score += 6;
      addCoins(1);
    addBurst(hit.x, hit.y, "#6bc5ff", 14);
    beep(870, 0.05, "triangle");
    updateHud();
    return true;
  }

  beep(180, 0.03, "square");
  return false;
}

function showOverlay(title, text, buttonLabel = getStrings().start) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startBtn.textContent = buttonLabel;
  overlay.classList.remove("hidden");
  syncMusicPlayback();
}

function hideOverlay() {
  overlay.classList.add("hidden");
  syncMusicPlayback();
}

function openSettings() {
  wasRunningBeforeSettings = running;
  running = false;
  syncMusicPlayback();
  applySettingsToForm();
  settingsPanel.classList.remove("hidden");
}

function closeSettings(restorePlay) {
  settingsPanel.classList.add("hidden");
  if (restorePlay && wasRunningBeforeSettings && overlay.classList.contains("hidden")) {
    running = true;
  }
  syncMusicPlayback();
}

function saveSettings() {
  state.settings.difficulty = difficultySelect.value;
  state.settings.sound = soundToggle.checked;
  state.settings.music = musicToggle.checked;
  state.settings.theme = themeSelect.value;
  state.settings.brightness = Number.parseInt(brightnessRange.value, 10) || 100;
  state.settings.language = languageSelect.value;
  state.settings.skin = skinSelect.value;
  state.settings.background = backgroundSelect.value;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));

  state.player.speed = getPreset().playerSpeed;
  applyVisualSettings();
  applyLanguageToUi();
  syncMusicPlayback();
  closeSettings(true);
}

function applySettingsToForm() {
  difficultySelect.value = state.settings.difficulty;
  soundToggle.checked = state.settings.sound;
  musicToggle.checked = state.settings.music;
  themeSelect.value = state.settings.theme;
  brightnessRange.value = String(state.settings.brightness);
  languageSelect.value = state.settings.language;
  applyVisualSettings();
  applyLanguageToUi();
  renderSkinOptions();
  renderBackgroundOptions();
  if (!state.unlockedSkins.includes(state.settings.skin)) {
    state.settings.skin = "classic";
  }
  if (!state.unlockedBackgrounds.includes(state.settings.background)) {
    state.settings.background = "deep";
  }
  skinSelect.value = state.settings.skin;
  backgroundSelect.value = state.settings.background;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.difficulty && DIFFICULTY_PRESETS[parsed.difficulty]) {
      state.settings.difficulty = parsed.difficulty;
    }
    if (typeof parsed.sound === "boolean") {
      state.settings.sound = parsed.sound;
    }
    if (typeof parsed.music === "boolean") {
      state.settings.music = parsed.music;
    }
    if (parsed.theme === "bright" || parsed.theme === "dark") {
      state.settings.theme = parsed.theme;
    }
    if (Number.isFinite(parsed.brightness)) {
      state.settings.brightness = Math.max(65, Math.min(130, Math.floor(parsed.brightness)));
    }
    if (parsed.language && I18N[parsed.language]) {
      state.settings.language = parsed.language;
    }
    if (parsed.skin && SKINS[parsed.skin]) {
      state.settings.skin = parsed.skin;
    }
    if (parsed.background && BACKGROUNDS[parsed.background]) {
      state.settings.background = parsed.background;
    }
    if (parsed.cometVariant && COMET_VARIANTS[parsed.cometVariant]) {
      state.settings.cometVariant = parsed.cometVariant;
    }
  } catch {
    // Ignore malformed saved settings and keep defaults.
  }
}

function getPreset() {
  return DIFFICULTY_PRESETS[state.settings.difficulty] || DIFFICULTY_PRESETS.normal;
}

function createItem() {
  if (state.boss) return;

  const preset = getPreset();
  const boostChance = state.level > 1 ? 0.11 : 0.08;
  const roll = Math.random();

  if (roll < boostChance) {
    const boostTypes = Object.keys(BOOST_DETAILS);
    const boostType = boostTypes[Math.floor(rand(0, boostTypes.length))];
    const size = rand(22, 30);
    state.items.push({
      x: rand(size, canvas.width - size),
      y: -30,
      r: size,
      vy: rand(2.1, 3.4) + Math.min(3, state.level * 0.3),
      spin: rand(-0.09, 0.09),
      angle: rand(0, Math.PI * 2),
      type: "boost",
      boostType,
    });
    return;
  }

  const cometChance = Math.max(0.42, Math.min(0.86, 0.75 - state.level * 0.05 + preset.cometShift));
  const good = Math.random() < cometChance;
  const speedBoost = Math.min(4, state.level * 0.4);
  const size = good ? rand(24, 34) : rand(26, 38);

  state.items.push({
    x: rand(size, canvas.width - size),
    y: -30,
    r: size,
    vy: rand(2.4, 4.2) + speedBoost,
    spin: rand(-0.08, 0.08),
    angle: rand(0, Math.PI * 2),
    type: good ? "good" : "bad",
  });
}

function addBurst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    if (state.particles.length >= MAX_PARTICLES) {
      state.particles.shift();
    }
    state.particles.push({
      x,
      y,
      vx: rand(-3.5, 3.5),
      vy: rand(-4, -1),
      life: rand(20, 35),
      color,
      size: rand(2, 5),
    });
  }
}

function circleRectHit(cx, cy, cr, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= cr * cr;
}

function update() {
  const now = performance.now();

  saveHighScoreIfNeeded();

  if (state.activeBoost && now >= state.activeBoost.expiresAt) {
    state.activeBoost = null;
  }

  autoShootBadComet(now);
  updateBoss(now);

  if (state.keys.left) state.player.x -= state.player.speed;
  if (state.keys.right) state.player.x += state.player.speed;

  if (typeof state.targetX === "number") {
    const dx = state.targetX - state.player.x;
    state.player.x += dx * 0.18;
  }

  const half = state.player.w / 2;
  state.player.x = Math.max(half, Math.min(canvas.width - half, state.player.x));

  state.spawnTick += 1;
  const preset = getPreset();
  const spawnRate = Math.max(14, Math.min(62, 44 - state.level * 3 + preset.spawnAdjust));
  if (state.spawnTick >= spawnRate) {
    state.spawnTick = 0;
    createItem();
  }

  const fallFactor = getFallFactor();
  const isBadTimeStopped = now < state.stopBadUntil;

  for (let i = state.items.length - 1; i >= 0; i--) {
    const item = state.items[i];
    if (!(item.type === "bad" && isBadTimeStopped)) {
      item.y += item.vy * fallFactor;
    }
    item.angle += item.spin;

    if (
      circleRectHit(
        item.x,
        item.y,
        item.r,
        state.player.x - state.player.w / 2,
        state.player.y - state.player.h / 2,
        state.player.w,
        state.player.h
      )
    ) {
      if (item.type === "good") {
        state.score += getPointValue();
        addCoins(2);
        addBurst(item.x, item.y, "#ffd447", 14);
        beep(640, 0.06, "triangle");
      } else if (item.type === "bad") {
        applyDamage();
        addBurst(item.x, item.y, "#ef4444", 16);
      } else {
        activateBoost(item.boostType);
        addBurst(item.x, item.y, BOOST_DETAILS[item.boostType].color, 20);
        beep(980, 0.1, "triangle");
      }
      state.items.splice(i, 1);
      updateHud(false);
      continue;
    }

    if (item.y - item.r > canvas.height + 10) {
      if (item.type === "good") {
        applyDamage();
      }
      state.items.splice(i, 1);
    }
  }

  const nextLevel = Math.floor(state.score / 120) + 1;
  if (nextLevel !== state.level) {
    state.level = nextLevel;
    updateHud(false);
    beep(880, 0.08, "triangle");
    setTimeout(() => beep(1200, 0.08, "triangle"), 70);
  }

  if (!state.boss && state.level >= state.nextBossLevel) {
    startBossBattle();
    return;
  }

  updateHud(false);

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= 1;
    if (p.life <= 0) state.particles.splice(i, 1);
  }

  if (state.lives <= 0) {
    const strings = getStrings();
    saveHighScoreIfNeeded();
    running = false;
    paused = false;
    setPauseButtonLabel();
    syncMusicPlayback();
    showOverlay(
      strings.overlayGameOverTitle,
      formatI18n(strings.overlayGameOverText, {
        score: state.score,
        highScore: state.highScore,
      }),
      strings.overlayPlayAgain
    );
  }
}

function getPointValue() {
  return state.activeBoost?.type === "double" ? 20 : 10;
}

function getFallFactor() {
  return state.activeBoost?.type === "slow" ? 0.64 : 1;
}

function activateBoost(boostType) {
  const details = BOOST_DETAILS[boostType];
  if (!details) return;
  state.activeBoost = {
    type: boostType,
    expiresAt: performance.now() + details.durationMs,
  };
}

function applyDamage() {
  if (state.activeBoost?.type === "shield") {
    state.activeBoost = null;
    addBurst(state.player.x, state.player.y - 10, "#56e5ff", 18);
    beep(500, 0.08, "square");
    return;
  }

  state.lives -= 1;
  beep(180, 0.12, "sawtooth");
}

function drawBackground() {
  const bg = BACKGROUNDS[state.settings.background] || BACKGROUNDS.deep;
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, bg.top);
  grad.addColorStop(0.55, bg.mid);
  grad.addColorStop(1, bg.bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const now = performance.now();
  for (const star of BACKGROUND_STARS) {
    const y = (star.y + now * star.speed) % canvas.height;
    ctx.fillStyle = `rgba(${bg.star},${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer() {
  const { x, y, w, h } = state.player;
  const skin = SKINS[state.settings.skin] || SKINS.classic;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = skin.body;
  roundRect(ctx, -w / 2, -h / 2, w, h, 16);
  ctx.fill();

  ctx.fillStyle = skin.glass;
  roundRect(ctx, -w / 4, -h / 3, w / 2, h / 2, 8);
  ctx.fill();

  ctx.fillStyle = skin.wing;
  ctx.beginPath();
  ctx.moveTo(-w / 2, h / 2 - 6);
  ctx.lineTo(-w / 2 - 10, h / 2 + 8);
  ctx.lineTo(-w / 2 + 8, h / 2 + 6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w / 2, h / 2 - 6);
  ctx.lineTo(w / 2 + 10, h / 2 + 8);
  ctx.lineTo(w / 2 - 8, h / 2 + 6);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawBoss() {
  if (!state.boss) return;
  const boss = state.boss;
  const template = boss.template || BOSS_TEMPLATES[0];
  ctx.save();
  ctx.translate(boss.x, boss.y);

  ctx.fillStyle = template.body;
  ctx.beginPath();
  ctx.arc(0, 0, boss.r, 0, Math.PI * 2);
  ctx.fill();

  if (template.shape === "cat") {
    ctx.beginPath();
    ctx.moveTo(-42, -42);
    ctx.lineTo(-12, -84);
    ctx.lineTo(-2, -36);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(42, -42);
    ctx.lineTo(12, -84);
    ctx.lineTo(2, -36);
    ctx.closePath();
    ctx.fill();
  }

  if (template.shape === "robot") {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    roundRect(ctx, -46, -46, 92, 92, 16);
    ctx.fill();
    ctx.fillStyle = template.body;
  }

  ctx.fillStyle = template.eye;
  ctx.beginPath();
  ctx.arc(-22, -10, 12, 0, Math.PI * 2);
  ctx.arc(22, -10, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = template.pupil;
  ctx.beginPath();
  ctx.arc(-22, -10, 5, 0, Math.PI * 2);
  ctx.arc(22, -10, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = template.mouth;
  roundRect(ctx, -26, 22, 52, 14, 7);
  ctx.fill();

  if (template.shape === "ghost") {
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    roundRect(ctx, -52, 34, 104, 16, 8);
    ctx.fill();
  }

  ctx.restore();
}

function drawComet(item) {
  const cometVariant = COMET_VARIANTS[state.settings.cometVariant] || COMET_VARIANTS.star;

  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);

  if (cometVariant.mode === "star") {
    ctx.fillStyle = cometVariant.fill;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? item.r : item.r * 0.55;
      const a = (i / 8) * Math.PI * 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (cometVariant.mode === "diamond") {
    ctx.fillStyle = cometVariant.fill;
    ctx.beginPath();
    ctx.moveTo(0, -item.r);
    ctx.lineTo(item.r * 0.85, 0);
    ctx.lineTo(0, item.r);
    ctx.lineTo(-item.r * 0.85, 0);
    ctx.closePath();
    ctx.fill();
  } else if (cometVariant.mode === "rainbow") {
    const ring = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#3b82f6", "#a855f7"];
    for (let i = 0; i < ring.length; i++) {
      ctx.fillStyle = ring[i];
      ctx.beginPath();
      ctx.arc(0, 0, item.r - i * 3.1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (cometVariant.mode === "steak") {
    ctx.fillStyle = "#ef4444";
    roundRect(ctx, -item.r * 0.9, -item.r * 0.65, item.r * 1.8, item.r * 1.3, item.r * 0.45);
    ctx.fill();

    ctx.fillStyle = "#fee2e2";
    roundRect(ctx, -item.r * 0.4, -item.r * 0.28, item.r * 0.8, item.r * 0.56, item.r * 0.22);
    ctx.fill();

    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(item.r * 0.72, 0, item.r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const grad = ctx.createRadialGradient(-item.r * 0.25, -item.r * 0.25, item.r * 0.1, 0, 0, item.r);
    grad.addColorStop(0, "#e0e7ff");
    grad.addColorStop(0.45, cometVariant.fill);
    grad.addColorStop(1, "#4c1d95");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, item.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = cometVariant.glow;
  ctx.beginPath();
  ctx.arc(-item.r * 0.2, -item.r * 0.2, item.r * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawMeteor(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);

  ctx.fillStyle = "#3f3f46";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? item.r : item.r * 0.72;
    const a = (i / 10) * Math.PI * 2;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(0, 0, item.r * 0.24, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBoost(item) {
  const details = BOOST_DETAILS[item.boostType];

  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.angle);

  ctx.fillStyle = details.color;
  ctx.beginPath();
  ctx.moveTo(0, -item.r);
  ctx.lineTo(item.r, 0);
  ctx.lineTo(0, item.r);
  ctx.lineTo(-item.r, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#082f49";
  ctx.font = `${Math.max(14, item.r * 0.9)}px Bungee`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(details.symbol, 0, 2);

  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life / 35);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function draw() {
  drawBackground();
  drawBoss();

  for (const item of state.items) {
    if (item.type === "good") drawComet(item);
    if (item.type === "bad") drawMeteor(item);
    if (item.type === "boost") drawBoost(item);
  }

  drawParticles();
  drawPlayer();
}

function loop() {
  if (running) {
    update();
  }
  draw();
  requestAnimationFrame(loop);
}

function startGame() {
  resetGame();
  hideOverlay();
  running = true;
  paused = false;
  setPauseButtonLabel();
  syncMusicPlayback();
}

function handleKeyDown(e) {
  if (e.key.toLowerCase() === "z" && !e.repeat) unlockHackButton();
  if (e.key.toLowerCase() === "p" && !e.repeat) togglePause();
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") state.keys.left = true;
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") state.keys.right = true;
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") state.keys.left = false;
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") state.keys.right = false;
}

function handleTouch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const scale = canvas.width / rect.width;
  const gameX = x * scale;
  const gameY = ((e.touches[0].clientY - rect.top) * canvas.height) / rect.height;
  if (!shootAt(gameX, gameY)) {
    state.targetX = gameX;
  }
}

function handleResize() {
  const wrap = canvas.parentElement;
  const maxWidth = Math.min(900, wrap.clientWidth);
  canvas.style.width = `${maxWidth}px`;
}

function roundRect(context, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, duration, type) {
  if (!audioCtx || !state.settings.sound) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function playMusicNote(freq, durationMs) {
  if (!audioCtx || !state.settings.music) return;
  if (!Number.isFinite(freq) || freq <= 0) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const track = MUSIC_TRACKS[activeMusicTrackId] || MUSIC_TRACKS.calm;
  osc.type = track.wave;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  const dur = Math.max(0.06, durationMs / 1000);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.02, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function stopMusicLoop() {
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  activeMusicTrackId = null;
  musicStep = 0;
}

function getMusicTrackId() {
  if (state.boss) return "boss";
  if (state.level >= 12) return "rush";
  return "calm";
}

function tickMusicLoop() {
  if (!running || paused || !state.settings.music || audioCtx.state !== "running") {
    stopMusicLoop();
    return;
  }

  const trackId = getMusicTrackId();
  if (activeMusicTrackId !== trackId) {
    activeMusicTrackId = trackId;
    musicStep = 0;
  }

  const track = MUSIC_TRACKS[activeMusicTrackId] || MUSIC_TRACKS.calm;
  const note = track.notes[musicStep % track.notes.length];
  musicStep += 1;
  if (note) {
    playMusicNote(note, track.noteMs * 0.9);
  }

  musicTimer = setTimeout(tickMusicLoop, track.noteMs);
}

function syncMusicPlayback() {
  if (running && !paused && state.settings.music && audioCtx.state === "running") {
    if (!musicTimer) {
      tickMusicLoop();
    }
    return;
  }
  stopMusicLoop();
}

startBtn.addEventListener("click", async () => {
  if (audioCtx.state === "suspended") await audioCtx.resume();

  if (state.lives > 0 && (state.boss || state.score > 0)) {
    hideOverlay();
    running = true;
    paused = false;
    setPauseButtonLabel();
    syncMusicPlayback();
    return;
  }

  startGame();
});

restartBtn.addEventListener("click", async () => {
  if (audioCtx.state === "suspended") await audioCtx.resume();
  startGame();
});

settingsBtn.addEventListener("click", () => {
  openSettings();
});

shopBtn.addEventListener("click", () => {
  openShop();
});

pauseBtn.addEventListener("click", () => {
  togglePause();
});

hackBtn.addEventListener("click", () => {
  activateHackMode();
});

stopTimeBtn.addEventListener("click", () => {
  stopBadCometsTime();
});

shooterBtn.addEventListener("click", () => {
  activateBadCometShooter();
});

applyPointsBtn.addEventListener("click", () => {
  applyManualPoints();
});

applyLevelBtn.addEventListener("click", () => {
  applyManualLevel();
});

applyLivesBtn.addEventListener("click", () => {
  applyManualLives();
});

applyCoinsBtn.addEventListener("click", () => {
  applyHackCoins();
});

applyHackSkinBtn.addEventListener("click", () => {
  applyHackSkin();
});

applyHackBackgroundBtn.addEventListener("click", () => {
  applyHackBackground();
});

applyHackCometBtn.addEventListener("click", () => {
  applyHackCometVariant();
});

saveSettingsBtn.addEventListener("click", () => {
  saveSettings();
});

closeSettingsBtn.addEventListener("click", () => {
  closeSettings(true);
});

closeShopBtn.addEventListener("click", () => {
  closeShop(true);
});

brightnessRange.addEventListener("input", () => {
  const value = Number.parseInt(brightnessRange.value, 10) || 100;
  state.settings.brightness = value;
  applyVisualSettings();
});

themeSelect.addEventListener("change", () => {
  state.settings.theme = themeSelect.value;
  applyVisualSettings();
});

languageSelect.addEventListener("change", () => {
  state.settings.language = languageSelect.value;
  applyLanguageToUi();
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("resize", handleResize);

canvas.addEventListener("touchstart", handleTouch, { passive: true });
canvas.addEventListener("touchmove", handleTouch, { passive: true });
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  if (!shootAt(x, y)) {
    state.targetX = x;
  }
});

loadSettings();
loadProgress();
loadHighScore();
if (!COMET_VARIANTS[state.settings.cometVariant]) {
  state.settings.cometVariant = "star";
}
if (!state.unlockedCometVariants.includes(state.settings.cometVariant)) {
  state.unlockedCometVariants.push(state.settings.cometVariant);
}
applySettingsToForm();
applyVisualSettings();
applyLanguageToUi();
setPauseButtonLabel();
handleResize();
loop();
const initialStrings = getStrings();
showOverlay(initialStrings.overlayReadyTitle, initialStrings.overlayReadyText, initialStrings.start);
