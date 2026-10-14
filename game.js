/* ==============================================================
 *  透明之夜 · 小春的迷宫 —— game.js
 *  引擎层：配置、精灵、迷宫、迷雾、光照、粒子、音乐、HUD
 *  （剧情 / 对话框 / 视图切换在 story.js）
 * ============================================================== */

/* --------------------------------------------------------------
 * 1. 全局参数
 * ------------------------------------------------------------ */
const CONFIG = {
  /* 白雾 */
  fogFadeIn:   1.40,
  fogFadeOut:  0.28,
  fogMaxAlpha: 0.93,
  fogPush:     0.92,      // 光把雾推开的强度
  fogNoiseAmp: 0.10,

  /* 光照 */
  lightRChar:  2.40,
  lightRGoal:  1.90,

  /* 移动 */
  moveInterval:  0.115,
  walkAnimSpeed: 8.5,
  spriteScale:   1.50,

  /* 对话 */
  dialogSpeed: 34,

  /* 体力（第三章） */
  staminaMax:      100,
  staminaPerStep:  4.2,
  staminaRegen:    18,
  staminaMinWalk:  20,

  /* 画布预算（用户选 A：放大） */
  budgetW: 880,
  budgetH: 600
};

/* --------------------------------------------------------------
 * 2. 章节表
 *    四章同一色系（浅蓝紫白雾），只做轻微冷暖偏移
 * ------------------------------------------------------------ */
const CHAPTERS = [
  {
    id:'c1', mode:'haru', hair:'long',
    label:'第一章', name:'白色的雾',
    desc:'她还能记得路的样子。',
    cols:21, rows:15,
    revealRadius:2.4, fogDelay:12,
    stamina:false, bookmarkMax:1,
    lighting:'spring',
    completes:['party','club']
  },
  {
    id:'c2', mode:'haru', hair:'long',
    label:'第二章', name:'留不住的路',
    desc:'走过的地方，很快就又白了。',
    cols:27, rows:19,
    revealRadius:2.4, fogDelay:3.2,
    stamina:false, bookmarkMax:3,
    lighting:'rain',
    completes:['friends','shopping']
  },
  {
    /* 驱的视角：时间上在她失忆之后、烟火之前 */
    id:'c4', mode:'kai', hair:'short',
    label:'第三章', name:'找到她',
    desc:'他从月岛一路跑到这里。',
    cols:27, rows:19,
    revealRadius:3.4, fogDelay:9,
    stamina:false, bookmarkMax:0,
    lighting:'hospital',
    completes:[]
  },
  {
    id:'c3', mode:'haru', hair:'short',
    label:'第四章', name:'拼到那天',
    desc:'这条走廊，她已经走了一百次。',
    cols:31, rows:23,
    revealRadius:3.0, fogDelay:16,
    stamina:true, bookmarkMax:6,
    lighting:'winter',
    completes:['fireworks','love']
  }
];

/* --------------------------------------------------------------
 * 3. 「死前想做的事情清单」
 *    出自原作：小春写在黄色书签上的三行字
 * ------------------------------------------------------------ */
const BUCKET_LIST = [
  { key:'party',     text:'参加聚会' },
  { key:'club',      text:'加入社团' },
  { key:'friends',   text:'交朋友'   },
  { key:'shopping',  text:'去逛街'   },
  { key:'fireworks', text:'放烟火'   },
  { key:'love',      text:'谈恋爱'   }
];

/* --------------------------------------------------------------
 * 4. 章节调色（同一色系，轻微偏移）
 *    每章：墙面 / 地面 / 导盲砖 / 迷雾 / 环境粒子
 * ------------------------------------------------------------ */
const PALETTES = {
  /* 春 · 偏暖的米白 */
  spring:{
    wallTints:['#f2e8d4','#f7f2e4','#e8ddc6','#f0e6d2','#f5eee1'],
    floor:['#f1f6ee','#ecf3ea','#f4f8f1'],
    dot:'#ddcd9c',
    seam:'rgba(186,176,142,.28)',
    fog:['rgb(247,249,252)','rgb(241,246,252)','rgb(249,245,252)'],
    hint:'#8fe3d0'
  },
  /* 梅雨 · 偏冷的灰蓝 */
  rain:{
    wallTints:['#e4e9ec','#eef2f4','#d3dade','#dee4e8','#e9edf0'],
    floor:['#eaf0f3','#e5ecef','#eef3f6'],
    dot:'#c9cfae',
    seam:'rgba(160,172,184,.30)',
    fog:['rgb(236,242,247)','rgb(230,238,245)','rgb(240,238,248)'],
    hint:'#8fc0cf'
  },
  /* 冬 · 偏冷的蓝紫 */
  winter:{
    wallTints:['#e2e4f0','#eff1fa','#ced2e4','#d9dcea','#e8e8f2'],
    floor:['#eceff8','#e6eaf6','#f0f3fb'],
    dot:'#cfcbae',
    seam:'rgba(158,164,196,.30)',
    fog:['rgb(233,236,250)','rgb(227,231,248)','rgb(238,232,250)'],
    hint:'#a9b6ff'
  },
  /* 医院 · 清冷的浅蓝 */
  hospital:{
    wallTints:['#e6eef3','#f2f8fb','#d4e0e8','#dee9f0','#ebf2f6'],
    floor:['#eef5f9','#e9f1f7','#f2f7fb'],
    dot:'#cdd5bd',
    seam:'rgba(160,180,196,.28)',
    fog:['rgb(238,246,251)','rgb(232,241,248)','rgb(240,242,250)'],
    hint:'#8fc8e3'
  }
};

/* --------------------------------------------------------------
 * 5. 环境粒子配置（每章专属氛围）
 * ------------------------------------------------------------ */
const PARTICLE_PROFILES = {
  spring:{
    kind:'petal', count:26,
    colors:['#ffd8e8','#ffe8f0','#ffffff','#ffe4ee'],
    vy:[10,22], vx:[-7,7], size:[1.5,3.0]
  },
  rain:{
    kind:'rain', count:64,
    colors:['rgba(198,220,238,.62)','rgba(182,208,230,.5)'],
    vy:[190,270], vx:[-34,-16], size:[1,1.7]
  },
  winter:{
    kind:'snow', count:34,
    colors:['#ffffff','#eef6ff','#e6eeff'],
    vy:[13,30], vx:[-11,11], size:[1.5,3.0]
  },
  hospital:{
    kind:'dust', count:22,
    colors:['#ffffff','#dcecff','#eaf4ff'],
    vy:[-14,-5], vx:[-6,6], size:[1,2.2]
  }
};

/* --------------------------------------------------------------
 * 6. 跨文件钩子
 *    story.js 会把真正的实现填进来（避免主循环调用到未定义函数）
 * ------------------------------------------------------------ */
const HOOK = {
  showDialog:      function(){},
  checkTriggers:   function(){},
  pumpDialog:      function(){},
  updateStory:     function(){},
  drawStoryScene:  function(){},
  drawStoryText:   function(){}
};

/* --------------------------------------------------------------
 * 7. DOM
 * ------------------------------------------------------------ */
const $ = id => document.getElementById(id);

const canvas     = $('maze');
const ctx        = canvas.getContext('2d');
const avatarEl   = $('avatar');
const portraitEl = $('portrait');
const dialogEl   = $('dialog');
const dlgNameEl  = $('dlgName');
const dlgTextEl  = $('dlgText');

const coverEl    = $('cover');
const vTitle     = $('vTitle');
const vSelect    = $('vSelect');
const vStory     = $('vStory');
const vEnd       = $('vEnd');

const storyArt   = $('storyArt');
const artCtx     = storyArt.getContext('2d');
const endArt     = $('endArt');
const endArtCtx  = endArt.getContext('2d');
const stLabelEl  = $('stLabel');
const stTextEl   = $('stText');
const stDotsEl   = $('stDots');

const ttlTextEl  = $('ttlText');
const ttlFootEl  = $('ttlFoot');
const selTitleEl = $('selTitle');
const selDescEl  = $('selDesc');
const chGridEl   = $('chGrid');

const heroNameEl = $('heroName');
const heroTagEl  = $('heroTag');
const subtitleEl = $('subtitle');
const hintEl     = $('hintBox');
const chapterLabelEl = $('chapterLabel');

const bucketListEl  = $('bucketList');
const statStaminaEl = $('statStamina');
const staminaBarEl  = $('staminaBar');
const staminaFillEl = $('staminaFill');
const statMarksEl   = $('statMarks');
const effBumpEl  = $('effBump');
const effWrongEl = $('effWrong');
const effTurnEl  = $('effTurn');
const effRestEl  = $('effRest');

