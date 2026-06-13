// ============================================================
//  SUPER ABEL WORLD  —  Complete Game Engine
//  3 Epische Levels, Extreem Moeilijk
// ============================================================

const TILE = 32;       // pixels per tile
const GRAVITY = 0.55;
const MAX_FALL = 14;
const WALK_SPEED = 3.2;
const RUN_SPEED = 5.5;
const JUMP_FORCE = -13.5;
const RUN_JUMP = -15.2;
const COYOTE_TIME = 8;
const JUMP_BUFFER = 8;

// ── Kleuren palet ──
const CLR = {
  sky1:    '#5c94fc', sky2:  '#3b6fd4',
  sky3:    '#1a0a3e', sky4:  '#0d0620',   // nacht level
  sky5:    '#ff6030', sky6:  '#ff2000',   // vulkaan level
  ground:  '#c84c0c', brick: '#d07030',
  stone:   '#888888', metal: '#aaaacc',
  lava:    '#ff4400', lavag: '#ff7700',
  pipe:    '#00a800', pipe2: '#007700',
  coin:    '#ffd700', coin2: '#ffaa00',
  mushroom:'#ff3333',shrub: '#228822',
  cloud:   '#ffffffcc',
  enemy1:  '#c84040', enemy2:'#803010',
  goomba:  '#c07030', goomba2:'#804020',
  koopa:   '#308030', koopa2: '#206020',
  spike:   '#555',
  flag:    '#cc0000', flagpole:'#888',
  star:    '#ffff00', starshine:'#ffffc0',
  wood:    '#8B5E3C', wood2: '#6B3E1C',
  snow:    '#e8f4ff', snowline:'#cce0ff',
  ice:     '#aaddff',
};

// ============================================================
//  LEVEL DEFINITIE HELPERS
// ============================================================
// T = tile afkortingen voor de level map
const T = {
  _: 0,   // lucht
  G: 1,   // ground solide
  B: 2,   // brick
  S: 3,   // steen blok
  C: 4,   // coin blok (? blok met munt)
  M: 5,   // mushroom blok
  P: 6,   // pipe boven
  Q: 7,   // pipe midden
  L: 8,   // lava
  X: 9,   // spikes
  I: 10,  // ijs
  W: 11,  // wood/plank
  N: 12,  // metaal blok
  Y: 13,  // coin (vrij zwevend)
  F: 14,  // finish vlag
  A: 15,  // hidden coin blok
  K: 16,  // baksteen met power-up
};

// ============================================================
//  LEVEL 1: GROENE VLAKTES  (180 kolommen breed, 20 rijen hoog)
//  Thema: klassiek groen, flink wat gaten, enemies, pipes
// ============================================================
function buildLevel1() {
  // Legenda: rijen 0-19, kolommen 0-179
  // Wij definiëren de vloer + objecten via lijst van "plaatsingen"
  const W = 200, H = 20;
  const map = Array.from({length:H}, ()=> new Array(W).fill(0));

  // Hulpfunctie: zet rij r, kolommen c1..c2 op tile t
  const row = (r,c1,c2,t)=>{ for(let c=c1;c<=c2;c++) map[r][c]=t; };
  const set = (r,c,t)=>{ if(r>=0&&r<H&&c>=0&&c<W) map[r][c]=t; };

  // ── Grond ──
  // Sector 1: normaal grond
  row(19,0,24, T.G); row(18,0,24,T.G);
  // gat 25-27
  row(19,28,48,T.G); row(18,28,48,T.G);
  // gat 49-51
  row(19,52,74,T.G); row(18,52,74,T.G);
  // gat 75-79 (breed!)
  row(19,80,99,T.G); row(18,80,99,T.G);
  // gat 100-103
  row(19,104,119,T.G); row(18,104,119,T.G);
  // gat 120-124
  row(19,125,139,T.G); row(18,125,139,T.G);
  // gat 140-143
  row(19,144,159,T.G); row(18,144,159,T.G);
  // gat 160-162
  row(19,163,179,T.G); row(18,163,179,T.G);
  // finish area
  row(19,180,199,T.G); row(18,180,199,T.G);

  // ── Platforms ──
  // springtrap platforms boven gaten
  row(15,26,27,T.B);
  row(15,50,51,T.B);
  row(14,76,78,T.B); row(13,77,77,T.B);
  row(15,101,103,T.B);
  row(15,121,124,T.B);
  row(14,141,142,T.B);
  row(15,160,162,T.B);

  // Zwevende platforms tussendoor
  row(14,8,12,T.B);   set(14,10,T.C);  set(14,11,T.C);
  row(12,15,18,T.S);  set(12,16,T.M);
  row(13,30,35,T.B);  set(13,32,T.C);  set(13,33,T.Y);
  row(11,40,43,T.S);  set(11,41,T.C);
  row(12,55,60,T.B);  set(12,57,T.C);  set(12,58,T.C);
  row(10,65,69,T.S);  set(10,66,T.M);  set(10,68,T.C);
  row(13,82,85,T.B);  set(13,84,T.C);
  row(11,88,92,T.S);  set(11,90,T.K);
  row(12,105,108,T.B);set(12,106,T.C); set(12,107,T.C);
  row(10,112,115,T.S);set(10,113,T.M);
  row(13,127,131,T.B);set(13,129,T.C);
  row(11,133,137,T.S);set(11,135,T.K);
  row(14,145,148,T.B);set(14,146,T.C);
  row(12,150,154,T.S);set(12,152,T.M); set(12,153,T.C);
  row(13,165,168,T.B);set(13,166,T.C);
  row(11,170,174,T.S);set(11,172,T.K);
  row(14,183,187,T.B);set(14,185,T.C); set(14,186,T.C);
  row(12,191,195,T.S);set(12,193,T.M);

  // Pipes
  set(17,22,T.P); set(18,22,T.Q);  // pipe 1
  set(17,60,T.P); set(18,60,T.Q);  // pipe 2
  set(17,99,T.P); set(18,99,T.Q); set(16,99,T.P); set(17,99,T.Q); // hoge pipe
  set(17,139,T.P); set(18,139,T.Q);
  set(15,178,T.P); set(16,178,T.Q); set(17,178,T.Q); set(18,178,T.Q); // mega pipe

  // Losse coins
  for(let c=3;c<=20;c+=3) set(16,c,T.Y);
  for(let c=29;c<=47;c+=3) set(16,c,T.Y);
  for(let c=53;c<=72;c+=4) set(16,c,T.Y);
  for(let c=81;c<=98;c+=3) set(16,c,T.Y);

  // Finish vlag
  for(let r=14;r<=18;r++) set(r,197,T.F);

  return { map, W, H,
    playerStart: {x: 2*TILE, y: 15*TILE},
    enemies: buildEnemies1(),
    theme: 'plains',
    name: 'Wereld 1-1: Groene Vlaktes',
    timeLimit: 400,
    bgLayers: buildBG1(),
  };
}

function buildEnemies1() {
  const e = [];
  const G=(x,y,t='goomba',dir=-1)=>e.push({x,y,type:t,dir,alive:true,vy:0,onGround:false,timer:0});
  // Goed verspreide vijanden
  G(7*T,15*T); G(9*T,15*T);
  G(32*T,15*T); G(34*T,15*T); G(36*T,15*T);
  G(55*T,15*T,'koopa'); G(58*T,15*T);
  G(83*T,15*T); G(85*T,15*T,'koopa'); G(87*T,15*T);
  G(106*T,15*T); G(108*T,15*T); G(110*T,15*T,'koopa');
  G(128*T,15*T,'koopa'); G(130*T,15*T); G(132*T,15*T);
  G(146*T,15*T); G(148*T,15*T,'koopa'); G(150*T,15*T);
  G(166*T,15*T); G(168*T,15*T); G(170*T,15*T,'koopa'); G(172*T,15*T);
  G(183*T,15*T,'koopa'); G(185*T,15*T); G(187*T,15*T); G(189*T,15*T,'koopa');
  // Op platforms
  G(16*T, 11*T); G(41*T,8*T); G(57*T,9*T); G(89*T,8*T); G(134*T,8*T); G(171*T,8*T);
  return e;
}

function buildBG1() {
  // Wolken en heuvels posities
  return [
    {type:'cloud',x:80,y:60,w:90,h:40},
    {type:'cloud',x:240,y:45,w:70,h:30},
    {type:'cloud',x:440,y:70,w:110,h:45},
    {type:'cloud',x:700,y:50,w:80,h:35},
    {type:'cloud',x:900,y:65,w:100,h:42},
    {type:'cloud',x:1200,y:40,w:75,h:32},
    {type:'cloud',x:1500,y:55,w:95,h:38},
    {type:'cloud',x:1800,y:45,w:88,h:36},
    {type:'cloud',x:2200,y:70,w:105,h:44},
    {type:'cloud',x:2600,y:50,w:72,h:30},
    {type:'cloud',x:3000,y:60,w:90,h:40},
    {type:'cloud',x:3400,y:45,w:78,h:33},
    {type:'hill',x:0,color:'#48a800',w:200,h:120},
    {type:'hill',x:400,color:'#3c9200',w:160,h:90},
    {type:'hill',x:900,color:'#48a800',w:220,h:130},
    {type:'hill',x:1600,color:'#3c9200',w:180,h:100},
    {type:'hill',x:2400,color:'#48a800',w:200,h:115},
    {type:'hill',x:3200,color:'#3c9200',w:170,h:95},
  ];
}

// ============================================================
//  LEVEL 2: NACHT KASTEEL (180 kolommen, 20 rijen)
//  Thema: donker, spikes overal, lava, vliegende vijanden
// ============================================================
function buildLevel2() {
  const W = 220, H = 20;
  const map = Array.from({length:H}, ()=> new Array(W).fill(0));
  const row = (r,c1,c2,t)=>{ for(let c=c1;c<=c2;c++) map[r][c]=t; };
  const set = (r,c,t)=>{ if(r>=0&&r<H&&c>=0&&c<W) map[r][c]=t; };

  // Vloer met lava gaten
  row(19,0,19,T.S);  row(18,0,19,T.S);
  // lava 20-22
  row(19,20,22,T.L); row(18,20,22,T.L);
  row(19,23,39,T.S); row(18,23,39,T.S);
  // lava 40-43
  row(19,40,43,T.L); row(18,40,43,T.L);
  row(19,44,59,T.S); row(18,44,59,T.S);
  // lava 60-64
  row(19,60,64,T.L); row(18,60,64,T.L);
  row(19,65,79,T.S); row(18,65,79,T.S);
  // lava 80-85 breed
  row(19,80,85,T.L); row(18,80,85,T.L);
  row(19,86,99,T.S); row(18,86,99,T.S);
  // lava 100-104
  row(19,100,104,T.L); row(18,100,104,T.L);
  row(19,105,119,T.S); row(18,105,119,T.S);
  // lava 120-126 heel breed
  row(19,120,126,T.L); row(18,120,126,T.L);
  row(19,127,139,T.S); row(18,127,139,T.S);
  // lava 140-144
  row(19,140,144,T.L); row(18,140,144,T.L);
  row(19,145,159,T.S); row(18,145,159,T.S);
  // lava 160-165
  row(19,160,165,T.L); row(18,160,165,T.L);
  row(19,166,179,T.S); row(18,166,179,T.S);
  // lava 180-185
  row(19,180,185,T.L); row(18,180,185,T.L);
  row(19,186,219,T.S); row(18,186,219,T.S);

  // Plafond spikes
  for(let c=10;c<210;c+=4) set(0,c,T.X);
  for(let c=12;c<210;c+=4) set(1,c,T.S);

  // Platforms over lava
  // Lava 1 (20-22)
  row(16,20,22,T.N); set(15,21,T.C);
  // Lava 2 (40-43)
  row(16,40,41,T.N); row(16,42,43,T.N); // twee losse
  set(14,41,T.Y);
  // Lava 3 (60-64)
  row(16,60,61,T.N); set(16,63,T.N); set(16,64,T.N);
  set(14,62,T.C); set(13,62,T.Y);
  // Lava 4 (80-85)
  set(16,80,T.N); set(16,82,T.N); set(16,84,T.N); set(16,85,T.N);
  set(14,81,T.Y); set(14,83,T.Y);
  // Lava 5 (100-104)
  row(16,100,102,T.N); set(16,103,T.N);
  set(14,101,T.C); set(14,103,T.C);
  // Lava 6 (120-126) heel breed — trampolineplatforms
  set(17,121,T.N); set(16,122,T.N); set(15,123,T.N); set(16,124,T.N);
  set(17,125,T.N); set(16,126,T.N);
  set(13,122,T.C); set(13,124,T.C);
  // Lava 7 (140-144)
  row(16,140,142,T.N); set(16,143,T.N); set(16,144,T.N);
  set(14,141,T.C); set(14,143,T.Y);
  // Lava 8 (160-165)
  set(17,160,T.N); set(16,161,T.N); set(16,163,T.N);
  set(17,164,T.N); set(15,162,T.N); set(14,162,T.Y);
  // Lava 9 (180-185)
  set(17,180,T.N); set(16,181,T.N); set(16,183,T.N); set(15,184,T.N);
  set(17,185,T.N); set(14,182,T.C); set(14,184,T.C);

  // Vloer spikes (gevaarlijke zones)
  for(let c=24;c<=38;c+=3) set(17,c,T.X);
  for(let c=45;c<=58;c+=4) set(17,c,T.X);
  for(let c=66;c<=78;c+=3) set(17,c,T.X);
  for(let c=87;c<=98;c+=4) set(17,c,T.X);
  for(let c=106;c<=118;c+=3) set(17,c,T.X);
  for(let c=128;c<=138;c+=4) set(17,c,T.X);
  for(let c=146;c<=158;c+=3) set(17,c,T.X);
  for(let c=167;c<=178;c+=4) set(17,c,T.X);
  for(let c=187;c<=210;c+=3) set(17,c,T.X);

  // Zwevende munt-blokken en power-up blokken
  row(10,5,9,T.B);   set(10,7,T.C);  set(10,8,T.M);
  row(10,25,29,T.B); set(10,27,T.C); set(10,28,T.K);
  row(10,48,52,T.N); set(10,50,T.M);
  row(9,67,71,T.B);  set(9,69,T.C);  set(9,70,T.C);
  row(8,88,92,T.N);  set(8,90,T.K);  set(8,91,T.Y);
  row(9,107,111,T.B);set(9,109,T.C); set(9,110,T.M);
  row(8,130,134,T.N);set(8,132,T.K);
  row(9,148,152,T.B);set(9,150,T.C); set(9,151,T.C);
  row(8,168,172,T.N);set(8,170,T.M); set(8,171,T.K);
  row(9,188,193,T.B);set(9,190,T.C); set(9,191,T.C); set(9,192,T.M);

  // Trappen richting finish
  for(let i=0;i<6;i++) { for(let j=0;j<=i;j++) set(18-j, 213+i, T.S); }
  for(let r=14;r<=18;r++) set(r,218,T.F);

  return { map, W, H,
    playerStart: {x: 2*TILE, y: 15*TILE},
    enemies: buildEnemies2(),
    theme: 'castle',
    name: 'Wereld 2-1: Nacht Kasteel',
    timeLimit: 500,
    bgLayers: buildBG2(),
  };
}