const endTitleEl  = $('endTitle');
const endTextEl   = $('endText');
const endUnlockEl = $('endUnlock');
const endStatsEl  = $('endStats');

/* --------------------------------------------------------------
 * 8. 全局状态
 * ------------------------------------------------------------ */
let state = 'title';          // title | select | story | play | ending
let storyPlayer = { pages:[], idx:0, shown:0, t:0, running:false, label:'', onFinish:null };

let chapter = null;
let palette = PALETTES.spring;
let particleProfile = PARTICLE_PROFILES.spring;

let cols, rows, cell, W, H, dpr = 1;
let grid, lastSeen, fogArr, explored, fogNoiseArr, fogTintIdx, lightF, distField;
let startX, startY, goalX, goalY, goalIdx, totalFloors, startDist;

let px, py, gx, gy;
let playerDir = 'down', walkPhase = 0, lastMoveAt = -999, lastBumpAt = -999;
let blinkTimer = 2.6, blinking = 0, winOffX = 0;

let steps = 0, elapsed = 0, started = false, won = false;
let moveTimer = 0, hudTimer = 0, nowSec = 0;
let bumps = 0, wrongWays = 0, turns = 0, rests = 0;
let fogSwallowed = false;

let stamina = CONFIG.staminaMax;
let isResting = false;

let bookmarks = [], bookmarksLeft = 0;
let bucketDone = {};
let landmarks = [];

let mazeCanvas = null;
let sets = {};

const held = [];
const particles = [];

let lastTs = 0, ambientReady = false;

/* --------------------------------------------------------------
 * 9. 工具
 * ------------------------------------------------------------ */
const clamp = (v,a,b) => v < a ? a : (v > b ? b : v);
const lerp  = (a,b,t) => a + (b - a) * t;
const pad2  = n => String(n).padStart(2, '0');