function buildEnemies2() {
  const e = [];
  const G=(x,y,t='goomba',dir=-1)=>e.push({x,y,type:t,dir,alive:true,vy:0,onGround:false,timer:0});
  // Kasteel vijanden + vliegers
  G(8*T,15*T,'koopa'); G(11*T,15*T);
  G(25*T,15*T); G(28*T,15*T,'koopa');
  G(46*T,15*T,'koopa'); G(48*T,15*T);
  G(67*T,15*T); G(69*T,15*T); G(71*T,15*T,'koopa');
  G(88*T,15*T,'koopa'); G(90*T,15*T); G(92*T,15*T,'koopa');
  G(107*T,15*T); G(109*T,15*T,'koopa'); G(111*T,15*T);
  G(129*T,15*T,'koopa'); G(131*T,15*T); G(133*T,15*T,'koopa');
  G(147*T,15*T); G(149*T,15*T,'koopa'); G(151*T,15*T);
  G(168*T,15*T,'koopa'); G(170*T,15*T); G(172*T,15*T,'koopa'); G(174*T,15*T);
  G(188*T,15*T); G(190*T,15*T,'koopa'); G(192*T,15*T); G(194*T,15*T,'koopa');
  // Vliegende vijanden
  G(30*T, 10*T,'fly'); G(50*T,9*T,'fly'); G(70*T,8*T,'fly'); G(90*T,9*T,'fly');
  G(110*T,8*T,'fly'); G(135*T,9*T,'fly'); G(155*T,8*T,'fly');
  G(175*T,9*T,'fly'); G(195*T,8*T,'fly'); G(205*T,9*T,'fly');
  return e;
}

function buildBG2() {
  return [
    {type:'castle_bg',x:0,y:0},
    {type:'moon',x:200,y:60,r:40},
    {type:'star_bg',count:80},
  ];
}

// ============================================================
//  LEVEL 3: VULKAAN WERELD (240 kolommen, 20 rijen)
//  Thema: lava overal, vallende platforms, mega moeilijk
// ============================================================
function buildLevel3() {
  const W = 260, H = 20;
  const map = Array.from({length:H}, ()=> new Array(W).fill(0));
  const row = (r,c1,c2,t)=>{ for(let c=c1;c<=c2;c++) map[r][c]=t; };
  const set = (r,c,t)=>{ if(r>=0&&r<H&&c>=0&&c<W) map[r][c]=t; };

  // Bodem = lava (vrijwel altijd)
  row(19,0,259,T.L); row(18,0,259,T.L); row(17,0,259,T.L);

  // Eilandjes van steen met gaten
  const islands = [
    [0,14], [16,28], [30,42], [44,52],
    [54,60], [62,70], [72,82], [84,92],
    [94,100],[102,110],[112,120],[122,128],
    [130,138],[140,146],[148,154],[156,164],
    [166,174],[176,182],[184,190],[192,198],
    [200,208],[210,216],[218,224],[226,232],
    [234,240],[242,248],[250,259],
  ];
  islands.forEach(([a,b])=>{ row(16,a,b,T.S); row(15,a,b,T.S); });

  // Spikes op lava eilanden
  islands.forEach(([a,b],i)=>{
    if(i%3===1) for(let c=a+1;c<b;c+=2) set(14,c,T.X);
  });

  // Zwevende platforms (de enige manier om gaten over te gaan)
  // Gat 1: 15
  set(13,15,T.N);
  // Gat 2: 29
  set(12,29,T.N);
  // Gat 3: 43
  set(11,43,T.N); set(12,43,T.N);
  // Gat 4: 53
  set(13,53,T.N);
  // Gat 5: 61
  set(11,61,T.N); set(10,62,T.N);
  // Gat 6: 71
  set(12,71,T.N); set(11,72,T.N);
  // Gat 7: 83
  set(13,83,T.N); set(12,83,T.N); set(11,84,T.N);
  // Gat 8: 93
  set(13,93,T.N);
  // Gat 9: 101
  set(11,101,T.N); set(12,102,T.N);
  // Gat 10: 111
  set(12,111,T.N); set(11,112,T.N); set(10,113,T.N);
  // Gat 11: 121
  set(13,121,T.N); set(12,122,T.N);
  // Gat 12: 129
  set(12,129,T.N); set(11,130,T.N);
  // Gat 13: 139
  set(11,139,T.N); set(10,140,T.N); set(9,141,T.N);
  // Gat 14: 147
  set(13,147,T.N);
  // Gat 15: 155
  set(12,155,T.N); set(11,156,T.N);
  // Gat 16: 165
  set(11,165,T.N); set(10,166,T.N); set(9,167,T.N); set(8,168,T.N);
  // Gat 17: 175
  set(12,175,T.N); set(11,176,T.N);
  // Gat 18: 183
  set(11,183,T.N); set(12,184,T.N);
  // Gat 19: 191
  set(10,191,T.N); set(9,192,T.N); set(8,193,T.N); set(7,194,T.N); set(8,195,T.N); set(9,196,T.N); set(10,197,T.N);
  // Gat 20: 209
  set(12,209,T.N); set(11,210,T.N); set(10,211,T.N);
  // Gat 21: 217
  set(11,217,T.N); set(12,218,T.N);
  // Gat 22: 225
  set(10,225,T.N); set(9,226,T.N); set(10,227,T.N);
  // Gat 23: 233
  set(12,233,T.N); set(11,234,T.N); set(10,235,T.N); set(9,236,T.N);
  // Gat 24: 241
  set(11,241,T.N); set(10,242,T.N); set(11,243,T.N);
  // Gat 25: 249
  set(12,249,T.N); set(11,250,T.N);

  // Coin blokken en power-ups, hoog in de lucht
  for(let i=0;i<20;i++) {
    const c = 10 + i*12;
    const r = 6 + (i%4);
    set(r,c,T.C);
    if(i%5===0) set(r,c+1,T.M);
    if(i%3===0) set(r,c+2,T.K);
  }

  // Losse zwevende coins
  for(let c=5;c<250;c+=5) {
    set(10,c,T.Y);
  }

  // Lava fontein aanwijzers (via tile)
  for(let c=50;c<250;c+=20) set(16,c,T.L);

  // Trappen naar de eindvlag
  for(let i=0;i<6;i++) for(let j=0;j<=i;j++) set(16-j,253+i,T.S);
  for(let r=11;r<=15;r++) set(r,258,T.F);

  return { map, W, H,
    playerStart: {x: 2*TILE, y: 11*TILE},
    enemies: buildEnemies3(),
    theme: 'volcano',
    name: 'Wereld 3-1: Vulkaan Inferno',
    timeLimit: 600,
    bgLayers: buildBG3(),
  };
}

function buildEnemies3() {
  const e = [];
  const G=(x,y,t='goomba',dir=-1)=>e.push({x,y,type:t,dir,alive:true,vy:0,onGround:false,timer:0});
  // Vijanden op eilandjes
  G(3*T,12*T,'koopa'); G(6*T,12*T);
  G(18*T,12*T); G(20*T,12*T,'koopa');
  G(32*T,12*T,'koopa'); G(35*T,12*T); G(37*T,12*T);
  G(46*T,12*T); G(48*T,12*T,'koopa');
  G(56*T,12*T,'koopa');
  G(64*T,12*T); G(66*T,12*T);
  G(74*T,12*T,'koopa'); G(76*T,12*T); G(78*T,12*T);
  G(86*T,12*T); G(88*T,12*T,'koopa'); G(90*T,12*T);
  G(96*T,12*T,'koopa');
  G(104*T,12*T); G(106*T,12*T); G(108*T,12*T,'koopa');
  G(114*T,12*T,'koopa'); G(116*T,12*T); G(118*T,12*T);
  G(124*T,12*T); G(126*T,12*T,'koopa');
  G(132*T,12*T,'koopa'); G(134*T,12*T); G(136*T,12*T);
  G(142*T,12*T); G(144*T,12*T,'koopa');
  G(150*T,12*T,'koopa'); G(152*T,12*T);
  G(158*T,12*T); G(160*T,12*T); G(162*T,12*T,'koopa');
  G(168*T,12*T,'koopa'); G(170*T,12*T); G(172*T,12*T);
  G(178*T,12*T); G(180*T,12*T,'koopa');
  G(186*T,12*T,'koopa'); G(188*T,12*T); G(190*T,12*T,'koopa');
  G(202*T,12*T); G(204*T,12*T); G(206*T,12*T,'koopa');
  G(212*T,12*T,'koopa'); G(214*T,12*T);
  G(220*T,12*T); G(222*T,12*T,'koopa'); G(224*T,12*T);
  G(228*T,12*T,'koopa'); G(230*T,12*T); G(232*T,12*T);
  G(236*T,12*T); G(238*T,12*T,'koopa'); G(240*T,12*T);
  G(244*T,12*T,'koopa'); G(246*T,12*T);
  G(252*T,12*T); G(254*T,12*T,'koopa');
  // Vliegers
  for(let i=0;i<30;i++) G((15+i*8)*T, (6+(i%5))*T, 'fly');
  return e;
}

function buildBG3() {
  return [
    {type:'volcano_bg'},
    {type:'lava_glow'},
    {type:'smoke_particle'},
  ];
}

// ============================================================
//  GAME ENGINE
// ============================================================

const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');

const LEVELS  = [buildLevel1, buildLevel2, buildLevel3];

let state     = 'start';
let level     = null;
let levelIdx  = 0;
let player    = null;
let camera    = {x:0, y:0};
let score     = 0;
let lives     = 3;
let coins     = 0;
let timeLeft  = 400;
let timeTimer = 0;
let particles = [];
let floatTexts= [];
let powerState= 0;   // 0=small, 1=super, 2=fire
let keys      = {};
let prevKeys  = {};
let mobileKeys= {left:false,right:false,jump:false,run:false};

// Canvas resize
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ── Input ──
document.addEventListener('keydown', e=>{ keys[e.code]=true; });
document.addEventListener('keyup',   e=>{ keys[e.code]=false; });

function keyPressed(code) { return keys[code] && !prevKeys[code]; }

// Mobile
['mc-left','mc-right','mc-jump','mc-run'].forEach(id=>{
  const el = document.getElementById(id);
  const map = {'mc-left':'left','mc-right':'right','mc-jump':'jump','mc-run':'run'};
  el.addEventListener('touchstart', e=>{ e.preventDefault(); mobileKeys[map[id]]=true; el.classList.add('pressed'); }, {passive:false});
  el.addEventListener('touchend',   e=>{ e.preventDefault(); mobileKeys[map[id]]=false; el.classList.remove('pressed'); }, {passive:false});
});

function isLeft()  { return keys['ArrowLeft'] ||keys['KeyA']||mobileKeys.left; }
function isRight() { return keys['ArrowRight']||keys['KeyD']||mobileKeys.right; }
function isJump()  { return keys['KeyZ']||keys['Space']||keys['ArrowUp']||keys['KeyW']||mobileKeys.jump; }
function isRun()   { return keys['ShiftLeft']||keys['ShiftRight']||keys['KeyX']||mobileKeys.run; }

// ── UI helpers ──
const hudScore   = document.getElementById('hud-score');
const hudCoins   = document.getElementById('hud-coins');
const hudWorld   = document.getElementById('hud-world');
const hudTime    = document.getElementById('hud-time');
const hudLives   = document.getElementById('hud-lives');
const msgPopup   = document.getElementById('msg-popup');

function updateHUD() {
  hudScore.textContent = String(score).padStart(6,'0');
  hudCoins.textContent = '🪙 ' + String(coins).padStart(2,'0');
  hudWorld.textContent = level ? level.name.split(':')[0].replace('Wereld ','') : '1-1';
  hudTime.textContent  = Math.ceil(timeLeft);
  hudLives.textContent = '❤️ ' + lives;
  if(timeLeft < 60) hudTime.style.color = '#ff4444';
  else              hudTime.style.color = '#fff';
}

let msgTimeout = null;
function showMsg(txt, ms=1800) {
  msgPopup.textContent = txt;
  msgPopup.classList.remove('hidden');
  if(msgTimeout) clearTimeout(msgTimeout);
  msgTimeout = setTimeout(()=> msgPopup.classList.add('hidden'), ms);
}

function showScreen(id) {
  ['screen-start','screen-pause','screen-gameover','screen-win']
    .forEach(s=> document.getElementById(s).classList.add('hidden'));
  if(id) document.getElementById(id).classList.remove('hidden');
}

// ── UI Buttons ──
document.getElementById('btn-start').onclick = ()=>{
  startLevel(levelIdx);
};
document.getElementById('btn-resume').onclick = ()=>{
  state = 'play'; showScreen(null);
};
document.getElementById('btn-quit').onclick = ()=>{
  state='start'; showScreen('screen-start');
};
document.getElementById('btn-retry').onclick = ()=>{
  startLevel(levelIdx);
};
document.getElementById('btn-go-menu').onclick = ()=>{
  state='start'; showScreen('screen-start');
};
document.getElementById('btn-next').onclick = ()=>{
  if(levelIdx < LEVELS.length-1) { levelIdx++; startLevel(levelIdx); }
  else { state='start'; showScreen('screen-start'); showMsg('🏆 Alle levels voltooid!',3000); }
};
document.getElementById('btn-win-menu').onclick = ()=>{
  state='start'; showScreen('screen-start');
};
document.querySelectorAll('.world-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.world-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    levelIdx = parseInt(btn.dataset.world);
  });
});

// ESC = pause
document.addEventListener('keydown', e=>{
  if(e.code==='Escape' && state==='play') {
    state='pause'; showScreen('screen-pause');
  } else if(e.code==='Escape' && state==='pause') {
    state='play'; showScreen(null);
  }
});