function fmtTime(t){
  return pad2(Math.floor(t / 60)) + ':' + pad2(Math.floor(t % 60));
}
function cellHash(x, y){
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function pick(a){ return a[(Math.random() * a.length) | 0]; }
function gridDist(x1,y1,x2,y2){
  const dx = x2 - x1, dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
function randRange(a, b){ return a + Math.random() * (b - a); }

/* --------------------------------------------------------------
 * 10. 精灵构建器
 *     一个字符 = 一个美术像素；'.' = 透明
 *     只画 down / up / right，朝左 = 水平翻转 right
 * ------------------------------------------------------------ */

/** 一行像素整体水平平移（走路时腿的交替） */
function shiftRow(row, dx){
  const w = row.length, out = new Array(w).fill('.');
  for(let x = 0; x < w; x++){
    const nx = x + dx;
    if(nx >= 0 && nx < w) out[nx] = row[x];
  }
  return out.join('');
}

/** 字符矩阵 → 离屏 canvas */
function makeCanvas(rows, pal){
  const h = rows.length, w = rows[0].length;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  for(let y = 0; y < h; y++){
    const row = rows[y];
    for(let x = 0; x < w; x++){
      const col = pal[row[x]];
      if(!col) continue;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

/** 眨眼补丁：只覆盖眼睛那一小块，其余透明 */
function makeBlinkPatch(def, dir){
  const b = def.frames[dir] && def.frames[dir].blink;
  if(!b) return null;
  const c = document.createElement('canvas');
  c.width = 16; c.height = 22;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  for(let i = 0; i < b.rows.length; i++){
    const row = b.rows[i];
    for(let j = 0; j < row.length; j++){
      const col = def.palette[row[j]];
      if(!col) continue;
      g.fillStyle = col;
      g.fillRect(b.c0 + j, b.r0 + i, 1, 1);
    }
  }
  return c;
}

/** 生成一个角色的全部方向素材 */
function buildChar(def){
  const out = {};
  ['down','up','right'].forEach(dir => {
    const head = def.frames[dir].rows;
    const legs = def.legs[dir];
    const variants = [
      legs,
      legs.map(r => shiftRow(r,  1)),
      legs.map(r => shiftRow(r, -1))
    ];
    out[dir] = {
      base:  variants.map(v => makeCanvas(head.concat(v), def.palette)),
      blink: makeBlinkPatch(def, dir)
    };
  });
  return out;
}

function spriteSize(){
  const h = Math.round(cell * CONFIG.spriteScale);
  return { w: Math.round(h * 16 / 22), h };
}

/* --------------------------------------------------------------
 * 11. 像素素材（16 × 22）
 *     3/4 视角：right 方向有两只眼 + 鼻梁轮廓 + 颈部
 * ------------------------------------------------------------ */
const HARU_PAL = {
  H:'#2b3a68', i:'#6d85c4', h:'#46558c',
  S:'#ffe2cc', s:'#f0c3ae',
  W:'#ffffff', E:'#2f2a44',
  R:'#ff9fbb', M:'#d4707f',
  C:'#ffc2d8',
  D:'#bfeaff', d:'#8fcdee',
  N:'#f2f6ff', B:'#5b5a86'
};

const KAI_PAL = {
  K:'#33304a', k:'#575170',
  S:'#ffe7d2', s:'#eec9b0',
  W:'#ffffff', E:'#2e2744',
  R:'#ffb0a0', M:'#c07f8a',
  O:'#f5a25d',
  T:'#fdf5e3', t:'#e3d5b8',
  P:'#4d5878', B:'#5a4634'
};

/* ---- 小春 · 长发及腰 ---- */
const HARU_LONG = {
  palette:HARU_PAL,
  frames:{
    down:{
      rows:[
        '.....HHHHHH.....',
        '...HHHHHHHHHH...',
        '..HHHHHHHHHHHH..',
        '.HHHHHHHHHHHHHH.',
        '.HHiiHHHHHHiiHH.',
        'HHHHHHHHHHHHHHHH',
        'HHiiiiiiiiiiiiHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHSSSSSSSSHHHH',
        'HHHHSWESSSSEWSHH',
        'HHHHSEESSSSEESHH',
        'HHHHSRSSMMSSRSHH',
        '..HHSSSSSSSSHH..',
        '.HHHCCCCCCCCHHH.',
        'HHHHDDDDDDDDHHHH',
        '.HHHDDDDDDDDHHH.',
        '.HHHDDDDDDDDHHH.',
        '..dDDDDDDDDDDd..'
      ],
      blink:{ r0:9, c0:4, rows:['SEESSSSEES','SSSSSSSSSS'] }
    },
    up:{
      rows:[
        '.....HHHHHH.....',
        '...HHHHHHHHHH...',
        '..HHHHHHHHHHHH..',
        '.HHHHHHHHHHHHHH.',
        '.HHiiHHHHHHiiHH.',
        'HHHHHHHHHHHHHHHH',
        'HHiiiiiiiiiiiiHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHhhhhhhhhHHHH',
        'HHHHhhhhhhhhHHHH',
        'HHHHhhhhhhhhHHHH',
        'HHhhhhhhhhhhhhHH',
        'HHhhhhhhhhhhhhHH',
        'HHhhhhhhhhhhhhHH',
        'HHhhhhhhhhhhhhHH',
        '.HHDDDDDDDDDDHH.',
        '..dDDDDDDDDDDd..'
      ]
    },
    /* 3/4 视角：脸转向右前方，两只眼都可见，左侧是后脑的发量 */
    right:{
      rows:[
        '....HHHHHH......',
        '..HHHHHHHHHH....',
        '.HHHHHHHHHHHH...',
        '.HHHHHHHHHHHHH..',
        '.HHiiHHHHHHHHHH.',
        'HHHHHHHHHHHHHHH.',
        'HHiiiiiiiiiHHHHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHHSSSSSSSSSSS',
        'HHHSSSWESSSWESSS',
        'HHHSSSEESSSEESSS',
        'HHHSRSSSMMSSSSSS',
        '.HHHSSSSSSSSSSS.',
        'HHHHHSSSSSSHHHHH',
        'HHHHHCCCCCCCHHHH',
        'HHHHDDDDDDDDHHHH',
        '.HHHDDDDDDDDHHH.',
        '..HHDDDDDDDDHH..'
      ],
      blink:{ r0:9, c0:3, rows:['SSSEESSSEESSS','SSSSSSSSSSSSS'] }
    }
  },
  legs:{
    down: [ '.....SS..SS.....', '.....SS..SS.....', '.....NN..NN.....', '....BBB..BBB....' ],
    up:   [ '.....SS..SS.....', '.....SS..SS.....', '.....NN..NN.....', '....BBB..BBB....' ],
    right:[ '....SS..SS......', '....SS..SS......', '....NN..NN......', '...BBB..BBB.....' ]
  },
  hairSway:true,
  cane:true
};

/* ---- 小春 · 短发（第三章剪发之后） ---- */
const HARU_SHORT = {
  palette:HARU_PAL,
  frames:{
    down:{
      rows:[
        '.....HHHHHH.....',
        '...HHHHHHHHHH...',
        '..HHHHHHHHHHHH..',
        '.HHHHHHHHHHHHHH.',
        '.HHiiHHHHHHiiHH.',
        'HHHHHHHHHHHHHHHH',
        'HHiiiiiiiiiiiiHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHSSSSSSSSHHHH',
        'HHHHSWESSSSEWSHH',
        'HHHHSEESSSSEESHH',
        'HHHHSRSSMMSSRSHH',
        '...SSSSSSSSSS...',
        '..CCCCCCCCCCCC..',
        '.DDDDDDDDDDDDDD.',
        'DDDDDDDDDDDDDDDD',
        'DDDDDDDDDDDDDDDD',
        'dddddddddddddddd'
      ],
      blink:{ r0:9, c0:4, rows:['SEESSSSEES','SSSSSSSSSS'] }
    },
    up:{
      rows:[
        '.....HHHHHH.....',
        '...HHHHHHHHHH...',
        '..HHHHHHHHHHHH..',
        '.HHHHHHHHHHHHHH.',
        '.HHiiHHHHHHiiHH.',
        'HHHHHHHHHHHHHHHH',
        'HHiiiiiiiiiiiiHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHhhhhhhhhHHHH',
        'HHHHhhhhhhhhHHHH',
        'HHHHhhhhhhhhHHHH',
        '..HHhhhhhhhhHH..',
        '...SSSSSSSSSS...',
        '..CCCCCCCCCCCC..',
        '.DDDDDDDDDDDDDD.',
        'DDDDDDDDDDDDDDDD',
        'dddddddddddddddd'
      ]
    },
    right:{
      rows:[
        '....HHHHHH......',
        '..HHHHHHHHHH....',
        '.HHHHHHHHHHHH...',
        '.HHHHHHHHHHHHH..',
        '.HHiiHHHHHHHHHH.',
        'HHHHHHHHHHHHHHH.',
        'HHiiiiiiiiiHHHHH',
        'HHHHHHHHHHHHHHHH',
        'HHHHHSSSSSSSSSSS',
        'HHHSSSWESSSWESSS',
        'HHHSSSEESSSEESSS',
        'HHHSRSSSMMSSSSSS',
        '...HSSSSSSSSSSS.',
        '..CCCCCCCCCCCC..',
        '.DDDDDDDDDDDDDD.',
        'DDDDDDDDDDDDDDDD',
        'DDDDDDDDDDDDDDDD',
        'dddddddddddddddd'
      ],
      blink:{ r0:9, c0:3, rows:['SSSEESSSEESSS','SSSSSSSSSSSSS'] }
    }
  },
  legs:{
    down: [ '.....SS..SS.....', '.....SS..SS.....', '.....NN..NN.....', '....BBB..BBB....' ],
    up:   [ '.....SS..SS.....', '.....SS..SS.....', '.....NN..NN.....', '....BBB..BBB....' ],
    right:[ '....SS..SS......', '....SS..SS......', '....NN..NN......', '...BBB..BBB.....' ]
  },
  hairSway:false,
  cane:true
};

/* ---- 驱 ---- */
const KAI_DEF = {
  palette:KAI_PAL,
  frames:{
    down:{
      rows:[
        '.....KKKKKK.....',
        '...KKKKKKKKKK...',
        '..KKKKKKKKKKKK..',
        '.KKKKKKKKKKKKKK.',
        '.KKkkKKKKKKkkKK.',
        'KKKKKKKKKKKKKKKK',
        'KKkkkkkkkkkkkkKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKSSSSSSSSKKKK',
        'KKKKSWESSSSEWSKK',
        'KKKKSEESSSSEESKK',
        'KKKKSRSSMMSSRSKK',
        '...SSSSSSSSSS...',
        '..OOOOOOOOOOOO..',
        '.TTTTTTTTTTTTTT.',
        '.TTTTTTTTTTTTTT.',
        '.TttTTTTTTTTttT.',
        '.TTTTTTTTTTTTTT.'
      ],
      blink:{ r0:9, c0:4, rows:['SEESSSSEES','SSSSSSSSSS'] }
    },
    up:{
      rows:[
        '.....KKKKKK.....',
        '...KKKKKKKKKK...',
        '..KKKKKKKKKKKK..',
        '.KKKKKKKKKKKKKK.',
        '.KKkkKKKKKKkkKK.',
        'KKKKKKKKKKKKKKKK',
        'KKkkkkkkkkkkkkKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKkkkkkkkkKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        '...SSSSSSSSSS...',
        '..OOOOOOOOOOOO..',
        '.TTTTTTTTTTTTTT.',
        '.TTTTTTTTTTTTTT.',
        '.TttTTTTTTTTttT.',
        '.TTTTTTTTTTTTTT.'
      ]
    },
    right:{
      rows:[
        '....KKKKKK......',
        '..KKKKKKKKKK....',
        '.KKKKKKKKKKKK...',
        '.KKKKKKKKKKKKK..',
        '.KKkkKKKKKKKKKK.',
        'KKKKKKKKKKKKKKK.',
        'KKkkkkkkkkkKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKSSSSSSSSSSS',
        'KKKSSSWESSSWESSS',
        'KKKSSSEESSSEESSS',
        'KKKSRSSSMMSSSSSS',
        '...SSSSSSSSSSSS.',
        '..OOOOOOOOOOOO..',
        '..TTTTTTTTTTTT..',
        '.TTTTTTTTTTTTTT.',
        '.TttTTTTTTTTttT.',
        '.TTTTTTTTTTTTTT.'
      ],
      blink:{ r0:9, c0:3, rows:['SSSEESSSEESSS','SSSSSSSSSSSSS'] }
    }
  },
  legs:{
    down: [ '...PPPPPPPPPP...', '...PPP....PPP...', '...PPP....PPP...', '..BBB......BBB..' ],
    up:   [ '...PPPPPPPPPP...', '...PPP....PPP...', '...PPP....PPP...', '..BBB......BBB..' ],
    right:[ '...PPPPPPPPPP...', '....PPP....PPP..', '....PPP....PPP..', '...BBB....BBB...' ]
  },
  hairSway:false,
  cane:false
};

/* --------------------------------------------------------------
 * 12. 迷宫生成：递归回溯（唯一通路，无环）
 * ------------------------------------------------------------ */
function generateMaze(c, r){
  const g = new Uint8Array(c * r).fill(1);
  const at = (x, y) => y * c + x;
  const DIRS = [[0,-2], [2,0], [0,2], [-2,0]];

  g[at(1,1)] = 0;
  const stack = [[1,1]];

  while(stack.length){
    const cur = stack[stack.length - 1];
    const x = cur[0], y = cur[1];

    const cand = [];
    for(const d of DIRS){
      const nx = x + d[0], ny = y + d[1];
      if(nx > 0 && ny > 0 && nx < c - 1 && ny < r - 1 && g[at(nx,ny)] === 1){
        cand.push([nx, ny, d[0], d[1]]);
      }
    }
    if(cand.length === 0){ stack.pop(); continue; }

    const p = cand[(Math.random() * cand.length) | 0];
    g[at(x + p[2] / 2, y + p[3] / 2)] = 0;
    g[at(p[0], p[1])] = 0;
    stack.push([p[0], p[1]]);
  }
  return g;
}

/** 从起点 BFS：距离场 + 最远的格子（终点） */
function bfsFrom(g, c, r, sx, sy){
  const dist = new Int32Array(c * r).fill(-1);
  const s = sy * c + sx;
  dist[s] = 0;
  const queue = [s];
  let best = s, bestD = 0;

  for(let head = 0; head < queue.length; head++){
    const cur = queue[head];
    const d = dist[cur];
    if(d > bestD){ bestD = d; best = cur; }
    const x = cur % c, y = (cur / c) | 0;
    const N = [[1,0], [-1,0], [0,1], [0,-1]];
    for(const n of N){
      const nx = x + n[0], ny = y + n[1];
      if(nx < 0 || ny < 0 || nx >= c || ny >= r) continue;
      const ni = ny * c + nx;
      if(g[ni] === 1 || dist[ni] !== -1) continue;
      dist[ni] = d + 1;
      queue.push(ni);
    }
  }
  return { dist, far:best, farDist:bestD };
}

/* --------------------------------------------------------------
 * 13. 迷宫底图预渲染
 *     墙：章节色调的像素方块
 *     地面：导盲砖（浅底 + 四颗凸点）
 * ------------------------------------------------------------ */
function buildMazeCanvas(){
  const cvs = document.createElement('canvas');
  cvs.width  = Math.round(W * dpr);
  cvs.height = Math.round(H * dpr);
  const g = cvs.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.imageSmoothingEnabled = false;

  const pal = palette;

  for(let y = 0; y < rows; y++){
    for(let x = 0; x < cols; x++){
      const x0 = x * cell, y0 = y * cell;
      const hash = cellHash(x, y);

      if(grid[y * cols + x] === 1){
        /* ---- 墙 ---- */
        const base = pal.wallTints[(hash * pal.wallTints.length) | 0];
        const t = Math.max(2, Math.round(cell * 0.20));
        const s = Math.max(1, Math.round(cell * 0.14));

        g.fillStyle = base;                     g.fillRect(x0, y0, cell, cell);
        g.fillStyle = 'rgba(255,255,255,.58)';  g.fillRect(x0, y0, cell, t);
        g.fillStyle = 'rgba(255,255,255,.42)';  g.fillRect(x0, y0, s, cell);
        g.fillStyle = 'rgba(140,140,150,.26)';  g.fillRect(x0, y0 + cell - t, cell, t);
        g.fillStyle = 'rgba(150,150,162,.20)';  g.fillRect(x0 + cell - s, y0, s, cell);
      }else{
        /* ---- 地面：导盲砖 ---- */
        g.fillStyle = pal.floor[(x + y + ((hash * 3) | 0)) % pal.floor.length];
        g.fillRect(x0, y0, cell, cell);

        /* 砖缝 */
        g.fillStyle = pal.seam;
        g.fillRect(x0, y0, cell, 1);
        g.fillRect(x0, y0, 1, cell);

        /* 四颗凸起点字 */
        const dotR = Math.max(1, Math.round(cell * 0.115));
        const gap  = Math.max(2, Math.round(cell * 0.29));
        const cxd  = x0 + cell / 2, cyd = y0 + cell / 2;
        g.fillStyle = pal.dot;
        g.fillRect(Math.round(cxd - gap - dotR/2), Math.round(cyd - gap - dotR/2), dotR, dotR);
        g.fillRect(Math.round(cxd + gap - dotR/2), Math.round(cyd - gap - dotR/2), dotR, dotR);
        g.fillRect(Math.round(cxd - gap - dotR/2), Math.round(cyd + gap - dotR/2), dotR, dotR);
        g.fillRect(Math.round(cxd + gap - dotR/2), Math.round(cyd + gap - dotR/2), dotR, dotR);
      }
    }
  }

  /* 终点地面的柔光 */
  const gxp = goalX * cell, gyp = goalY * cell;
  const rad = g.createRadialGradient(
    gxp + cell/2, gyp + cell/2, 0,
    gxp + cell/2, gyp + cell/2, cell * 1.35
  );
  rad.addColorStop(0,   'rgba(255,246,214,.92)');
  rad.addColorStop(0.5, 'rgba(255,234,178,.42)');
  rad.addColorStop(1,   'rgba(255,234,178,0)');
  g.save();
  g.beginPath(); g.rect(gxp, gyp, cell, cell); g.clip();
  g.fillStyle = rad; g.fillRect(gxp, gyp, cell, cell);
  g.restore();

  return cvs;
}

/* --------------------------------------------------------------
 * 14. 白雾 + 光照
 * ------------------------------------------------------------ */
function revealAround(cx, cy, radius, now){
  const r = Math.ceil(radius);
  for(let dy = -r; dy <= r; dy++){
    for(let dx = -r; dx <= r; dx++){
      const x = cx + dx, y = cy + dy;
      if(x < 0 || y < 0 || x >= cols || y >= rows) continue;
      if(Math.sqrt(dx*dx + dy*dy) > radius) continue;
      const i = y * cols + x;
      lastSeen[i] = now;
      explored[i] = 1;
    }
  }
}

function addLight(cxf, cyf, radius, strength){
  const r = Math.ceil(radius);
  const ix = Math.floor(cxf), iy = Math.floor(cyf);
  for(let dy = -r; dy <= r; dy++){
    for(let dx = -r; dx <= r; dx++){
      const x = ix + dx, y = iy + dy;
      if(x < 0 || y < 0 || x >= cols || y >= rows) continue;
      const ddx = (x + 0.5) - cxf, ddy = (y + 0.5) - cyf;
      const d = Math.sqrt(ddx*ddx + ddy*ddy) / radius;
      if(d >= 1) continue;
      const f = (1 - d*d) * strength;
      const i = y * cols + x;
      if(f > lightF[i]) lightF[i] = f;
    }
  }
}

const PROBE_DIR = { down:[0,1], up:[0,-1], left:[-1,0], right:[1,0] };

function updateLights(){
  lightF.fill(0);
  addLight(px + 0.5, py + 0.5, CONFIG.lightRChar, 1.0);
  addLight(goalX + 0.5, goalY + 0.5, CONFIG.lightRGoal, 0.80);

  /* 白手杖：照亮前方 1 格（她能探到的地方） */
  if(chapter && chapter.mode === 'haru'){
    const pr = PROBE_DIR[playerDir];
    addLight(px + 0.5 + pr[0], py + 0.5 + pr[1], 1.15, 0.55);
  }
}

function lightAtPixel(x, y){
  const cxp = (px + 0.5) * cell, cyp = (py + 0.5) * cell;
  const d1 = Math.hypot(x - cxp, y - cyp) / (cell * CONFIG.lightRChar);
  const g1 = d1 < 1 ? (1 - d1*d1) : 0;

  const gxp = (goalX + 0.5) * cell, gyp = (goalY + 0.5) * cell;
  const d2 = Math.hypot(x - gxp, y - gyp) / (cell * CONFIG.lightRGoal);
  const g2 = d2 < 1 ? (1 - d2*d2) * 0.80 : 0;

  return Math.max(g1, g2);
}

function updateFog(dt){
  const delay = chapter.fogDelay;
  revealAround(gx, gy, chapter.revealRadius, nowSec);

  /* 书签穿透迷雾：永久保持可见 */
  for(let k = 0; k < bookmarks.length; k++){
    const bi = bookmarks[k].y * cols + bookmarks[k].x;
    lastSeen[bi] = nowSec;
    explored[bi] = 1;
  }

  for(let i = 0; i < fogArr.length; i++){
    const visible = (nowSec - lastSeen[i]) < delay;
    const target = visible ? 0 : 1;
    const cur = fogArr[i];
    if(cur === target) continue;

    const dur  = (target < cur) ? CONFIG.fogFadeOut : CONFIG.fogFadeIn;
    const step = dt / dur;
    fogArr[i] = (target < cur) ? Math.max(target, cur - step)
                               : Math.min(target, cur + step);
  }

  /* 第一次被雾吞掉走过的路 */
  if(!fogSwallowed && started){
    for(let i = 0; i < fogArr.length; i++){
      if(explored[i] && (nowSec - lastSeen[i]) > delay + 0.6){
        fogSwallowed = true;
        break;
      }
    }
  }
}

/* --------------------------------------------------------------
 * 15. 输入
 * ------------------------------------------------------------ */
function dirFromKey(e){
  switch(e.key){
    case 'ArrowUp':    case 'w': case 'W': return [0,-1];
    case 'ArrowDown':  case 's': case 'S': return [0, 1];
    case 'ArrowLeft':  case 'a': case 'A': return [-1,0];
    case 'ArrowRight': case 'd': case 'D': return [1, 0];
  }
  return null;
}

window.addEventListener('keydown', e => {
  if(e.key === ' ' || e.key === 'Enter'){
    if(state === 'story'){ storyNextPublic(); e.preventDefault(); return; }
    if(dialogState.active){ advanceDialogPublic(); e.preventDefault(); return; }
  }
  if((e.key === 'b' || e.key === 'B') && state === 'play'){
    insertBookmark();
    e.preventDefault();
    return;
  }
  if(state !== 'play') return;

  const d = dirFromKey(e);
  if(!d) return;
  e.preventDefault();
  if(won || e.repeat) return;
  if(!held.some(v => v[0] === d[0] && v[1] === d[1])) held.push(d);
  moveTimer = 0;
});

window.addEventListener('keyup', e => {
  const d = dirFromKey(e);
  if(!d) return;
  const i = held.findIndex(v => v[0] === d[0] && v[1] === d[1]);
  if(i >= 0) held.splice(i, 1);
});

window.addEventListener('blur', () => { held.length = 0; });

canvas.addEventListener('pointerdown', () => {
  if(dialogState.active) advanceDialogPublic();
});

let touchStart = null;
canvas.addEventListener('touchstart', e => {
  const t = e.changedTouches[0];
  touchStart = { x:t.clientX, y:t.clientY };
}, { passive:true });

canvas.addEventListener('touchend', e => {
  if(!touchStart || won || state !== 'play') return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
  touchStart = null;
  if(Math.abs(dx) < 22 && Math.abs(dy) < 22) return;
  if(Math.abs(dx) > Math.abs(dy)) tryMove(dx > 0 ? 1 : -1, 0);
  else                            tryMove(0, dy > 0 ? 1 : -1);
}, { passive:true });

/* --------------------------------------------------------------
 * 16. 移动
 * ------------------------------------------------------------ */
function faceTo(fromX, fromY, toX, toY){
  const dx = toX - fromX, dy = toY - fromY;
  if(Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}

const REST_LINES = [
  '……等我一下。\n（喘口气）',
  '（扶着墙。）\n（以前走这条路，根本不用停。）',
  '（再站一会儿。）\n（站一会儿就好。）'
];

function tryMove(dx, dy){
  const nx = gx + dx, ny = gy + dy;

  /* 撞墙 / 出界 */
  if(nx < 0 || ny < 0 || nx >= cols || ny >= rows || grid[ny * cols + nx] !== 0){
    if(nowSec - lastBumpAt > 0.5){ bumps++; lastBumpAt = nowSec; }
    return false;
  }

  /* 体力：第三章 */
  if(chapter.stamina && !isResting && stamina < CONFIG.staminaPerStep){
    isResting = true;
    rests++;
    HOOK.showDialog('haru', pick(REST_LINES), 2.6);
    return false;
  }

  /* 折返检测 */
  const opposite = { down:'up', up:'down', left:'right', right:'left' };
  let newDir;
  if(dx > 0)      newDir = 'right';
  else if(dx < 0) newDir = 'left';
  else if(dy > 0) newDir = 'down';
  else            newDir = 'up';
  if(started && newDir === opposite[playerDir]) turns++;
  playerDir = newDir;

  gx = nx; gy = ny;
  steps++;
  lastMoveAt = nowSec;
  if(!started) started = true;

  if(chapter.stamina){
    stamina = Math.max(0, stamina - CONFIG.staminaPerStep);
  }

  const i = gy * cols + gx;
  lastSeen[i] = nowSec;
  explored[i] = 1;

  /* 死胡同统计 */
  let open = 0;
  const N = [[1,0], [-1,0], [0,1], [0,-1]];
  for(const n of N){
    const ax = gx + n[0], ay = gy + n[1];
    if(ax >= 0 && ay >= 0 && ax < cols && ay < rows && grid[ay * cols + ax] === 0) open++;
  }
  if(open === 1 && !(gx === startX && gy === startY)) wrongWays++;

  checkBucketPickup();

  if(nx === goalX && ny === goalY) onWin();
  return true;
}

function handleHeldKeys(dt){
  moveTimer -= dt;
  if(moveTimer > 0 || held.length === 0 || dialogState.active) return;
  const d = held[held.length - 1];
  if(tryMove(d[0], d[1])) moveTimer = CONFIG.moveInterval;
  else                    moveTimer = 0.05;
}

function updateStamina(dt){
  if(!chapter || !chapter.stamina) return;

  if(isResting){
    stamina += CONFIG.staminaRegen * 1.6 * dt;
    if(stamina >= CONFIG.staminaMax * 0.75){
      isResting = false;
      HOOK.showDialog('haru', '……好了。可以走了。', 2.2);
    }
  }else if((nowSec - lastMoveAt) > 0.6){
    stamina += CONFIG.staminaRegen * dt;
  }
  stamina = clamp(stamina, 0, CONFIG.staminaMax);
}

/* --------------------------------------------------------------
 * 17. 黄色书签（记忆标记）
 * ------------------------------------------------------------ */
const MARK_LINES = [
  '（在这里放一张书签。）',
  '（记住这里。）',
  '（下次回来，就靠它了。）'
];

function insertBookmark(){
  if(!chapter || chapter.bookmarkMax <= 0) return;
  if(bookmarksLeft <= 0 || won) return;
  if(bookmarks.some(b => b.x === gx && b.y === gy)) return;

  bookmarks.push({ x:gx, y:gy, born:nowSec });
  bookmarksLeft--;

  const bi = gy * cols + gx;
  lastSeen[bi] = nowSec;
  explored[bi] = 1;

  HOOK.showDialog('haru', pick(MARK_LINES), 2.0);
  updateHUD();
}

/* --------------------------------------------------------------
 * 18. 清单里程碑
 * ------------------------------------------------------------ */
const BUCKET_LINES = {
  party:     '（好多人。好吵。）\n（可是很热闹。）',
  club:      '（烟火研究会……）\n（门上贴着海报。）',
  friends:   '（优子。）\n（还有鸣海同学。）',
  shopping:  '（买了好多烟火。）\n（袋子好沉。）',
  fireworks: '（砰——）\n（……好近。）',
  love:      '（原来，）\n（我也可以喜欢一个人。）'
};

function placeLandmarks(){
  landmarks = [];
  if(!chapter || !chapter.completes) return;

  const keys = chapter.completes.filter(k => k !== 'love');
  if(!keys.length) return;

  const cells = [];
  for(let i = 0; i < grid.length; i++){
    if(grid[i] === 0 && distField[i] >= 0){
      cells.push({ x:i % cols, y:(i / cols) | 0, d:distField[i] });
    }
  }
  if(!cells.length) return;

  const used = {};
  keys.forEach((key, idx) => {
    const wantD = ((idx + 1) / (keys.length + 1)) * startDist;
    let best = null, bestDiff = Infinity;
    for(const c of cells){
      if(c.x === startX && c.y === startY) continue;
      if(c.x === goalX && c.y === goalY) continue;
      if(used[c.x + ',' + c.y]) continue;
      const diff = Math.abs(c.d - wantD);
      if(diff < bestDiff){ bestDiff = diff; best = c; }
    }
    if(!best) return;
    used[best.x + ',' + best.y] = true;
    landmarks.push({ key, x:best.x, y:best.y, done:!!bucketDone[key] });
  });
}

function checkBucketPickup(){
  if(!landmarks.length || won) return;
  for(const lm of landmarks){
    if(lm.done) continue;
    if(gridDist(gx, gy, lm.x, lm.y) <= 1.1){
      grantBucket(lm.key);
      lm.done = true;
      burstParticles(lm.x, lm.y, 18);
      return;
    }
  }
}

function grantBucket(key){
  if(!key || bucketDone[key]) return;
  bucketDone[key] = true;

  const line = BUCKET_LINES[key];
  if(line) HOOK.showDialog('haru', line, 2.6);

  rebuildBucketUI();
  try{ localStorage.setItem('tn_bucket', JSON.stringify(bucketDone)); }catch(e){}
}

function rebuildBucketUI(){
  if(!bucketListEl) return;
  bucketListEl.innerHTML = '';
  for(const item of BUCKET_LIST){
    const done = !!bucketDone[item.key];
    const row = document.createElement('div');
    row.className = 'bucket-item' + (done ? ' on' : '');
    row.innerHTML = '<span class="bx">' + (done ? '✓' : '') + '</span>' +
                    '<span>' + item.text + '</span>';
    bucketListEl.appendChild(row);
  }
}

function loadBucket(){
  try{
    const raw = localStorage.getItem('tn_bucket');
    if(raw){
      const o = JSON.parse(raw);
      if(o && typeof o === 'object') bucketDone = o;
    }
  }catch(e){}
  rebuildBucketUI();
}

/* --------------------------------------------------------------
 * 19. HUD
 * ------------------------------------------------------------ */
function updateHUD(){
  if(!chapter) return;

  if(chapter.stamina){
    const pct = Math.round(stamina / CONFIG.staminaMax * 100);
    if(statStaminaEl) statStaminaEl.textContent = pct + '%';
    if(staminaFillEl) staminaFillEl.style.width = pct + '%';
    if(staminaBarEl)  staminaBarEl.classList.toggle('low', pct <= CONFIG.staminaMinWalk);
  }else{
    if(statStaminaEl) statStaminaEl.textContent = '—';
    if(staminaFillEl) staminaFillEl.style.width = '100%';
    if(staminaBarEl)  staminaBarEl.classList.remove('low');
  }

  if(statMarksEl) statMarksEl.textContent = String(bookmarksLeft);
  if(effBumpEl)  effBumpEl.textContent  = String(bumps);
  if(effWrongEl) effWrongEl.textContent = String(wrongWays);
  if(effTurnEl)  effTurnEl.textContent  = String(turns);
  if(effRestEl)  effRestEl.textContent  = String(rests);
}

function effortSummary(){
  return '撞墙 ' + bumps + ' 次　走错 ' + wrongWays + ' 次\n' +
         '折返 ' + turns + ' 次　停下 ' + rests + ' 次';
}

function drawAvatar(){
  if(!avatarEl || !chapter) return;
  const g = avatarEl.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, 16, 22);

  const key = (chapter.mode === 'kai')
    ? 'kai'
    : (chapter.hair === 'short' ? 'haruShort' : 'haruLong');

  if(sets[key] && sets[key].down && sets[key].down.base[0]){
    g.drawImage(sets[key].down.base[0], 0, 0);
  }
}

/* --------------------------------------------------------------
 * 20. 音乐：一首贯穿全场的温柔八音盒
 *     F 大调 · I–V–vi–IV 进行 · 固定 16 拍旋律
 * ------------------------------------------------------------ */
const MUSIC = {
  /* F 大调音阶频率（F4 起） */
  stepsPerBar: 4,
  stepDur:     0.34,        // 每拍秒数
  cutoff:      1600,        // 低通（去掉刺耳泛音）
  reverbSec:   1.05,        // 混响时长（缩短，避免空间错乱）
  reverbWet:   0.24,
  masterVol:   0.72,

  /* 旋律：相对 F4 的半音偏移，null = 休止 */
  melody:[
    7, 4, 0, 4,      // 第 1 小节  I  (F)  : C5 A4 F4 A4
    7, null, 2, 2,   // 第 2 小节  V  (C)  : C5 -  G4 G4
    9, 4, 0, 4,      // 第 3 小节  vi (Dm) : D5 A4 F4 A4
    5, null, 9, 5    // 第 4 小节  IV (Bb) : Bb4 - D5 Bb4
  ],
  /* 低音：每小节一个音（相对 F3） */
  bass:[ 0, 7, 9, 5 ],
  bassRoot: 174.61,         // F3
  bassVol:  0.040,
  noteVol:  0.062
};

let audioCtx = null;
let audioMaster = null;
let musicBus = null;
let schedTimer = null;
let nextNoteTime = 0;
let musicStep = 0;
let audioOn = true;

function makeImpulse(ctx2, seconds, decay){
  const rate = ctx2.sampleRate;
  const len = Math.max(1, Math.floor(rate * seconds));
  const buf = ctx2.createBuffer(2, len, rate);
  for(let ch = 0; ch < 2; ch++){
    const data = buf.getChannelData(ch);
    for(let i = 0; i < len; i++){
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
  }
  return buf;
}

/** 必须在用户手势里调用 */
function initAudio(){
  if(audioCtx){
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return;

  audioCtx = new AC();

  audioMaster = audioCtx.createGain();
  audioMaster.gain.value = audioOn ? MUSIC.masterVol : 0;
  audioMaster.connect(audioCtx.destination);

  /* 混响 */
  const conv = audioCtx.createConvolver();
  conv.buffer = makeImpulse(audioCtx, MUSIC.reverbSec, 2.4);
  const wet = audioCtx.createGain();
  wet.gain.value = MUSIC.reverbWet;
  conv.connect(wet).connect(audioMaster);

  /* 音乐总线 */
  musicBus = audioCtx.createGain();
  musicBus.gain.value = 1;
  musicBus.connect(audioMaster);
  musicBus.connect(conv);

  /* 预排程循环 */
  nextNoteTime = audioCtx.currentTime + 0.12;
  musicStep = 0;
  schedTimer = setInterval(scheduleMusic, 25);
}

/** 八音盒音色：三角波 + 低通 + 快速起音 + 指数衰减 */
function playNote(freq, at, dur, gain, pan){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const f = audioCtx.createBiquadFilter();
  const g = audioCtx.createGain();

  o.type = 'triangle';
  o.frequency.value = freq;

  f.type = 'lowpass';
  f.frequency.value = MUSIC.cutoff;
  f.Q.value = 0.5;

  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.010);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  o.connect(f).connect(g);

  if(audioCtx.createStereoPanner){
    const p = audioCtx.createStereoPanner();
    p.pan.value = clamp(pan || 0, -1, 1);
    g.connect(p).connect(musicBus);
  }else{
    g.connect(musicBus);
  }

  o.start(at);
  o.stop(at + dur + 0.06);
}

function scheduleMusic(){
  if(!audioCtx || !audioOn) return;

  const look = 0.14;
  while(nextNoteTime < audioCtx.currentTime + look){
    const t = nextNoteTime;
    const idx = musicStep % MUSIC.melody.length;

    /* 每小节的第一拍：低音 */
    if(musicStep % MUSIC.stepsPerBar === 0){
      const bar = Math.floor(musicStep / MUSIC.stepsPerBar) % MUSIC.bass.length;
      const bf = MUSIC.bassRoot * Math.pow(2, MUSIC.bass[bar] / 12);
      playNote(bf, t, MUSIC.stepDur * 3.4, MUSIC.bassVol, 0);
    }

    /* 旋律 */
    const deg = MUSIC.melody[idx];
    if(deg !== null){
      const f = 349.23 * Math.pow(2, deg / 12);        // 349.23 = F4
      playNote(f, t, 1.05, MUSIC.noteVol, 0);
      /* 高八度的一点点泛音，让音色更"盒" */
      if(Math.random() < 0.35){
        playNote(f * 2, t + 0.012, 0.55, MUSIC.noteVol * 0.22, 0);
      }
    }

    nextNoteTime += MUSIC.stepDur;
    musicStep++;
  }
}

function startMusic(){
  if(!audioCtx) return;
  nextNoteTime = audioCtx.currentTime + 0.12;
  musicStep = 0;
}
function stopMusic(){ /* 单曲贯穿全场，无需停止 */ }

function setMuted(muted){
  audioOn = !muted;
  if(audioMaster){
    const t = audioCtx.currentTime;
    audioMaster.gain.cancelScheduledValues(t);
    audioMaster.gain.setValueAtTime(audioMaster.gain.value, t);
    audioMaster.gain.linearRampToValueAtTime(
      audioOn ? MUSIC.masterVol : 0, t + 0.35
    );
  }
  try{ localStorage.setItem('tn_muted', muted ? '1' : '0'); }catch(e){}

  const b = $('btnMute');
  if(b) b.textContent = muted ? '开 声' : '静 音';
  if(audioOn && audioCtx) audioCtx.resume();
}

/* 切后台回来时恢复音频 */
['pointerdown','keydown'].forEach(ev => {
  window.addEventListener(ev, () => {
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  });
});

/* 静音按钮 */
(function bindMute(){
  const b = $('btnMute');
  if(!b) return;
  try{
    if(localStorage.getItem('tn_muted') === '1'){
      audioOn = false;
      b.textContent = '开 声';
    }
  }catch(e){}
  b.addEventListener('click', () => setMuted(audioOn));
})();

/* --------------------------------------------------------------
 * 21. 粒子（章节专属氛围 + 通关爆发）
 * ------------------------------------------------------------ */
function initParticles(){
  particles.length = 0;
  const prof = particleProfile;
  if(!prof) return;

  for(let i = 0; i < prof.count; i++){
    particles.push(newParticle(prof, true));
  }
}

function newParticle(prof, anywhere){
  return {
    kind: prof.kind,
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : -12,
    vx: randRange(prof.vx[0], prof.vx[1]),
    vy: randRange(prof.vy[0], prof.vy[1]),
    size: randRange(prof.size[0], prof.size[1]),
    color: pick(prof.colors),
    phase: Math.random() * Math.PI * 2,
    life: Infinity
  };
}

function burstParticles(cx, cy, count){
  const x0 = (cx + 0.5) * cell, y0 = (cy + 0.5) * cell;
  const cols4 = ['#ffe6a8','#ffd0e8','#cfe2ff','#d8ccff','#c8f2e8'];
  for(let i = 0; i < count; i++){
    const a = Math.random() * Math.PI * 2;
    const sp = 26 + Math.random() * 78;
    particles.push({
      kind:'spark',
      x: x0, y: y0,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 18,
      size: 1.4 + Math.random() * 2.2,
      color: cols4[(Math.random() * cols4.length) | 0],
      phase: Math.random() * Math.PI * 2,
      life: 1.4 + Math.random() * 1.5
    });
  }
}

function updateParticles(dt){
  const prof = particleProfile;

  for(let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.phase += dt * 2.4;

    if(p.life !== Infinity){
      p.life -= dt;
      p.vy += 22 * dt;
      if(p.life <= 0){ particles.splice(i, 1); continue; }
      continue;
    }

    /* 出界回收 */
    if(p.y > H + 14 || p.y < -14 || p.x < -20 || p.x > W + 20){
      if(prof && p.kind === prof.kind){
        const np = newParticle(prof, false);
        np.y = (p.kind === 'dust') ? H + 8 : -10;
        np.x = Math.random() * W;
        particles[i] = np;
      }else{
        particles.splice(i, 1);
      }
    }
  }
}

function drawParticles(){
  ctx.save();
  for(const p of particles){
    const fade = (p.life === Infinity) ? 1 : Math.min(1, p.life / 1.2);
    const lit = 0.32 + 0.68 * lightAtPixel(p.x, p.y);

    if(p.kind === 'rain'){
      /* 雨丝：斜线 */
      ctx.globalAlpha = clamp(0.42 * lit * fade, 0, 1);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.022, p.y - p.vy * 0.022);
      ctx.stroke();
      continue;
    }

    const a = (p.kind === 'snow' || p.kind === 'petal')
      ? (0.30 + 0.18 * Math.sin(p.phase)) * fade * lit
      : (0.20 + 0.16 * Math.sin(p.phase)) * fade * lit;

    if(a <= 0.01) continue;
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    const s = p.size;
    ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }
  ctx.restore();
}

/* --------------------------------------------------------------
 * 22. 渲染
 * ------------------------------------------------------------ */
function render(){
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, W, H);

  ctx.drawImage(mazeCanvas, 0, 0, W, H);   // 迷宫底图
  drawFog();                                // 白雾
  drawBookmarks();                          // 黄色书签
  drawParticles();                          // 氛围粒子
  drawGoalGlow();                           // 终点柔光

  /* 终点上的那个人 */
  const buddyAlpha = 1 - fogArr[goalIdx];
  if(buddyAlpha > 0.03 && chapter.mode === 'haru'){
    const bDir = won ? 'left' : faceTo(goalX, goalY, gx, gy);
    drawShadow(goalX, goalY, buddyAlpha * 0.85);
    drawChar(sets.kai, bDir, 0, goalX, goalY, buddyAlpha, 0, false, 0);
  }

  drawPlayer();
  drawVignette();
}

function drawFog(){
  ctx.save();
  for(let i = 0; i < fogArr.length; i++){
    let a = fogArr[i];
    if(a <= 0.004) continue;

    a *= CONFIG.fogMaxAlpha * fogNoiseArr[i] * (1 - lightF[i] * CONFIG.fogPush);
    if(a <= 0.004) continue;

    const x = i % cols;
    const y = (i / cols) | 0;
    ctx.globalAlpha = a > 1 ? 1 : a;
    ctx.fillStyle = palette.fog[fogTintIdx[i] % palette.fog.length];
    ctx.fillRect(x * cell, y * cell, cell, cell);
  }
  ctx.restore();
}

function drawBookmarks(){
  for(const bm of bookmarks){
    const cx = (bm.x + 0.5) * cell;
    const cy = (bm.y + 0.86) * cell;
    const w = Math.max(3, Math.round(cell * 0.16));
    const h = Math.max(6, Math.round(cell * 0.34));

    const grow = clamp((nowSec - bm.born) * 4, 0, 1);
    const hh = h * grow;

    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#ffd75e';
    ctx.fillRect(Math.round(cx - w/2), Math.round(cy - hh), w, Math.round(hh));
    ctx.fillStyle = '#e0b83a';
    ctx.fillRect(Math.round(cx - w/2),
                 Math.round(cy - Math.max(1, hh * 0.28)),
                 w, Math.max(1, Math.round(hh * 0.28)));

    ctx.globalAlpha = 0.26;
    ctx.fillStyle = '#fff0b8';
    const r = cell * 0.75;
    ctx.beginPath();
    ctx.arc(cx, cy - h * 0.5, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawGoalGlow(){
  const cx = (goalX + 0.5) * cell;
  const cy = (goalY + 0.5) * cell;
  const pulse = 0.16 + 0.06 * Math.sin(nowSec * 1.6);

  const layers = [
    { r: cell * 2.10, rgb:'255,234,186' },
    { r: cell * 1.35, rgb:'255,246,220' }
  ];
  ctx.save();
  for(const L of layers){
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, L.r);
    g.addColorStop(0, 'rgba(' + L.rgb + ',' + pulse + ')');
    g.addColorStop(1, 'rgba(' + L.rgb + ',0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - L.r, cy - L.r, L.r * 2, L.r * 2);
  }
  ctx.restore();
}

function drawVignette(){
  const g = ctx.createRadialGradient(
    W/2, H/2, Math.min(W,H) * 0.30,
    W/2, H/2, Math.max(W,H) * 0.74
  );
  g.addColorStop(0, 'rgba(130,146,182,0)');
  g.addColorStop(1, 'rgba(130,146,182,.18)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawShadow(cx, cy, alpha){
  ctx.save();
  ctx.globalAlpha = alpha * 0.20;
  ctx.fillStyle = '#7c88a8';
  ctx.beginPath();
  ctx.ellipse((cx + 0.5) * cell, (cy + 1) * cell - cell * 0.09,
              cell * 0.30, cell * 0.10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayer(){
  drawShadow(px, py, 1);

  const walking = (nowSec - lastMoveAt) < 0.22;
  let frame = 0, bob = 0;
  if(walking){
    const step = Math.floor(walkPhase) % 4;
    const seq = [0, 1, 0, 2];
    frame = seq[step];
    bob = (step === 1 || step === 3) ? -Math.round(cell * 0.06) : 0;
  }else{
    bob = Math.sin(nowSec * 2.2) * cell * 0.014;
  }

  const key = (chapter.mode === 'kai')
    ? 'kai'
    : (chapter.hair === 'short' ? 'haruShort' : 'haruLong');

  drawChar(sets[key], playerDir, frame, px, py, 1, bob, blinking > 0, walkPhase);
}

function drawChar(set, dir, frame, cx, cy, alpha, yOff, blink, phase){
  const d = (dir === 'left') ? 'right' : dir;
  const src = set[d].base[frame];
  const sz = spriteSize();
  const w = sz.w, h = sz.h;
  const x = Math.round((cx + 0.5) * cell - w / 2);
  const y = Math.round((cy + 1) * cell - cell * 0.07 - h + (yOff || 0));

  const def = (set === sets.kai) ? KAI_DEF
            : (set === sets.haruShort ? HARU_SHORT : HARU_LONG);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;

  ctx.translate(x, y);
  if(dir === 'left'){ ctx.translate(w, 0); ctx.scale(-1, 1); }

  ctx.drawImage(src, 0, 0, w, h);

  /* 眨眼 */
  if(blink && set[d].blink) ctx.drawImage(set[d].blink, 0, 0, w, h);

  /* 长发摆动：只偏移两侧的发条 */
  if(def.hairSway && (nowSec - lastMoveAt) < 0.22){
    const sway = Math.round(Math.sin(walkPhase * Math.PI / 2) * (w / 16) * 0.9);
    if(sway !== 0){
      const top = h * 12 / 22, hgt = h * 7 / 22;
      const stripW = w * 3 / 16;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, top, stripW, hgt);
      ctx.rect(w - stripW, top, stripW, hgt);
      ctx.clip();
      ctx.translate(sway, 0);
      ctx.drawImage(src, 0, 0, w, h);
      ctx.restore();
    }
  }

  if(def.cane) drawCane(ctx, w, h, d, phase || 0);

  ctx.restore();
}

/** 白手杖：深色描边 + 白色杖身 + 红色杖尖 */
function drawCane(g, w, h, dir, phase){
  const u = Math.max(1, w / 16);
  let hx, hy, tx, ty;

  if(dir === 'down'){
    hx = w * 0.70; hy = h * 0.60;
    tx = w * 0.98; ty = h * 1.00;
  }else if(dir === 'up'){
    hx = w * 0.30; hy = h * 0.60;
    tx = w * 0.02; ty = h * 1.00;
  }else{
    hx = w * 0.74; hy = h * 0.58;
    tx = w * 1.10; ty = h * 1.02;
  }

  tx += Math.sin(phase * Math.PI / 2) * u * 1.1;

  const N = 12;
  g.fillStyle = '#8a94bb';
  for(let i = 0; i <= N; i++){
    const k = i / N;
    const cxp = hx + (tx - hx) * k, cyp = hy + (ty - hy) * k;
    const s = Math.ceil(u * 1.5);
    g.fillRect(Math.round(cxp - s/2), Math.round(cyp - s/2), s, s);
  }
  for(let i = 0; i <= N; i++){
    const k = i / N;
    const cxp = hx + (tx - hx) * k, cyp = hy + (ty - hy) * k;
    g.fillStyle = (i >= N - 1) ? '#e8636f' : '#ffffff';
    const s = Math.max(1, Math.round(u * 0.9));
    g.fillRect(Math.round(cxp - s/2), Math.round(cyp - s/2), s, s);
  }
}

/* --------------------------------------------------------------
 * 23. 章节 UI 文案
 * ------------------------------------------------------------ */
function applyChapterUI(){
  const ch = chapter;
  if(chapterLabelEl) chapterLabelEl.textContent = ch.label + ' · ' + ch.name;
  if(heroNameEl) heroNameEl.textContent = (ch.mode === 'kai') ? '驱' : '小春';
  if(heroTagEl)  heroTagEl.textContent  = (ch.mode === 'kai') ? 'K A I' : 'H A R U';
  if(subtitleEl) subtitleEl.textContent = ch.desc;

  if(hintEl){
    if(ch.mode === 'kai'){
      hintEl.innerHTML =
        '<div><span class="dot">▸</span> <b>方向键 / WASD</b> 移动</div>' +
        '<div><span class="dot">▸</span> 他看得远，但雾合得快</div>' +
        '<div><span class="dot">▸</span> 走过的地方，雾会重新合上</div>' +
        '<div><span class="dot">▸</span> <b>空格 / 点击</b> 推进对话</div>';
    }else{
      hintEl.innerHTML =
        '<div><span class="dot">▸</span> <b>方向键 / WASD</b> 移动</div>' +
        '<div><span class="dot">▸</span> <b>B</b> 插下黄色书签（永不被雾吞）</div>' +
        (ch.stamina
          ? '<div><span class="dot">▸</span> 体力见底时要<b>停下喘气</b></div>'
          : '<div><span class="dot">▸</span> 走过的地方，雾会重新合上</div>') +
        '<div><span class="dot">▸</span> <b>空格 / 点击</b> 推进对话</div>';
    }
  }
}

/* --------------------------------------------------------------
 * 24. 开始一局
 * ------------------------------------------------------------ */
function startLevel(idx){
  const ch = CHAPTERS[idx] || CHAPTERS[0];
  chapter = ch;
  palette = PALETTES[ch.lighting] || PALETTES.spring;
  particleProfile = PARTICLE_PROFILES[ch.lighting] || PARTICLE_PROFILES.spring;

  /* 画布尺寸 */
  cols = ch.cols;
  rows = ch.rows;
  cell = Math.max(12, Math.floor(Math.min(CONFIG.budgetW / cols, CONFIG.budgetH / rows)));
  W = cell * cols;
  H = cell * rows;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width  = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = W + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  /* 迷宫 + 终点 */
  grid = generateMaze(cols, rows);
  const res = bfsFrom(grid, cols, rows, 1, 1);
  startX = 1; startY = 1;
  goalIdx = res.far;
  goalX = goalIdx % cols;
  goalY = (goalIdx / cols) | 0;
  distField = res.dist;
  startDist = Math.max(1, res.farDist);

  /* 迷雾数组 */
  const n = cols * rows;
  lastSeen    = new Float64Array(n).fill(-1e9);
  fogArr      = new Float32Array(n).fill(1);
  explored    = new Uint8Array(n);
  fogNoiseArr = new Float32Array(n);
  fogTintIdx  = new Uint8Array(n);
  lightF      = new Float32Array(n);

  const amp = CONFIG.fogNoiseAmp;
  for(let i = 0; i < n; i++){
    fogNoiseArr[i] = 1 - amp/2 + Math.random() * amp;
    fogTintIdx[i]  = (Math.random() * 6) | 0;
  }

  totalFloors = 0;
  for(let i = 0; i < n; i++) if(grid[i] === 0) totalFloors++;

  /* 运行时状态 */
  gx = px = startX;
  gy = py = startY;
  playerDir = 'down';
  walkPhase = 0;
  lastMoveAt = nowSec - 1;
  lastBumpAt = nowSec - 1;
  blinkTimer = 2.5; blinking = 0;
  winOffX = 0;

  steps = 0; elapsed = 0;
  started = false; won = false;
  moveTimer = 0; hudTimer = 0;
  bumps = 0; wrongWays = 0; turns = 0; rests = 0;
  fogSwallowed = false;

  stamina = CONFIG.staminaMax;
  isResting = false;

  bookmarks = [];
  bookmarksLeft = ch.bookmarkMax;

  held.length = 0;

  /* 预渲染 & UI */
  placeLandmarks();
  mazeCanvas = buildMazeCanvas();
  drawAvatar();
  rebuildBucketUI();
  updateHUD();
  applyChapterUI();
  initParticles();

  revealAround(startX, startY, ch.revealRadius, nowSec);
  updateLights();
}

/* --------------------------------------------------------------
 * 25. 主循环
 * ------------------------------------------------------------ */
function loop(ts){
  requestAnimationFrame(loop);

  if(!lastTs) lastTs = ts;
  let dt = (ts - lastTs) / 1000;
  lastTs = ts;
  dt = Math.min(dt, 0.06);
  nowSec = ts / 1000;

  if(!ambientReady){
    ambientReady = true;
    if(!particles.length) initParticles();
  }

  /* 序章 / 尾声：由 story.js 提供实现（带正确的 scene 参数） */
  if(state === 'story'){
    HOOK.updateStory(dt);
    if(storyPlayer.pages.length && storyPlayer.pages[storyPlayer.idx]){
      HOOK.drawStoryScene(storyPlayer.pages[storyPlayer.idx].scene);
    }
    HOOK.drawStoryText();
  }

  /* 游戏世界 */
  if(state === 'play' && !won){
    if(started) elapsed += dt;
    handleHeldKeys(dt);
    updateStamina(dt);
  }
  if(state === 'play'){
    updateFog(dt);
    HOOK.checkTriggers();
  }

  updateLights();
  updateParticles(dt);
  HOOK.pumpDialog(dt);

  /* 位置平滑插值 */
  const tx = gx + (won ? winOffX : 0);
  const k = 1 - Math.exp(-dt * 22);
  px += (tx - px) * k;
  py += (gy - py) * k;
  if(Math.abs(px - tx) < 0.002) px = tx;
  if(Math.abs(py - gy) < 0.002) py = gy;

  /* 走路动画相位 */
  if((nowSec - lastMoveAt) < 0.22) walkPhase += dt * CONFIG.walkAnimSpeed;
  else                             walkPhase = 0;

  /* 眨眼 */
  blinkTimer -= dt;
  if(blinking > 0) blinking -= dt;
  else if(blinkTimer <= 0){
    blinking = 0.12;
    blinkTimer = 2.4 + Math.random() * 3.4;
  }

  /* HUD 节流 */
  hudTimer -= dt;
  if(hudTimer <= 0){ hudTimer = 0.12; updateHUD(); }

  render();
}

/* --------------------------------------------------------------
 * 26. 兼容 shim
 *    story.js 会用到的少量符号，在这里先声明占位
 *    （真正的实现在 story.js，通过 HOOK 调用）
 * ------------------------------------------------------------ */
const dialogState = { active:false, text:'', shown:0, t:0, hold:0, who:'haru' };

function storyNextPublic(){
  if(typeof storyNext === 'function') storyNext();
}
function advanceDialogPublic(){
  if(typeof advanceDialog === 'function') advanceDialog();
}

/* --------------------------------------------------------------
 * 27. 初始化
 * ------------------------------------------------------------ */
sets.haruLong  = buildChar(HARU_LONG);
sets.haruShort = buildChar(HARU_SHORT);
sets.kai       = buildChar(KAI_DEF);

loadBucket();

/* 先建一局，让画布有尺寸（标题页背后能透出迷宫） */
startLevel(0);

requestAnimationFrame(loop);