// ── Level loader ──
function startLevel(idx) {
  levelIdx  = idx;
  level     = LEVELS[idx]();
  timeLeft  = level.timeLimit;
  timeTimer = 0;
  particles = [];
  floatTexts= [];
  powerState= 0;

  player = {
    x: level.playerStart.x,
    y: level.playerStart.y,
    vx: 0, vy: 0,
    w: 26, h: 28,
    onGround: false,
    coyote: 0,
    jumpBuf: 0,
    facing: 1,
    dead: false,
    deadTimer: 0,
    invincible: 0,
    running: false,
    walkFrame: 0,
    walkTimer: 0,
    fireTimer: 0,
  };

  // Clone enemies
  level.enemies = LEVELS[idx]().enemies;

  camera.x = 0; camera.y = 0;
  state = 'play';
  showScreen(null);
  document.getElementById('hud-world').textContent = level.name.split(':')[0].replace('Wereld ','');
}

// ── Tile collision helpers ──
function getTile(c, r) {
  if(!level) return 0;
  if(r<0||r>=level.H||c<0||c>=level.W) return 0;
  return level.map[r][c];
}
function isSolid(t) { return t===T.G||t===T.B||t===T.S||t===T.N||t===T.W||t===T.P||t===T.Q||t===T.X; }
function isLethal(t){ return t===T.L || t===T.X; }
function isCoin(t)  { return t===T.Y; }
function isQuestion(t){ return t===T.C||t===T.M||t===T.K||t===T.A; }

// AABB + tile collision
function moveEntity(ent, dx, dy, map, W, H) {
  const sw = ent.w, sh = ent.h;
  // X
  ent.x += dx;
  const left  = Math.floor(ent.x / TILE);
  const right = Math.floor((ent.x+sw-1) / TILE);
  const top   = Math.floor(ent.y / TILE);
  const bot   = Math.floor((ent.y+sh-1) / TILE);
  for(let c=left;c<=right;c++) {
    for(let r=top;r<=bot;r++) {
      const t = getTile(c,r);
      if(isSolid(t)) {
        if(dx>0) ent.x = c*TILE - sw;
        if(dx<0) ent.x = (c+1)*TILE;
        ent.vx = 0;
      }
    }
  }
  // Y
  ent.onGround = false;
  ent.y += dy;
  const left2  = Math.floor(ent.x / TILE);
  const right2 = Math.floor((ent.x+sw-1) / TILE);
  const top2   = Math.floor(ent.y / TILE);
  const bot2   = Math.floor((ent.y+sh-1) / TILE);
  for(let c=left2;c<=right2;c++) {
    for(let r=top2;r<=bot2;r++) {
      const t = getTile(c,r);
      if(isSolid(t)) {
        if(dy>0) { ent.y = r*TILE - sh; ent.vy=0; ent.onGround=true; }
        if(dy<0) {
          ent.y = (r+1)*TILE;
          ent.vy = 0;
          // Blok geraakt van onder
          hitBlockBelow(c, r, ent);
        }
      }
    }
  }
}

function hitBlockBelow(c, r, ent) {
  const t = getTile(c, r);
  if(t===T.C || t===T.M || t===T.K || t===T.A) {
    spawnItemFromBlock(c, r, t);
    level.map[r][c] = T.S; // verander naar steen (leeg blok)
    spawnParticlesBurst(c*TILE+TILE/2, r*TILE, 6, '#ffd700');
  } else if(t===T.B) {
    if(powerState > 0) {
      level.map[r][c] = T._; // breek steen
      spawnParticlesBurst(c*TILE+TILE/2, r*TILE, 8, '#c84c0c');
      addScore(50);
    } else {
      // schud blok
      level.map[r][c] = T.B;
    }
  }
}

function spawnItemFromBlock(c, r, t) {
  const cx = c*TILE + TILE/2;
  const cy = r*TILE;
  if(t===T.C || t===T.A) {
    // Munt
    coins++;
    addScore(200);
    showMsg('MUNT! +200');
    spawnFloatText(cx, cy-10, '+200', '#ffd700');
  } else if(t===T.M) {
    // Mushroom power-up
    if(powerState===0) {
      powerState=1;
      showMsg('SUPER ABEL!');
      spawnFloatText(cx, cy-10, 'SUPER!', '#ff4444');
    } else {
      addScore(1000);
      spawnFloatText(cx, cy-10, '+1000', '#ff4444');
    }
    player.h = 44;
  } else if(t===T.K) {
    powerState=2;
    showMsg('VUUR BLOM! 🔥');
    spawnFloatText(cx, cy-10, 'VUUR!', '#ff8800');
  }
}

// ── Score & particles ──
function addScore(n) {
  score += n;
}

function spawnParticlesBurst(x, y, n, color) {
  for(let i=0;i<n;i++) {
    const ang = Math.random()*Math.PI*2;
    const spd = 1+Math.random()*3;
    particles.push({
      x, y,
      vx: Math.cos(ang)*spd,
      vy: Math.sin(ang)*spd - 2,
      life: 30+Math.random()*20,
      maxLife: 50,
      color,
      r: 3+Math.random()*3,
    });
  }
}

function spawnFloatText(x, y, txt, color) {
  floatTexts.push({ x, y, txt, color, life:60, vy:-1.5 });
}

// ── Enemy update ──
function updateEnemy(en) {
  if(!en.alive) return;
  const speed = en.type==='fly' ? 1.5 : en.type==='koopa' ? 1.2 : 1.0;

  if(en.type==='fly') {
    // Vliegende vijand sinusgolf beweging
    en.timer++;
    en.x += en.dir * speed;
    en.y += Math.sin(en.timer*0.05)*1.2;
    // Scherm omdraaien
    if(en.x < camera.x - TILE) en.dir = 1;
    if(en.x > camera.x + canvas.width + TILE) en.dir = -1;
    return;
  }

  en.vy += GRAVITY;
  if(en.vy > MAX_FALL) en.vy = MAX_FALL;

  // Eenvoudige movement
  en.x += en.dir * speed;

  // Tile collision voor vijanden
  const L = Math.floor(en.x/TILE);
  const R = Math.floor((en.x+TILE-2)/TILE);
  const Bot = Math.floor((en.y+TILE-1)/TILE);

  // Botsing wand
  if(en.dir<0 && isSolid(getTile(Math.floor(en.x/TILE), Math.floor((en.y+TILE/2)/TILE)))) en.dir=1;
  if(en.dir>0 && isSolid(getTile(Math.floor((en.x+TILE-1)/TILE), Math.floor((en.y+TILE/2)/TILE)))) en.dir=-1;

  // Val afgrond detectie — keer om op rand
  if(en.onGround) {
    const edgeTile = en.dir<0 ? Math.floor(en.x/TILE) : Math.floor((en.x+TILE-1)/TILE);
    if(!isSolid(getTile(edgeTile, Bot))) en.dir *= -1;
  }

  en.y += en.vy;
  en.onGround = false;
  const bot2 = Math.floor((en.y+TILE-1)/TILE);
  for(let c=L;c<=R;c++) {
    if(isSolid(getTile(c, bot2))) {
      en.y = bot2*TILE - TILE;
      en.vy = 0;
      en.onGround = true;
    }
  }

  // Lava = verwijder vijand
  if(isLethal(getTile(Math.floor((en.x+TILE/2)/TILE), Math.floor((en.y+TILE)/TILE)))) {
    en.alive = false;
  }
  // Valt buiten scherm
  if(en.y > level.H*TILE+100) en.alive=false;
}

// ── Player update ──
function updatePlayer() {
  if(player.dead) {
    player.deadTimer++;
    player.vy += GRAVITY;
    player.y += player.vy;
    if(player.deadTimer > 90) {
      lives--;
      if(lives <= 0) {
        document.getElementById('go-score').textContent = 'Score: ' + String(score).padStart(6,'0');
        state='gameover'; showScreen('screen-gameover'); return;
      } else {
        startLevel(levelIdx); return;
      }
    }
    return;
  }

  if(player.invincible > 0) player.invincible--;

  const spd  = isRun() ? RUN_SPEED : WALK_SPEED;
  const accel = 0.55, decel = 0.42;

  // Horizontale beweging
  if(isLeft())  { player.vx = Math.max(player.vx - accel, -spd); player.facing=-1; }
  else if(isRight()) { player.vx = Math.min(player.vx + accel, spd); player.facing=1; }
  else {
    if(player.vx>0) player.vx = Math.max(0, player.vx-decel);
    if(player.vx<0) player.vx = Math.min(0, player.vx+decel);
  }
  player.running = Math.abs(player.vx) > WALK_SPEED-0.2;

  // Walkanim
  player.walkTimer++;
  if(player.walkTimer > 6) { player.walkFrame=(player.walkFrame+1)%4; player.walkTimer=0; }

  // Coyote time
  if(player.onGround) player.coyote = COYOTE_TIME;
  else if(player.coyote > 0) player.coyote--;

  // Sprong buffer
  if(isJump()) player.jumpBuf = JUMP_BUFFER;
  else if(player.jumpBuf>0) player.jumpBuf--;

  if(player.jumpBuf > 0 && player.coyote > 0) {
    player.vy   = player.running ? RUN_JUMP : JUMP_FORCE;
    player.coyote = 0;
    player.jumpBuf = 0;
  }

  // Vroegtijdig loslaten voor variabele spronghoogte
  if(!isJump() && player.vy < -4) player.vy += 1.2;

  // Zwaartekracht
  player.vy += GRAVITY;
  if(player.vy > MAX_FALL) player.vy = MAX_FALL;

  moveEntity(player, player.vx, player.vy, level.map, level.W, level.H);

  // Lethal tile check
  const pc = Math.floor((player.x+player.w/2)/TILE);
  const pr = Math.floor((player.y+player.h-2)/TILE);
  if(isLethal(getTile(pc,pr)) || isLethal(getTile(pc, Math.floor((player.y+2)/TILE)))) {
    killPlayer();
    return;
  }

  // Coin collectie
  const coinTiles = [
    [Math.floor(player.x/TILE), Math.floor(player.y/TILE)],
    [Math.floor((player.x+player.w-1)/TILE), Math.floor(player.y/TILE)],
    [Math.floor((player.x+player.w/2)/TILE), Math.floor((player.y+player.h/2)/TILE)],
  ];
  coinTiles.forEach(([c,r])=>{
    if(isCoin(getTile(c,r))) {
      level.map[r][c]=T._;
      coins++; addScore(100);
      spawnFloatText(c*TILE+TILE/2, r*TILE, '+100', '#ffd700');
      spawnParticlesBurst(c*TILE+TILE/2, r*TILE, 4, '#ffd700');
    }
  });

  // Val van map
  if(player.y > level.H*TILE + 60) killPlayer();

  // Camera volgen
  camera.x = player.x - canvas.width/2 + player.w/2;
  camera.x = Math.max(0, Math.min(camera.x, level.W*TILE - canvas.width));
  camera.y = 0;

  // Finish detectie
  const fpc = Math.floor((player.x+player.w/2)/TILE);
  const fpr = Math.floor((player.y+player.h/2)/TILE);
  if(getTile(fpc,fpr)===T.F || getTile(fpc+1,fpr)===T.F) {
    winLevel();
  }
}

function killPlayer() {
  if(player.dead || player.invincible>0) return;
  if(powerState > 0) {
    powerState = Math.max(0, powerState-1);
    player.invincible = 90;
    player.h = 28;
    showMsg('AU!');
    return;
  }
  player.dead = true;
  player.vy = -10;
  player.vx = 0;
  spawnParticlesBurst(player.x+player.w/2, player.y, 10, '#ff4444');
}

function winLevel() {
  addScore(Math.ceil(timeLeft)*10);
  document.getElementById('win-score').textContent = 'Score: '+String(score).padStart(6,'0');
  document.getElementById('win-coins').textContent = 'Munten: '+coins;
  state='win'; showScreen('screen-win');
}

// ── Enemy-Player collision ──
function checkEnemyPlayerCollision() {
  if(player.dead || player.invincible>0) return;
  level.enemies.forEach(en=>{
    if(!en.alive) return;
    const pw = player.w, ph = player.h;
    const ew = en.type==='fly'?28:28, eh=en.type==='fly'?22:26;
    if(player.x+pw-4 < en.x || player.x+4 > en.x+ew) return;
    if(player.y+ph   < en.y || player.y   > en.y+eh)  return;

    // Springt op vijand?
    if(player.vy > 0 && player.y+ph < en.y+eh/2+6) {
      en.alive = false;
      player.vy = -7;
      addScore(en.type==='koopa'?300:100);
      spawnParticlesBurst(en.x+ew/2, en.y, 6, en.type==='koopa'?CLR.koopa:CLR.goomba);
      spawnFloatText(en.x+ew/2, en.y-8, en.type==='koopa'?'+300':'+100', '#fff');
    } else {
      killPlayer();
    }
  });
}

// ── Particles ──
function updateParticles() {
  particles = particles.filter(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.2;
    p.life--;
    return p.life>0;
  });
  floatTexts = floatTexts.filter(f=>{
    f.y+=f.vy; f.life--;
    return f.life>0;
  });
}

// ── Tijdlimiet ──
function updateTime() {
  timeTimer++;
  if(timeTimer >= 60) { timeTimer=0; timeLeft--; }
  if(timeLeft <= 0) {
    timeLeft=0;
    killPlayer();
  }
  if(timeLeft===100) showMsg('⏰ HAAST JE!');
}

// ── Teken het veld ──

// Sterrenachtergrond cache
let starCache = null;
function getStarCache(w,h) {
  if(starCache) return starCache;
  starCache = document.createElement('canvas');
  starCache.width=w; starCache.height=h;
  const sc = starCache.getContext('2d');
  sc.fillStyle='#000018';
  sc.fillRect(0,0,w,h);
  for(let i=0;i<120;i++){
    sc.fillStyle=`rgba(255,255,255,${0.3+Math.random()*0.7})`;
    const r=Math.random()*1.5;
    const x=Math.random()*w, y=Math.random()*h;
    sc.beginPath(); sc.arc(x,y,r,0,Math.PI*2); sc.fill();
  }
  return starCache;
}

function drawBackground() {
  const W = canvas.width, H = canvas.height;
  const theme = level ? level.theme : 'plains';

  if(theme==='plains') {
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, CLR.sky1);
    grad.addColorStop(1, CLR.sky2);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);

    // Heuvels
    if(level.bgLayers) level.bgLayers.forEach(l=>{
      if(l.type==='hill') {
        const sx = l.x - camera.x*0.3;
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.arc(sx + l.w/2, H - l.h*0.4, l.w/2, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
      }
      if(l.type==='cloud') {
        const sx = l.x - camera.x*0.15;
        drawCloud(sx, l.y, l.w, l.h);
      }
    });
  } else if(theme==='castle') {
    ctx.drawImage(getStarCache(W,H),0,0,W,H);
    // Maan
    const moonX = 200 - camera.x*0.05;
    ctx.fillStyle = '#ffffd0';
    ctx.beginPath(); ctx.arc(moonX,80,40,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e0e0b0';
    ctx.beginPath(); ctx.arc(moonX+10,72,36,0,Math.PI*2); ctx.fill();
    // Kasteel silhouet achter
    drawCastleSilhouette();
  } else if(theme==='volcano') {
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, '#1a0000');
    grad.addColorStop(0.5,'#4a0800');
    grad.addColorStop(1, '#800000');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
    // Vulkaan gloed
    for(let i=0;i<5;i++) {
      const vx = (i*300 - camera.x*0.2 + W) % (W*2) - W/2;
      drawVolcano(vx, H);
    }
    // Lava glow
    const lavaY = 16*TILE - camera.y;
    const glow = ctx.createLinearGradient(0,lavaY-40,0,lavaY+20);
    glow.addColorStop(0,'rgba(255,80,0,0)');
    glow.addColorStop(1,'rgba(255,80,0,0.3)');
    ctx.fillStyle=glow;
    ctx.fillRect(0,lavaY-40,W,60);
  }
}

function drawCloud(x,y,w,h) {
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(x+w*0.3,y+h*0.5, h*0.5, 0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+w*0.5,y+h*0.3, h*0.55, 0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+w*0.7,y+h*0.5, h*0.48, 0,Math.PI*2); ctx.fill();
  ctx.fillRect(x+w*0.2, y+h*0.4, w*0.6, h*0.5);
}

function drawCastleSilhouette() {
  ctx.fillStyle = '#0a0010';
  const base = canvas.height - 60;
  for(let i=0;i<6;i++) {
    const bx = (i*230 - camera.x*0.08 + 100)%1800 - 50;
    ctx.fillRect(bx, base-80, 120, 80);
    ctx.fillRect(bx+10, base-110, 20, 35);
    ctx.fillRect(bx+90, base-110, 20, 35);
    ctx.fillRect(bx+50, base-120, 25, 45);
  }
}

function drawVolcano(x, baseY) {
  ctx.fillStyle = '#1a0000';
  ctx.beginPath();
  ctx.moveTo(x-120,baseY);
  ctx.lineTo(x,baseY-200);
  ctx.lineTo(x+120,baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle='#ff3300';
  ctx.beginPath();
  ctx.arc(x,baseY-200,18,0,Math.PI*2);
  ctx.fill();
}

// ── Teken tiles ──
function drawTile(t, px, py) {
  const s = TILE;
  switch(t) {
    case T.G: // Ground
      ctx.fillStyle = CLR.brick;
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = CLR.ground;
      ctx.fillRect(px,py,s,s/4);
      // Grid lijntjes
      ctx.strokeStyle='rgba(0,0,0,0.2)';
      ctx.lineWidth=1;
      ctx.strokeRect(px+0.5,py+0.5,s-1,s-1);
      break;
    case T.B: // Brick
      ctx.fillStyle = '#c05820';
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = '#b04818';
      ctx.fillRect(px+2,py+2,s/2-3,s/2-3);
      ctx.fillRect(px+s/2+1,py+s/2+1,s/2-3,s/2-3);
      ctx.fillStyle = '#d06828';
      ctx.fillRect(px+s/2+1,py+2,s/2-3,s/2-3);
      ctx.fillRect(px+2,py+s/2+1,s/2-3,s/2-3);
      break;
    case T.S: // Steen
      ctx.fillStyle = '#888';
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = '#aaa';
      ctx.fillRect(px+1,py+1,s-2,s/2-2);
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.strokeRect(px+0.5,py+0.5,s-1,s-1);
      break;
    case T.N: // Metaal
      ctx.fillStyle = '#9090b0';
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = '#b0b0d0';
      ctx.fillRect(px+2,py+2,s-4,6);
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.strokeRect(px+0.5,py+0.5,s-1,s-1);
      break;
    case T.C: case T.M: case T.K: case T.A: // ? blok
      ctx.fillStyle = '#f8c800';
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = '#fce040';
      ctx.fillRect(px+2,py+2,s-4,s/2-3);
      ctx.fillStyle = '#c09000';
      ctx.fillRect(px,py+s-4,s,4);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('?', px+s/2, py+s/2);
      break;
    case T.P: // Pipe top
      ctx.fillStyle = CLR.pipe;
      ctx.fillRect(px-2,py,s+4,s);
      ctx.fillStyle = CLR.pipe2;
      ctx.fillRect(px-2,py+s-6,s+4,6);
      ctx.fillStyle = '#00c800';
      ctx.fillRect(px,py+2,6,s-8);
      break;
    case T.Q: // Pipe midden
      ctx.fillStyle = CLR.pipe;
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = '#00c800';
      ctx.fillRect(px+2,py,6,s);
      break;
    case T.L: // Lava
      const lavaPulse = Math.sin(Date.now()*0.005)*0.15+0.85;
      ctx.fillStyle = `rgba(255,${Math.floor(60*lavaPulse)},0,1)`;
      ctx.fillRect(px,py,s,s);
      ctx.fillStyle = `rgba(255,${Math.floor(120*lavaPulse)},0,0.7)`;
      ctx.fillRect(px,py,s,s/2);
      // Bubbeleffect
      if(Math.sin(Date.now()*0.01+px*0.3)>0.85) {
        ctx.fillStyle='rgba(255,200,0,0.8)';
        ctx.beginPath(); ctx.arc(px+s/3,py+s/2,4,0,Math.PI*2); ctx.fill();
      }
      break;
    case T.X: // Spikes
      ctx.fillStyle = '#555';
      const np = 3;
      for(let i=0;i<np;i++) {
        ctx.beginPath();
        ctx.moveTo(px+i*(s/np), py+s);
        ctx.lineTo(px+i*(s/np)+s/(np*2), py+2);
        ctx.lineTo(px+(i+1)*(s/np), py+s);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case T.Y: // Coin
      const spin = Math.abs(Math.sin(Date.now()*0.005 + px*0.05));
      ctx.fillStyle = CLR.coin;
      ctx.beginPath();
      ctx.ellipse(px+s/2, py+s/2, spin*9+2, 10, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = CLR.coin2;
      ctx.beginPath();
      ctx.ellipse(px+s/2, py+s/2, spin*5, 7, 0, 0, Math.PI*2);
      ctx.fill();
      break;
    case T.F: // Flag
      ctx.fillStyle = CLR.flagpole;
      ctx.fillRect(px+s/2-2, py, 4, s);
      if(py%TILE < 3) { // Enkel op de top tekenen
        ctx.fillStyle = CLR.flag;
        ctx.fillRect(px+s/2+2, py+4, 16, 12);
      }
      break;
  }
}

function drawMap() {
  const startCol = Math.floor(camera.x/TILE);
  const endCol   = Math.min(startCol + Math.ceil(canvas.width/TILE)+2, level.W);
  const startRow = Math.floor(camera.y/TILE);
  const endRow   = Math.min(startRow + Math.ceil(canvas.height/TILE)+2, level.H);

  for(let r=startRow;r<endRow;r++) {
    for(let c=startCol;c<endCol;c++) {
      const t = level.map[r][c];
      if(t===0) continue;
      const px = c*TILE - camera.x;
      const py = r*TILE - camera.y;
      drawTile(t, px, py);
    }
  }
}

// ── Teken speler ──
function drawPlayer() {
  const px = player.x - camera.x;
  const py = player.y - camera.y;
  const w  = player.w;
  const h  = player.h;
  const f  = player.facing;

  if(player.dead) {
    ctx.save();
    ctx.globalAlpha = 0.7;
  } else if(player.invincible>0 && Math.floor(player.invincible/4)%2===0) {
    ctx.save(); ctx.globalAlpha=0.4;
  }

  // Lichaam
  const bodyColor = powerState===2 ? '#ff4400' : powerState===1 ? '#e04020' : '#e04020';
  ctx.fillStyle = bodyColor;
  ctx.fillRect(px+3, py+h*0.35, w-6, h*0.65);

  // Hoofd
  ctx.fillStyle = '#f8c878';
  ctx.fillRect(px+2, py, w-4, h*0.42);

  // Pet
  ctx.fillStyle = '#e03030';
  ctx.fillRect(px, py-4, w, 10);
  ctx.fillRect(px+2, py-8, w-10, 6);

  // Ogen
  ctx.fillStyle='#fff';
  const eyeX = f>0 ? px+w-12 : px+6;
  ctx.fillRect(eyeX, py+4, 7, 6);
  ctx.fillStyle='#000';
  ctx.fillRect(eyeX+(f>0?3:0), py+5, 3, 4);

  // Snor
  ctx.fillStyle='#4a2800';
  ctx.fillRect(px+w/2-8, py+h*0.38, 16, 3);

  // Benen animatie
  ctx.fillStyle='#3050c0';
  if(player.onGround && Math.abs(player.vx)>0.2) {
    const legOff = Math.sin(player.walkFrame*1.57)*4;
    ctx.fillRect(px+3, py+h-10, (w-6)/2-1, 10+legOff);
    ctx.fillRect(px+(w-6)/2+4, py+h-10, (w-6)/2-1, 10-legOff);
  } else {
    ctx.fillRect(px+3, py+h-10, (w-6)/2-1, 10);
    ctx.fillRect(px+(w-6)/2+4, py+h-10, (w-6)/2-1, 10);
  }

  // Schoenen
  ctx.fillStyle='#a03010';
  ctx.fillRect(px+1, py+h-5, (w-2)/2+2, 6);
  ctx.fillRect(px+(w)/2-1, py+h-5, (w-2)/2+2, 6);

  // Vuur effect
  if(powerState===2) {
    ctx.fillStyle='#ff8800';
    ctx.beginPath();
    ctx.arc(px+w/2, py+h*0.6, 6+Math.sin(Date.now()*0.01)*2, 0, Math.PI*2);
    ctx.fill();
  }

  if(player.dead || player.invincible>0) ctx.restore();
}

// ── Teken vijanden ──
function drawEnemies() {
  level.enemies.forEach(en=>{
    if(!en.alive) return;
    const ex = en.x - camera.x;
    const ey = en.y - camera.y;
    if(ex<-TILE || ex>canvas.width+TILE) return;

    if(en.type==='goomba') {
      // Hoofd
      ctx.fillStyle = CLR.goomba;
      ctx.beginPath(); ctx.arc(ex+14,ey+10,13,0,Math.PI*2); ctx.fill();
      // Lichaam
      ctx.fillStyle = CLR.goomba2;
      ctx.fillRect(ex+2, ey+14, 24, 14);
      // Wenkbrauwen
      ctx.fillStyle='#200';
      ctx.fillRect(ex+4,ey+6,7,3);
      ctx.fillRect(ex+17,ey+6,7,3);
      // Ogen
      ctx.fillStyle='#fff';
      ctx.fillRect(ex+6,ey+9,6,6);
      ctx.fillRect(ex+18,ey+9,6,6);
      ctx.fillStyle='#000';
      ctx.fillRect(ex+8,ey+10,3,4);
      ctx.fillRect(ex+20,ey+10,3,4);
      // Voetjes
      ctx.fillStyle='#300';
      ctx.fillRect(ex+2,ey+26,10,4); ctx.fillRect(ex+16,ey+26,10,4);
    } else if(en.type==='koopa') {
      ctx.fillStyle = CLR.koopa;
      ctx.fillRect(ex+2, ey+4, 24, 24);
      ctx.fillStyle = '#ffd700';
      ctx.beginPath(); ctx.arc(ex+14,ey+6,10,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#000';
      ctx.fillRect(ex+10,ey+2,4,4); ctx.fillRect(ex+18,ey+2,4,4);
      // Schild
      ctx.fillStyle=CLR.koopa2;
      ctx.beginPath(); ctx.arc(ex+14,ey+18,10,0,Math.PI*2); ctx.fill();
    } else if(en.type==='fly') {
      ctx.fillStyle='#cc2288';
      ctx.beginPath(); ctx.arc(ex+12,ey+12,12,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(200,200,255,0.6)';
      const wf = Math.sin(Date.now()*0.01+en.x*0.1);
      ctx.beginPath(); ctx.ellipse(ex-8, ey+8, 14, 7, wf*0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(ex+28,ey+8, 14, 7,-wf*0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.fillRect(ex+7,ey+8,5,5); ctx.fillRect(ex+14,ey+8,5,5);
    }
  });
}

// ── Teken particles ──
function drawParticles() {
  particles.forEach(p=>{
    ctx.globalAlpha = p.life/p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x-camera.x, p.y-camera.y, p.r, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha=1;

  floatTexts.forEach(f=>{
    ctx.globalAlpha = f.life/60;
    ctx.fillStyle = f.color;
    ctx.font='bold 14px monospace';
    ctx.textAlign='center';
    ctx.fillText(f.txt, f.x-camera.x, f.y-camera.y);
  });
  ctx.globalAlpha=1;
}

// ── Teken debug info ──
function drawDebug() {
  if(!keys['KeyF']) return;
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.fillRect(4,50,220,90);
  ctx.fillStyle='#0f0';
  ctx.font='11px monospace';
  ctx.textAlign='left';
  ctx.fillText(`POS: ${Math.floor(player.x)},${Math.floor(player.y)}`, 10, 66);
  ctx.fillText(`VEL: ${player.vx.toFixed(2)},${player.vy.toFixed(2)}`, 10, 80);
  ctx.fillText(`GND: ${player.onGround} COY:${player.coyote}`, 10, 94);
  ctx.fillText(`CAM: ${Math.floor(camera.x)},${Math.floor(camera.y)}`, 10, 108);
  ctx.fillText(`ENMS: ${level.enemies.filter(e=>e.alive).length}`, 10, 122);
}

// ── MAIN LOOP ──
let lastTime=0;
function loop(ts) {
  requestAnimationFrame(loop);
  const dt = Math.min(ts-lastTime, 50);
  lastTime = ts;

  if(state==='play') {
    updateTime();
    updatePlayer();
    if(level) {
      level.enemies.forEach(updateEnemy);
      checkEnemyPlayerCollision();
    }
    updateParticles();
    updateHUD();
  }

  // DRAW
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(state==='play' || state==='pause') {
    drawBackground();
    if(level) {
      drawMap();
      drawEnemies();
    }
    if(player) drawPlayer();
    drawParticles();
    drawDebug();

    if(state==='pause') {
      ctx.fillStyle='rgba(0,0,60,0.5)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
  } else if(state==='start'||state==='gameover'||state==='win') {
    // Statisch preview van geselecteerde level
    if(!level) {
      ctx.fillStyle='#000020';
      ctx.fillRect(0,0,canvas.width,canvas.height);
    } else {
      drawBackground();
      drawMap();
    }
  }

  prevKeys = {...keys};
}

// Start met het eerste level als preview
level = LEVELS[0]();
requestAnimationFrame(loop);
showScreen('screen-start');
