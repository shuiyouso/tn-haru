/* ==============================================================
 *  透明之夜 · 小春的迷宫 —— story.js
 *  叙事层：剧情数据、像素插画、对话框、视图、解锁、结局
 * ============================================================== */

/* --------------------------------------------------------------
 * 1. 四章剧情
 *    prologue → 序章页（含专属插画）
 *    triggers → 途中低语（when 为真时触发，各只触发一次）
 *    ending   → 走到终点后的对话
 *    epilogue → 章节尾声
 * ------------------------------------------------------------ */
const STORY = {

  /* ============ 第一章 · 白色的雾 ============ */
  c1:{
    prologue:[
      { scene:'izakaya',
        text:'入学式的座位是按假名排的。\n「早濑」的 Ha，和「冬月」的 Fu。\n\n就这样，优子坐到了我旁边。' },
      { scene:'izakaya',
        text:'「你的眼睛看不见吗？」\n\n有人这么问我。\n我说：「是的。」\n\n就这么简单。真的。' },
      { scene:'izakaya',
        text:'居酒屋很吵。\n我不知道自己的果汁放在哪儿。\n\n「小春，在十二点钟的方向喔。」\n\n优子在我耳边这么说。' },
      { scene:'bench',
        text:'后来我们去了学生合作社的露天座位。\n\n那台自动贩卖机是我的专属贩卖机。\n我背下了「加糖」和「奶茶」的按钮。\n\n就这样，我开始认识这个世界。' }
    ],
    triggers:[
      { id:'start', when:c => c.steps >= 1,
        who:'haru', text:'（导盲砖。）\n（这是我唯一认得出的路。）', hold:2.6 },
      { id:'s30', when:c => c.steps >= 30,
        who:'haru', text:'一步。两步。\n（我数着呢。）', hold:2.4 },
      { id:'b3', when:c => c.bumps >= 3,
        who:'haru', text:'（撞到了。）\n（对不起，是我不小心。）', hold:2.6 },
      { id:'de1', when:c => c.deadEnds >= 1,
        who:'haru', text:'（走错了。）\n（退回去就好。退回去就好。）', hold:2.8 },
      { id:'fog', when:c => c.fogSwallowed,
        who:'haru', text:'（刚才走过去的地方，\n　又白了。）', hold:2.8 },
      { id:'r50', when:c => c.ratio <= 0.50,
        who:'haru', text:'（略多加糖的奶茶。）\n（那台是我的专属贩卖机。）', hold:2.8 },
      { id:'r20', when:c => c.ratio <= 0.20,
        who:'haru', text:'（前面有光。）\n（是……谁在那儿？）', hold:2.8 }
    ],
    ending:[
      { who:'haru', text:'……驱同学。', hold:2.0 },
      { who:'haru', text:'你怎么会在这里。', hold:2.6 },
      { who:'kai',  text:'我在这里等你啊。', hold:2.6 },
      { who:'haru', text:'（他不是在等我。）\n（他是想让我——\n　不用一个人走。）', hold:3.2 },
      { who:'kai',  text:'慢慢来。不用急。', hold:2.6 },
      { who:'haru', text:'嗯。', hold:2.0 }
    ],
    epilogue:{
      scene:'bench', title:'白色的雾',
      text:'那天晚上我做了个梦。\n梦见自己在一大片白色的雾里。\n\n雾里也有别人。\n他们走得很快，一下子就不见了。\n只有我，得一步一步地摸。\n\n「大家都以为会是一片漆黑，' +
           '\n　可是我感觉像在接近白色的透明雾气中。」\n\n—— 后来我这样告诉过他。'
    }
  },

  /* ============ 第二章 · 留不住的路 ============ */
  c2:{
    prologue:[
      { scene:'hospital',
        text:'接吻的隔天，我在家里昏倒了。\n\n妈妈很担心，带我去看了急诊。\nX 光照片上，有一个阴影。' },
      { scene:'chemo',
        text:'「癌细胞转移到肝脏了。」\n\n第三次了。\n\n医生说：\n撑到今年年底的机率，是百分之五。' },
      { scene:'blank',
        text:'优子传了一段影片给我。\n\n他在文字烧店里突然站起来大喊：\n「我，空野麴……」\n\n（啊，连自己名字都念错了。）\n\n他吸了一口气，重新喊：\n「我空野驱，最喜欢冬月小春了！」\n\n（好，我决定永久保存这一段。）' },
      { scene:'blank',
        text:'然后我把手机扔了出去。\n\n（不可以。）\n（这样会害了他。）\n\n所以我决定：\n从大家面前消失。\n就算再遇见他，也要装作不认识。\n\n直到他忘记我为止。' }
    ],
    triggers:[
      { id:'start', when:c => c.steps >= 1,
        who:'haru', text:'（这里是医院。）\n（我记不住这里的路。）', hold:2.6 },
      { id:'s40', when:c => c.steps >= 40,
        who:'haru', text:'（昨天走过的路，\n　今天就不见了。）', hold:2.8 },
      { id:'b3', when:c => c.bumps >= 3,
        who:'haru', text:'（对不起。）\n（我撞到你了。）', hold:2.4 },
      { id:'de2', when:c => c.deadEnds >= 2,
        who:'haru', text:'（又绕回来了。）\n（我连自己走过的地方都留不住。）', hold:3.0 },
      { id:'fog', when:c => c.fogSwallowed,
        who:'haru', text:'（连刚刚走过的路也不见了。）\n（原来这就是「看不见」。）', hold:3.0 },
      { id:'idle', when:c => c.idle > 8 && c.steps > 12,
        who:'haru', text:'（坐下吧。）\n（坐下就不累了。）', hold:2.8 },
      { id:'r40', when:c => c.ratio <= 0.40,
        who:'haru', text:'（不可以。）\n（我答应过要忘掉的。）', hold:3.0 },
      { id:'r15', when:c => c.ratio <= 0.15,
        who:'haru', text:'（钢琴。）\n（有人在弹钢琴。）', hold:2.6 }
    ],
    ending:[
      { who:'haru', text:'……你不要再来了。', hold:2.6 },
      { who:'kai',  text:'为什么？', hold:1.8 },
      { who:'haru', text:'因为我会死。\n反正我就要死了。', hold:3.0 },
      { who:'haru', text:'（我说的不是真心话。）\n（我只是……）', hold:2.8 },
      { who:'kai',  text:'那我陪着。', hold:2.4 },
      { who:'haru', text:'（他为什么。）\n（为什么就是不肯放弃我。）', hold:3.2 }
    ],
    epilogue:{
      scene:'blank', title:'留不住的路',
      text:'我把疼都藏起来了。\n笑的时候比以前更用力。\n\n因为我不想让他们看见。\n\n—— 后来我才知道，\n那时候最难的，不是疼。\n\n是「不想被看见」这件事本身。'
    }
  },

  /* ============ 第三章 · 拼到那天 ============ */
  c3:{
    prologue:[
      { scene:'corridor',
        text:'九月。\n「儿童烟火节」的日子定下来了。\n\n九月第四周的星期六。\n\n在那之前，\n我要把身体养回来。' },
      { scene:'hair',
        text:'医生说，头发下星期开始掉。\n\n所以我自己先剪掉了。\n\n剪下来的头发，\n捐给因为治疗而掉发的孩子。\n\n（我以前也失去过头发。）\n（我知道那有多难过。）' },
      { scene:'corridor',
        text:'「因为要是放烟火的那天\n　我没办法自己走路，\n　不是感觉很不好吗？」\n\n「所以我已经决定好，要拼到那天。」' },
      { scene:'waiting',
        text:'这一层楼，\n从病房到空中花园，\n一共三十七步。\n\n我一个人走了一百次。\n\n现在，我闭着眼睛也能走完。' }
    ],
    triggers:[
      { id:'start', when:c => c.steps >= 1,
        who:'haru', text:'（这条走廊，我走了一百次。）\n（三十七步。）', hold:2.8 },
      { id:'s37', when:c => c.steps >= 37,
        who:'haru', text:'（三十七步。）\n（今天也走到了。）', hold:2.8 },
      { id:'b2', when:c => c.bumps >= 2,
        who:'haru', text:'（没关系。）\n（墙在这里，说明我没走偏。）', hold:2.8 },
      { id:'de1', when:c => c.deadEnds >= 1,
        who:'haru', text:'（走错了。）\n（……不。是我还认得这里。）', hold:2.8 },
      { id:'r50', when:c => c.ratio <= 0.50,
        who:'haru', text:'（还有三个月。）\n（撑到那天就好。）', hold:2.8 },
      { id:'r20', when:c => c.ratio <= 0.20,
        who:'haru', text:'（到了。）\n（我看到了。）', hold:2.6 }
    ],
    ending:[
      { who:'haru', text:'……驱同学。', hold:2.0 },
      { who:'haru', text:'我自己走过来了。\n真的，我自己走过来的。', hold:3.0 },
      { who:'kai',  text:'嗯。我知道。', hold:2.4 },
      { who:'haru', text:'（他说「我知道」。）\n（我看不见他。）\n（那他也一定——\n　看着我一整条走廊。）', hold:3.4 },
      { who:'kai',  text:'辛苦你了。', hold:2.4 },
      { who:'haru', text:'（嗯。）\n（辛苦了。）', hold:2.8 }
    ],
    epilogue:{
      scene:'fireworks', title:'拼到那天',
      text:'九月第四周的星期六\n是个大晴天。\n\n我穿上了浴衣。\n\n腰带上绣的是文殊兰。\n那种花的花语是——\n\n「我相信你。」'
    }
  },

  /* ============ 彩蛋 · 找到她（驱的视角） ============ */
  c4:{
    prologue:[
      { scene:'run',
        text:'那天她没有来走廊。\n\n电话也不接。\n\n鸣海说，她住进了一家医院。\n从新富町走过去能到。' },
      { scene:'run',
        text:'我从月岛开始跑。\n\n两公里。\n红灯一个都没等。\n\n喘不过气的时候就快走，\n缓过来就再跑。' },
      { scene:'piano',
        text:'十二层楼。\n一层一层地找。\n\n在七楼，\n我听到钢琴声。' },
      { scene:'piano',
        text:'那间屋子墙壁是粉蓝色的，\n地板是黄色和绿色。\n\n十个孩子。\n三位妈妈。\n\n还有一架直立式钢琴。\n\n琴键的一端，靠着她的白手杖。' }
    ],
    triggers:[
      { id:'start', when:c => c.steps >= 1,
        who:'kai', text:'（十二层。）\n（从哪一层开始找？）', hold:2.8 },
      { id:'s50', when:c => c.steps >= 50,
        who:'kai', text:'（她一个人走过这样的路。）\n（走了一整年。）', hold:3.2 },
      { id:'b3', when:c => c.bumps >= 3,
        who:'kai', text:'（撞墙是这种感觉。）', hold:2.6 },
      { id:'de2', when:c => c.deadEnds >= 2,
        who:'kai', text:'（她一个人走的时候，\n　是不是也这样一次一次退回来。）', hold:3.4 },
      { id:'fog', when:c => c.fogSwallowed,
        who:'kai', text:'（连刚看清的路都会消失。）\n（难怪她会怕。）', hold:3.0 },
      { id:'r40', when:c => c.ratio <= 0.40,
        who:'kai', text:'（钢琴声。）\n（比刚才清楚了一点。）', hold:2.8 },
      { id:'r15', when:c => c.ratio <= 0.15,
        who:'kai', text:'（就在这一层。）', hold:2.4 }
    ],
    ending:[
      { who:'kai',  text:'小春！', hold:1.8 },
      { who:'kai',  text:'……我找了你很久。\n从走廊这头，到走廊那头。', hold:3.2 },
      { who:'haru', text:'……你是谁？', hold:2.6 },
      { who:'kai',  text:'（她真的忘了。）\n（不。）', hold:2.4 },
      { who:'kai',  text:'初次见面，你好。\n我叫做空野驱。', hold:3.0 },
      { who:'kai',  text:'我会一直来。', hold:2.6 }
    ],
    epilogue:{
      scene:'piano', title:'找到她',
      text:'她弹完那首歌，\n孩子们喊：「谢谢大姊姊～」\n\n她笑着说：「小朋友再见喽～」\n\n我在门外站着，\n哭得一塌糊涂。\n\n—— 不是因为她忘了我。\n\n是因为她在这样的地方，\n还在给别人唱歌。'
    }
  }
};

/* --------------------------------------------------------------
 * 2. 结局 A：康复与新生活
 * ------------------------------------------------------------ */
const ENDING_A = {
  title:'你活下来了',
  text:'冬天的最后一天，医生说：\n「癌细胞的增殖，停了。」\n\n她花了整整两年。\n从「撑到年底的机率是百分之五」，\n到能自己走出医院的大门。\n\n春天，她重新回到大学。\n夏天，她和优子去了海边。\n秋天，她和他去放了烟火。\n\n第二年，她又穿上了浴衣。\n第三年，她毕业了。\n\n—— 一切都是从那句话开始的。\n「我会努力的。请相信我。」'
};

/* --------------------------------------------------------------
 * 3. 终章 B：她留下的那卷录音带
 * ------------------------------------------------------------ */
const FINALE = {
  label:'终 章',
  pages:[
    { scene:'tape', text:'很多年以后。\n\n整理旧物的时候，\n翻出了一台录音机。' },
    { scene:'tape', text:'按下播放键。\n\n先是我自己的声音——\n\n那一年我读《安妮日记》给她听，\n读到最后，嗓子都哑了。' },
    { scene:'tape', text:'我正要快转，\n\n忽然听到了她的声音。' },
    { scene:'tape', text:'『给阿驱——』\n\n『首先，请原谅我先你而去。』\n\n『对不起，这一次可能很难撑过去了。』' },
    { scene:'tape', text:'『可是请你不要太过悲伤喔。』\n\n『在我死后，你应该哭了吧。』\n\n『也是啦。』' },
    { scene:'tape', text:'『可是在与我好好地告别之后，\n　就不用再哭了。』\n\n『真的完全不用哭喔。』' },
    { scene:'tape', text:'『因为我没有任何想哭的回忆。』\n\n『我还比较想请你称赞我——\n　竟然活了那么久。』' },
    { scene:'tape', text:'『我穿上了婚纱。』\n\n『还去了蜜月旅行。』\n\n『我不只那样，\n　你还带我们一家人去了很多地方。』' },
    { scene:'tape', text:'『我感到最幸福的，\n　是你给了我咲良。』\n\n『我从没想过，\n　身体变成这样之后，\n　还能成为母亲。』' },
    { scene:'tape', text:'『阿驱。』\n\n『自从我决定不放弃人生的那一天起，\n　每天都快乐得不得了。』' },
    { scene:'tape', text:'『每一个瞬间，\n　都像烟火一样，\n　深深烙印在我的心中。』' },
    { scene:'tape', text:'『啊啊，我好幸福。』\n\n『我的人生好幸福呢！』' }
  ],
  epilogue:{
    scene:'tape',
    title:'请你一定要笑着活下去',
    text:'『当你往后感到沮丧时，\n　请你回想起我们一起欣赏的烟火。』\n\n『我就是这样撑过来的。』\n\n『我或许会停下脚步，\n　可是我相信即将前往远方的你。』\n\n『请你——』\n\n『请你一定要笑着活下去。』\n\n—— 因为我也一样。'
  }
};

/* --------------------------------------------------------------
 * 4. 像素插画
 *    画布 480×280 → G=8 → 60×35 个像素单位
 * ------------------------------------------------------------ */
function paintScene(g, id, t){
  const G = 8, RW = 60, RH = 35;
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, RW * G, RH * G);

  const R = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(Math.round(x * G), Math.round(y * G),
               Math.round(w * G), Math.round(h * G));
  };

  switch(id){

    /* ===== 居酒屋迎新会 ===== */
    case 'izakaya':{
      R(0, 0, RW, RH, '#2a2438');
      R(0, 23, RW, 12, '#3a3048');
      R(0, 0, RW, 3, '#221c30');

      /* 吊灯 */
      R(24, 0, 12, 2, '#5a4a3c');
      R(25, 2, 10, 2, 'rgba(255,214,150,.55)');
      R(26, 4, 8, 1, 'rgba(255,214,150,.22)');

      /* 拉门 */
      R(50, 5, 10, 20, '#4a3c50');
      R(55, 5, 1, 20, '#2e2438');
      R(51, 7, 8, 7, 'rgba(255,200,140,.10)');

      /* 桌上的锅 */
      R(4, 20, 18, 4, '#4a3850');
      R(5, 19, 16, 2, '#6a4a58');
      R(7, 18, 12, 1, '#c8736f');
      R(9, 17, 8, 1, 'rgba(255,220,180,.35)');

      /* 三个杯子 */
      R(25, 17, 3, 6, '#8ab0d0');
      R(26, 17, 1, 6, '#c8e0f0');
      R(33, 18, 3, 5, '#c8a06a');
      R(41, 17, 3, 6, '#e8d8b0');

      /* 「孤岛」那桌的三个女生 */
      const girls = [[11,26,'#d8b0c8','#3a2c40'], [19,26,'#b0c8e0','#5a4a68'], [28,26,'#f0d8b0','#8a7a58']];
      girls.forEach(([x, y, c1, c2]) => {
        R(x, y, 3, 6, c1);
        R(x - 1, y - 1, 5, 1, c2);
        R(x, y - 2, 3, 1, c2);
      });

      /* 周围站着的人影 */
      for(let i = 0; i < 7; i++){
        R(1 + i * 8.5, 11, 3, 11, 'rgba(18,14,28,.55)');
        R(1.5 + i * 8.5, 10, 2, 1, 'rgba(18,14,28,.5)');
      }
      break;
    }

    /* ===== 露天座位 / 自动贩卖机 ===== */
    case 'bench':{
      R(0, 0, RW, RH, '#bfdaf2');
      R(0, 19, RW, 16, '#93b2d0');
      R(0, 19, RW, 1, '#a8c4de');

      /* 云 */
      R(7, 3, 11, 3, '#ffffff');
      R(10, 2, 7, 1, '#ffffff');
      R(38, 6, 14, 3, '#f2f8ff');
      R(42, 5, 8, 1, '#f2f8ff');

      /* 围栏 */
      for(let i = 0; i < 9; i++) R(i * 5, 15, 1, 9, '#cdc5ae');
      R(0, 15, 44, 1, '#dbd3bb');

      /* 自动贩卖机 */
      R(46, 7, 14, 27, '#48587a');
      R(47, 8, 12, 20, '#6d8db4');
      for(let r = 0; r < 3; r++){
        for(let c2 = 0; c2 < 3; c2++){
          R(48 + c2 * 3.6, 9.5 + r * 6, 2.6, 3.6,
            ['#e08a8a','#f0d08a','#8ac8b0','#8ab0e0','#c8a0e0'][(r + c2) % 5]);
        }
      }
      R(47, 29, 12, 3, '#3a4a68');
      R(48, 20, 10, 1, 'rgba(255,255,255,.28)');

      /* 长椅 */
      R(3, 23, 24, 2, '#8a6a4a');
      R(4, 25, 2, 6, '#6a4a34');
      R(24, 25, 2, 6, '#6a4a34');
      R(3, 20, 24, 1, '#9c7c58');

      /* 树 */
      R(30, 6, 9, 9, '#8ab890');
      R(32, 4, 5, 4, '#a0cfa4');
      R(35, 14, 2, 8, '#6a5238');

      /* 草 */
      for(let i = 0; i < 22; i++) R(i * 2.8, 31 + (i % 3), 1, 2, '#7fae86');
      break;
    }

    /* ===== 医院走廊 ===== */
    case 'hospital':{
      R(0, 0, RW, RH, '#e2ecf3');
      R(0, 0, 19, RH, '#c6d8e4');
      R(41, 0, 19, RH, '#c6d8e4');
      R(19, 0, 22, 8, '#f2f8fc');
      R(19, 8, 22, 27, '#d2e2ec');

      /* 地板透视 */
      for(let i = 0; i < 7; i++){
        R(19 + i * 1.6, 23 + i * 1.7, 22 - i * 3.2, 1, '#a9c2d2');
      }
      R(19, 25, 22, 10, '#bcd3df');

      /* 导盲砖 */
      for(let i = 0; i < 6; i++) R(29, 25 + i * 1.7, 2, 1, '#dcc678');

      /* 扶手 */
      R(19, 19, 22, 1, '#9ab3c4');
      for(let i = 0; i < 5; i++) R(20 + i * 4.4, 19, 1, 4, '#8ba6b8');

      /* 侧门 */
      R(3, 11, 6, 10, '#adc6d6');
      R(51, 11, 6, 10, '#adc6d6');
      R(50, 14, 1, 2, '#88a8bc');

      /* 尽头的光 */
      R(26, 9, 8, 11, '#ffffff');
      R(27, 10, 6, 9, '#f8fcff');

      /* 空气中的尘埃 */
      for(let i = 0; i < 8; i++){
        const dx = 24 + (i * 3.1 + Math.sin(t * 0.5 + i) * 1.6) % 12;
        const dy = 11 + (i * 2.7 + Math.cos(t * 0.4 + i) * 1.4) % 8;
        R(dx, dy, 1, 1, 'rgba(255,255,255,.6)');
      }
      break;
    }

    /* ===== 化疗 / 点滴 ===== */
    case 'chemo':{
      R(0, 0, RW, RH, '#2a3040');
      R(0, 29, RW, 6, '#38405a');
      R(0, 0, RW, 2, '#232838');

      /* 输液袋 */
      R(26, 2, 8, 11, '#5aa8c8');
      R(26, 2, 8, 1, '#a4dcf0');
      R(27, 3, 2, 8, 'rgba(255,255,255,.35)');
      R(28, 13, 4, 1, '#98a8c8');

      /* 管子 + 下落的水滴 */
      for(let i = 14; i < 29; i++) R(29.5, i, 1, 1, '#c0cce0');
      const drop = (t * 14) % 13;
      R(29.5, 15 + drop, 1, 1, '#eaf6ff');

      /* 病床 */
      R(0, 26, RW, 3, '#38405a');
      R(7, 22, 32, 5, '#dae3ee');
      R(7, 21, 32, 1, '#eef4fa');
      R(8, 27, 2, 4, '#4a5470');
      R(36, 27, 2, 4, '#4a5470');
      R(10, 19, 9, 3, '#f2f7fc');

      /* 手臂 + 点滴针 */
      R(14, 20, 8, 2, '#ffe2cc');
      R(15, 20, 1, 2, '#e8b8a0');
      R(18, 18, 1, 2, '#c8d4e8');

      /* 窗外的月亮 */
      R(48, 3, 7, 7, '#f0e8c0');
      R(49, 4, 4, 4, '#ffffff');
      R(51, 5, 2, 2, '#fdf8e0');
      for(let i = 0; i < 5; i++) R(44 + (i * 3) % 14, 3 + (i * 2) % 6, 1, 1, '#dce8ff');
      break;
    }

    /* ===== 空白 / 记忆丧失 ===== */
    case 'blank':{
      R(0, 0, RW, RH, '#eef2f8');

      /* 漂浮的白雾块 */
      for(let i = 0; i < 16; i++){
        const px2 = ((i * 13 + t * 5 + Math.sin(t * 0.4 + i) * 4) % 70) - 5;
        const py2 = ((i * 5 + t * 1.6 + Math.cos(t * 0.3 + i) * 3) % 40) - 3;
        const w = 8 + (i % 4) * 4;
        R(px2, py2, w, 4, 'rgba(255,255,255,.9)');
      }

      /* 中间模糊的人形 */
      R(28, 13, 4, 11, 'rgba(178,190,214,.5)');
      R(27, 11, 6, 2, 'rgba(150,164,196,.44)');

      /* 一台被扔掉的手机 */
      R(41, 26, 6, 3, '#3a4058');
      R(42, 26.6, 3, 1.8, '#7ad0e8');
      R(43.5, 29.5, 1, 1, '#2a3048');

      /* 地上的裂痕 */
      for(let i = 0; i < 9; i++) R(36 + i * 2, 31 + Math.round(Math.sin(i) * 1.2), 2, 1, '#c8d2e2');
      break;
    }

    /* ===== 剪发 ===== */
    case 'hair':{
      R(0, 0, RW, RH, '#eaf0f7');
      R(0, 21, RW, 14, '#cdd8e6');
      R(0, 21, RW, 1, '#dae3ee');

      /* 窗 */
      R(44, 4, 13, 12, '#c8d8e6');
      R(45, 5, 11, 10, '#f4faff');
      R(50, 5, 1, 10, '#c8d8e6');

      /* 护理师 */
      R(37, 8, 11, 17, '#ffffff');
      R(38, 15, 9, 1, '#e3eaf3');
      R(39, 5, 7, 4, '#f6dac2');
      R(38, 3, 9, 2, '#e8e0d0');

      /* 剪刀（开合动画） */
      const op = Math.abs(Math.sin(t * 2.0)) * 2.4;
      R(30, 11, 1, 5, '#a8b0c0');
      R(34, 11 + op, 1, 5, '#a8b0c0');
      R(31, 15, 3, 1, '#8a94a8');

      /* 坐着的人 */
      R(13, 11, 9, 13, '#bfeaff');
      R(14, 7, 7, 6, '#ffe2cc');
      R(13, 5, 9, 3, '#2b3a68');
      R(12, 7, 2, 11, '#2b3a68');
      R(21, 7, 2, 11, '#2b3a68');
      R(15, 9.5, 5, 1, '#2b3a68');
      R(15, 10.5, 1, 1, '#2f2a44');
      R(19, 10.5, 1, 1, '#2f2a44');

      /* 掉在地上的头发 */
      R(6, 26, 7, 1, '#2b3a68');
      R(9, 28, 9, 1, '#3a4a78');
      R(7, 30, 5, 1, '#2b3a68');

      /* 桌上的假发盒 */
      R(45, 24, 11, 7, '#e8d8b8');
      R(46, 23, 9, 1, '#d0c0a0');
      R(48, 26, 5, 3, '#2b3a68');
      break;
    }

    /* ===== 康复走廊（三十七步） ===== */
    case 'corridor':{
      R(0, 0, RW, RH, '#e6eff7');
      R(0, 0, 17, RH, '#c6d8e4');
      R(43, 0, 17, RH, '#c6d8e4');
      R(17, 0, 26, 9, '#f4fafd');
      R(17, 9, 26, 26, '#d6e4ee');

      /* 扶手（两条） */
      R(17, 17, 26, 1, '#9ab3c4');
      R(17, 21, 26, 1, '#9ab3c4');
      for(let i = 0; i < 6; i++) R(18 + i * 4.4, 17, 1, 5, '#8ba6b8');

      /* 导盲砖 */
      for(let i = 0; i < 11; i++) R(29, 23 + i * 1.1, 2, 0.8, '#dcc678');

      /* 地上的脚印（随进度点亮） */
      const litCount = Math.min(9, Math.floor(steps / 7));
      for(let i = 0; i < 9; i++){
        const on = i < litCount;
        R(28 + (i % 2) * 2, 24 + i * 1.15, 1, 1,
          on ? '#a8bcc8' : 'rgba(178,198,214,.34)');
      }

      /* 尽头的窗 */
      R(26, 11, 8, 10, '#ffffff');
      R(27, 12, 6, 8, '#f4fbff');
      R(17, 9, 26, 9, 'rgba(255,255,255,.30)');

      /* 光斑洒在地上 */
      for(let i = 0; i < 5; i++){
        R(20 + i * 2, 24 + i, 5, 1, 'rgba(255,246,214,.42)');
      }
      break;
    }

    /* ===== 空中花园 / 等待 ===== */
    case 'waiting':{
      R(0, 0, RW, RH, '#2c3450');
      R(0, 18, RW, 17, '#3c4668');

      /* 星空 */
      R(42, 2, 10, 10, '#3a4468');
      R(45, 4, 6, 6, '#fdf4d2');
      R(46, 5, 3, 3, '#ffffff');
      for(let i = 0; i < 11; i++){
        if((Math.floor(t * 1.4) + i) % 6 !== 0){
          R(3 + i * 5.2, 2 + (i % 4) * 2.6, 1, 1, '#dce8ff');
        }
      }

      /* 树 */
      R(2, 7, 11, 11, '#2a4a4a');
      R(4, 5, 7, 4, '#37615c');
      R(7, 18, 2, 5, '#243c3c');

      /* 长椅 */
      R(14, 23, 20, 2, '#8b7b69');
      R(15, 25, 2, 5, '#6b5b4b');
      R(31, 25, 2, 5, '#6b5b4b');
      R(14, 19, 20, 1, '#9c8c7a');
      for(let i = 0; i < 5; i++) R(15 + i * 4.6, 19, 1, 4, '#7c6c5c');

      /* 绿拱门 */
      for(let i = 0; i < 11; i++){
        R(38 + i, 13 + Math.round(Math.sin(i / 2.2) * 2.2), 1, 1, '#4d8f6d');
      }
      R(38, 15, 1, 8, '#3f7a5c');
      R(48, 15, 1, 8, '#3f7a5c');

      /* 阶梯 */
      for(let i = 0; i < 4; i++) R(43 + i * 2, 29 + i, 13 - i * 2, 1, '#4a5478');

      /* 花坛里的红花 */
      for(let i = 0; i < 4; i++) R(52 + i * 2, 24 + (i % 2), 1, 1, '#c85a6a');
      break;
    }

    /* ===== 烟火之夜 ===== */
    case 'fireworks':{
      R(0, 0, RW, RH, '#141830');
      R(0, 23, RW, 12, '#1e2444');

      /* 楼房剪影 */
      for(let i = 0; i < 9; i++){
        const hgt = 6 + (i % 3) * 5;
        R(i * 7, 21 - hgt, 6, hgt, '#1a2038');
        for(let r = 0; r < Math.floor(hgt / 3); r++){
          R(i * 7 + 1 + (r % 2) * 2, 22 - hgt + r * 3, 1, 1, 'rgba(255,214,150,.45)');
        }
      }

      /* 烟花（循环绽放） */
      const sparks = [
        { cx:15, cy:7,  col:'#ffd0e0' },
        { cx:38, cy:4,  col:'#c8e0ff' },
        { cx:51, cy:11, col:'#ffe6a8' }
      ];
      sparks.forEach((s, i) => {
        const ph = (t / 2.4 + i / 3) % 1;
        const rad = ph * 9;
        const fade = 1 - ph;
        if(fade <= 0.02) return;
        for(let a = 0; a < 14; a++){
          const ang = a / 14 * Math.PI * 2;
          const sx = s.cx + Math.cos(ang) * rad;
          const sy = s.cy + Math.sin(ang) * rad;
          if(sy > 21) continue;
          g.globalAlpha = fade * 0.95;
          R(sx, sy, 1, 1, s.col);
        }
        g.globalAlpha = fade;
        R(s.cx, s.cy, 1, 1, '#ffffff');
        g.globalAlpha = 1;
      });

      /* 草地 */
      for(let i = 0; i < 24; i++) R(i * 2.6, 30 + (i % 3), 1, 3, '#1c2c3c');

      /* 并肩的两个人影 */
      R(22, 25, 3, 7, '#0e1228');
      R(21, 23, 5, 2, '#0e1228');
      R(28, 25, 3, 7, '#0e1228');
      R(27, 23, 5, 2, '#0e1228');
      R(26, 27, 2, 1, '#0e1228');   // 牵着的手
      break;
    }

    /* ===== 奔跑（驱的视角） ===== */
    case 'run':{
      R(0, 0, RW, RH, '#3b4159');
      R(0, 21, RW, 14, '#4b5169');
      R(0, 21, RW, 1, '#565c74');

      /* 速度线 */
      for(let i = 0; i < 18; i++){
        const y2 = 3 + i * 1.6;
        const len = 9 + ((i * 7 + Math.floor(t * 34)) % 22);
        const x2 = -8 + ((i * 13 + Math.floor(t * 46)) % 46);
        R(x2, y2, len, 1, 'rgba(196,206,226,.16)');
      }

      /* 人行道砖 */
      for(let i = 0; i < 14; i++){
        const off = ((i * 6 - t * 44) % 74 + 74) % 74 - 6;
        R(off, 30, 4, 1, 'rgba(206,216,236,.28)');
      }

      /* 路灯（向后掠过） */
      for(let i = 0; i < 4; i++){
        const off = ((i * 22 - t * 44) % 88 + 88) % 88 - 12;
        R(off, 6, 1, 16, 'rgba(180,194,220,.34)');
        R(off - 1, 5, 3, 2, 'rgba(255,240,190,.42)');
      }

      /* 奔跑的人影（前倾） */
      R(27, 13, 4, 11, '#1a2038');
      R(25, 11, 6, 3, '#1a2038');
      R(30, 17, 5, 2, '#1a2038');
      R(23, 19, 4, 2, '#1a2038');
      R(28, 24, 3, 6, '#1a2038');

      /* 前方的医院剪影 */
      R(47, 5, 13, 21, 'rgba(92,112,142,.55)');
      R(49, 3, 3, 3, 'rgba(92,112,142,.55)');
      for(let r = 0; r < 5; r++){
        for(let c2 = 0; c2 < 4; c2++){
          R(48.5 + c2 * 3, 7 + r * 3.6, 1.4, 1.8, 'rgba(255,238,190,.34)');
        }
      }
      break;
    }

    /* ===== 儿童游戏室 / 钢琴 ===== */
    case 'piano':{
      R(0, 0, RW, RH, '#bfe0f2');
      R(0, 0, RW, 11, '#d0ecf7');

      /* 拼接地垫（黄绿交替） */
      for(let r = 0; r < 4; r++){
        for(let c2 = 0; c2 < 11; c2++){
          R(c2 * 5.5, 25 + r * 2.6, 5, 2, (r + c2) % 2 ? '#aed87c' : '#f0d878');
        }
      }

      /* 墙上的装饰 */
      R(4, 3, 6, 6, '#ffe0a8');
      R(13, 2, 5, 5, '#c8e8b8');
      R(21, 4, 6, 4, '#f8c8d8');

      /* 直立钢琴 */
      R(29, 11, 21, 17, '#2a2a38');
      R(30, 12, 19, 9, '#3c3c50');
      R(31, 13, 17, 7, 'rgba(255,255,255,.06)');
      R(31, 21, 17, 2, '#fbfbf3');
      for(let i = 0; i < 8; i++) R(31.5 + i * 2, 21, 1.2, 2, '#2a2a38');
      R(29, 27, 21, 1, '#1e1e2c');

      /* 弹琴的人（坐姿） */
      R(21, 17, 8, 9, '#bfeaff');
      R(22, 12, 6, 5, '#ffe2cc');
      R(21, 10, 8, 3, '#2b3a68');
      R(21, 12, 2, 6, '#2b3a68');
      R(27, 13, 1, 1, '#2f2a44');
      R(23, 13, 1, 1, '#2f2a44');
      R(28, 19, 4, 2, '#ffe2cc');
      R(22, 26, 3, 4, '#6a7694');
      R(26, 26, 3, 4, '#6a7694');

      /* 白手杖靠在琴键一端 */
      R(50, 17, 1, 9, '#ffffff');
      R(49, 17, 1, 9, '#c8d0e4');
      R(50, 26, 1, 1, '#e8636f');

      /* 孩子们的剪影 */
      R(5, 21, 4, 6, '#7c8caa');
      R(11, 22, 3, 5, '#8c9cba');
      R(3, 23, 3, 4, '#6c7c9a');
      R(15, 22, 3, 5, '#8494b2');

      /* 音符 */
      for(let i = 0; i < 4; i++){
        const nx = 44 + i * 3.4 + Math.sin(t * 1.2 + i) * 1.4;
        const ny = 8 - i * 1.6 - (t * 3 % 3);
        R(nx, ny, 1.4, 1.4, 'rgba(90,110,150,.5)');
        R(nx + 1.4, ny - 1.8, 0.8, 2.4, 'rgba(90,110,150,.5)');
      }
      break;
    }

    /* ===== 录音带 ===== */
    case 'tape':{
      R(0, 0, RW, RH, '#2b2d3d');
      R(0, 25, RW, 10, '#393b51');

      /* 窗边的光 */
      R(3, 2, 17, 14, 'rgba(255,242,206,.07)');
      R(4, 3, 15, 12, 'rgba(255,242,206,.05)');

      /* 窗 */
      R(50, 3, 9, 16, '#4c5470');
      R(51, 4, 7, 14, '#20283e');

      /* 桌上的花（文殊兰） */
      R(53, 5, 1, 8, '#8a9468');
      for(let i = 0; i < 3; i++){
        R(50 + i * 2, 3.5 - (i % 2), 2, 1.4, '#ffffff');
        R(51 + i * 2, 6, 1, 1, '#f0f4f8');
      }

      /* 录音机本体 */
      R(19, 14, 24, 12, '#a8a8b8');
      R(20, 15, 22, 8, '#c9c9d9');
      R(19, 25, 24, 1, '#8f8f9f');

      /* 磁带的两个卷轴（旋转动画） */
      const rot = (t * 1.3) % (Math.PI * 2);
      [[25, 19], [37, 19]].forEach(([cx2, cy2]) => {
        R(cx2 - 2.6, cy2 - 2.6, 5.2, 5.2, '#e9e9f1');
        R(cx2 - 1, cy2 - 1, 2, 2, '#8a8a9a');
        const dx2 = Math.cos(rot) * 1.9;
        const dy2 = Math.sin(rot) * 1.9;
        R(cx2 + dx2 - 0.6, cy2 + dy2 - 0.6, 1.2, 1.2, '#5a5a70');
      });

      /* 按钮 */
      R(23, 24, 3, 1, '#e08a8a');
      R(28, 24, 3, 1, '#9a9aa8');
      R(33, 24, 3, 1, '#9a9aa8');

      /* 耳机线 */
      for(let i = 0; i < 9; i++){
        R(43 + i * 0.9, 17 + Math.round(Math.sin(i / 1.8) * 2.4), 1, 1, '#6e6e84');
      }
      R(51, 16, 2, 3, '#6e6e84');

      /* 屏幕上的小光点 */
      for(let i = 0; i < 3; i++){
        const on = Math.floor(t * 2 + i) % 2 === 0;
        R(21.5 + i * 2, 16.5, 1, 1, on ? '#8fe3d0' : 'rgba(143,227,208,.3)');
      }
      break;
    }

    /* ===== 默认 ===== */
    default:{
      R(0, 0, RW, RH, '#1c2444');
      R(0, 24, RW, 11, '#2a3260');
      /* 一轮月 */
      R(45, 4, 8, 8, '#fdf4d2');
      R(46, 5, 5, 5, '#ffffff');
      break;
    }
  }
}

/** 画序章 / 尾声的插画 */
function drawStoryScene(id){
  paintScene(artCtx, id, nowSec);
}

/** 画结局页的插画 */
function drawEndArt(id){
  paintScene(endArtCtx, id, nowSec);
}

/* --------------------------------------------------------------
 * 5. 序章 / 尾声播放器
 * ------------------------------------------------------------ */
function startStory(pages, label, onFinish){
  storyPlayer.pages  = pages;
  storyPlayer.idx    = 0;
  storyPlayer.shown  = 0;
  storyPlayer.t      = 0;
  storyPlayer.running= true;
  storyPlayer.label  = label || '';
  storyPlayer.onFinish = onFinish || null;

  state = 'story';
  if(stLabelEl) stLabelEl.textContent = label || '';
  if(stTextEl)  stTextEl.textContent = '';
  buildStoryDots();
  showView(vStory);

  if(pages.length) drawStoryScene(pages[0].scene);
}

function buildStoryDots(){
  if(!stDotsEl) return;
  stDotsEl.innerHTML = '';
  storyPlayer.pages.forEach((_, i) => {
    const d = document.createElement('i');
    if(i === storyPlayer.idx) d.className = 'on';
    stDotsEl.appendChild(d);
  });
}

function updateStory(dt){
  if(!storyPlayer.running) return;
  const page = storyPlayer.pages[storyPlayer.idx];
  if(!page) return;
  if(storyPlayer.shown < page.text.length){
    storyPlayer.t += dt * 30;
    storyPlayer.shown = Math.min(page.text.length, Math.floor(storyPlayer.t));
  }
}

function drawStoryTextImpl(){
  if(!stTextEl) return;
  const page = storyPlayer.pages[storyPlayer.idx];
  if(!page) return;
  stTextEl.textContent = page.text.slice(0, storyPlayer.shown);
}

/** 空格 / 继续 / 点击：先补全文字，再翻页 */
function storyNext(){
  if(state !== 'story') return;
  const page = storyPlayer.pages[storyPlayer.idx];
  if(!page) return;

  if(storyPlayer.shown < page.text.length){
    storyPlayer.shown = page.text.length;
    drawStoryTextImpl();
    return;
  }
  if(storyPlayer.idx < storyPlayer.pages.length - 1){
    storyPlayer.idx++;
    storyPlayer.shown = 0;
    storyPlayer.t = 0;
    buildStoryDots();
    drawStoryTextImpl();
    drawStoryScene(storyPlayer.pages[storyPlayer.idx].scene);
    return;
  }
  finishStory();
}

function finishStory(){
  storyPlayer.running = false;
  const f = storyPlayer.onFinish;
  storyPlayer.onFinish = null;
  if(f) f();
}

/* 点击序章区域也能翻页（按钮除外） */
vStory.addEventListener('click', e => {
  if(e.target.closest('button')) return;
  storyNext();
});

/* --------------------------------------------------------------
 * 6. 对话框
 * ------------------------------------------------------------ */
let dlgQueue = [];
let dlgOnEnd = null;

function resetDialog(){
  dialogState.active = false;
  dialogState.text = '';
  dialogState.shown = 0;
  dialogState.t = 0;
  dialogState.hold = 0;
  dialogState.who = 'haru';
  dlgQueue = [];
  dlgOnEnd = null;
  if(dialogEl) dialogEl.classList.remove('show');
}

function drawPortrait(who){
  if(!portraitEl) return;
  const g = portraitEl.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, 16, 22);

  const set = (who === 'kai')
    ? sets.kai
    : (chapter && chapter.hair === 'short' ? sets.haruShort : sets.haruLong);

  if(set && set.down && set.down.base[0]) g.drawImage(set.down.base[0], 0, 0);
}

function showDialog(who, text, hold){
  if(!dialogEl) return;
  dialogState.active = true;
  dialogState.text = text;
  dialogState.shown = 0;
  dialogState.t = 0;
  dialogState.hold = hold;
  dialogState.who = who;

  dialogEl.classList.add('show');
  dialogEl.classList.toggle('buddy', who === 'kai');
  if(dlgNameEl) dlgNameEl.textContent = (who === 'haru') ? '小春' : '驱';
  if(dlgTextEl) dlgTextEl.textContent = '';
  drawPortrait(who);
}

function hideDialog(){
  dialogState.active = false;
  if(dialogEl) dialogEl.classList.remove('show');
}

function nextDialog(){
  if(dlgQueue.length === 0) return false;
  const d = dlgQueue.shift();
  showDialog(d.who, d.text, d.hold != null ? d.hold : 2.4);
  return true;
}

function advanceDialog(){
  if(!dialogState.active) return;
  if(dialogState.shown < dialogState.text.length){
    dialogState.shown = dialogState.text.length;
    if(dlgTextEl) dlgTextEl.textContent = dialogState.text;
    return;
  }
  dialogState.hold = 0;
}

function pumpDialog(dt){
  if(!dialogState.active) return;

  if(dialogState.shown < dialogState.text.length){
    dialogState.t += dt * CONFIG.dialogSpeed;
    const n = Math.min(dialogState.text.length, Math.floor(dialogState.t));
    if(n !== dialogState.shown){
      dialogState.shown = n;
      if(dlgTextEl) dlgTextEl.textContent = dialogState.text.slice(0, n);
    }
    return;
  }

  dialogState.hold -= dt;
  if(dialogState.hold > 0) return;

  if(nextDialog()) return;
  hideDialog();
  if(dlgOnEnd){ const f = dlgOnEnd; dlgOnEnd = null; f(); }
}

/* --------------------------------------------------------------
 * 7. 章节触发器
 * ------------------------------------------------------------ */
let firedTriggers = new Set();

function checkTriggers(){
  if(won || !started || !chapter) return;
  if(dialogState.active || dlgQueue.length > 0) return;
  if(state !== 'play') return;

  const rem = distField[gy * cols + gx];
  if(rem < 0) return;

  const c = {
    steps: steps,
    elapsed: elapsed,
    rem: rem,
    ratio: rem / startDist,
    bumps: bumps,
    deadEnds: wrongWays,
    idle: nowSec - lastMoveAt,
    fogSwallowed: fogSwallowed
  };

  const list = (STORY[chapter.id] && STORY[chapter.id].triggers) || [];
  for(const tr of list){
    if(firedTriggers.has(tr.id)) continue;
    if(!tr.when(c)) continue;
    firedTriggers.add(tr.id);
    showDialog(tr.who, tr.text, tr.hold);
    break;
  }
}

/* --------------------------------------------------------------
 * 8. 视图切换
 * ------------------------------------------------------------ */
function showView(v){
  [vTitle, vSelect, vStory, vEnd].forEach(x => {
    if(x) x.classList.toggle('active', x === v);
  });
  if(coverEl) coverEl.classList.add('show');
}

function hideCover(){
  if(coverEl) coverEl.classList.remove('show');
}

/* --------------------------------------------------------------
 * 9. 进度存档
 * ------------------------------------------------------------ */
const LS_PROG = 'tn_progress_v2';

let progress = loadProgress();
let selectedIdx = 0;

function loadProgress(){
  try{
    const raw = localStorage.getItem(LS_PROG);
    if(raw){
      const o = JSON.parse(raw);
      if(o && typeof o === 'object' && o.done) return o;
    }
  }catch(e){}
  return { done:{}, finaleDone:false };
}

function saveProgress(){
  try{ localStorage.setItem(LS_PROG, JSON.stringify(progress)); }catch(e){}
}

function markDone(id){
  progress.done[id] = true;
  saveProgress();
}
function isDone(id){ return !!progress.done[id]; }
function isUnlocked(idx){
  if(idx === 0) return true;
  return isDone(CHAPTERS[idx - 1].id);
}
function nextChapterIdx(){
  for(let i = 0; i < CHAPTERS.length; i++){
    if(!isDone(CHAPTERS[i].id)) return i;
  }
  return -1;
}

/* --------------------------------------------------------------
 * 10. 标题页
 * ------------------------------------------------------------ */
function refreshTitle(){
  const n = nextChapterIdx();
  const allDone = (n === -1);

  if(ttlTextEl){
    if(allDone){
      ttlTextEl.textContent = '所有的路都走完了。\n雾已经散了。';
    }else if(n === 0){
      ttlTextEl.textContent = '她眼前是一层白色的雾。\n\n她看不见路，\n所以她一步一步地把路摸出来。';
    }else if(CHAPTERS[n] && CHAPTERS[n].mode === 'kai'){
      ttlTextEl.textContent = '她走完了一段路。\n\n现在——\n换他走进雾里找她。';
    }else{
      ttlTextEl.textContent = '雾还没有散。\n她还在往前走。';
    }
  }

  const playBtn = $('btnPlay');
  if(playBtn){
    if(allDone){
      playBtn.textContent = progress.finaleDone ? '再 走 一 次' : '终 章';
      playBtn.className = 'btn gold';
    }else{
      playBtn.textContent = (n === 0) ? '开 始' : '继 续';
      playBtn.className = 'btn primary';
    }
  }

  const chBtn = $('btnChapters');
  if(chBtn){
    const cnt = CHAPTERS.filter(function(c){ return isDone(c.id); }).length;
    chBtn.disabled = (cnt === 0);
    chBtn.textContent = cnt
      ? '章 节 回 顾 (' + cnt + '/' + CHAPTERS.length + ')'
      : '章 节 回 顾';
  }

  if(ttlFootEl){
    const cnt = CHAPTERS.filter(function(c){ return isDone(c.id); }).length;
    ttlFootEl.textContent =
      '已完成 ' + cnt + ' / ' + CHAPTERS.length +
      (progress.finaleDone ? '　·　终章已看' : '') +
      '\n方向键 / WASD 移动　·　B 插书签　·　空格推进对话';
  }
}

function gotoTile(){
  state = 'title';
  resetDialog();
  showView(vTitle);
  refreshTitle();
}

/* --------------------------------------------------------------
 * 11. 章节列表
 * ------------------------------------------------------------ */
function renderChapterGrid(){
  if(!chGridEl) return;
  chGridEl.innerHTML = '';

  CHAPTERS.forEach((ch, i) => {
    const unlocked = isUnlocked(i);
    const done = isDone(ch.id);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ch-card' +
      (unlocked ? '' : ' locked') +
      (i === selectedIdx ? ' sel' : '');

    /* 未解锁只显示压暗空位，不剧透名字 */
    const title = unlocked ? (ch.label + ' · ' + ch.name) : (ch.label + ' · ? ? ?');

    b.innerHTML =
      '<span class="ch-t">' + title + '</span>' +
      '<span class="ch-d">' + (unlocked ? ch.desc : '还没有走到这里。') + '</span>' +
      (done ? '<span class="ch-n">✓</span>' : '');

    if(unlocked){
      b.addEventListener('click', () => {
        selectedIdx = i;
        renderChapterGrid();
      });
    }
    chGridEl.appendChild(b);
  });
}

/* --------------------------------------------------------------
 * 12. 进入章节
 * ------------------------------------------------------------ */
function enterChapter(idx){
  const ch = CHAPTERS[idx];
  if(!ch) return;

  chapter = ch;
  selectedIdx = idx;
  firedTriggers = new Set();

  resetDialog();
  startLevel(idx);

  /* 每次都播序章（保证能看到该章的插画） */
  startStory(
    STORY[ch.id].prologue,
    ch.label + ' · ' + ch.name,
    () => { hideCover(); state = 'play'; }
  );
}

/* --------------------------------------------------------------
 * 13. 通关
 * ------------------------------------------------------------ */
function onWin(){
  if(won) return;
  won = true;
  held.length = 0;
  winOffX = (chapter.mode === 'kai') ? 0.34 : -0.34;
  playerDir = (chapter.mode === 'kai') ? 'left' : 'right';

  revealAround(goalX, goalY, chapter.revealRadius + 1.2, nowSec);
  revealAround(gx, gy, chapter.revealRadius + 1.2, nowSec);
  burstParticles(goalX, goalY, 54);

  /* 「谈恋爱」由通关触发 */
  if(chapter.completes && chapter.completes.indexOf('love') >= 0){
    bucketDone.love = true;
    try{ localStorage.setItem('tn_bucket', JSON.stringify(bucketDone)); }catch(e){}
    rebuildBucketUI();
  }

  dlgQueue = STORY[chapter.id].ending.slice();
  dlgOnEnd = () => {
    markDone(chapter.id);
    showChapterEnding();
  };
  nextDialog();
}

/** 章节尾声 → 结算页 */
function showChapterEnding(){
  const ep = STORY[chapter.id].epilogue;
  const pages = [{ scene: ep.scene, text: ep.text }];

  let title = ep.title;
  let text  = ep.text;
  let artScene = ep.scene;

  /* 第三章之后，接上结局 A */
  if(chapter.id === 'c3'){
    pages.push({ scene:'fireworks', text: ENDING_A.text });
    title = ENDING_A.title;
    text  = '她走完了那三段路。\n\n剩下的，交给时间。';
    artScene = 'fireworks';
    progress.endingAShown = true;
    saveProgress();
  }

  startStory(pages, '尾 声', () => {
    state = 'ending';
    showEndingView(title, text, artScene, buildEndingSubtitle());
  });
}

function buildEndingSubtitle(){
  return '用时 ' + fmtTime(elapsed) + '\n' +
         effortSummary() + '\n' +
         '书签用掉 ' + (chapter.bookmarkMax - bookmarksLeft) + ' 张';
}

function showEndingView(title, text, artScene, sub){
  if(endTitleEl) endTitleEl.textContent = title;
  if(endTextEl)  endTextEl.textContent  = text;
  if(endStatsEl) endStatsEl.textContent = sub || '';
  if(artScene)   drawEndArt(artScene);

  if(endUnlockEl){
    const idx = CHAPTERS.indexOf(chapter);
    if(idx >= 0 && idx + 1 < CHAPTERS.length){
      const nx = CHAPTERS[idx + 1];
      endUnlockEl.textContent = '下一章：' + nx.label + ' · ' + nx.name;
    }else{
      endUnlockEl.textContent = '★ 四条路都走完了。回到标题，「终章」已经解锁。';
    }
  }

  showView(vEnd);
}
/* --------------------------------------------------------------
 * 14. 终章 B：录音带
 * ------------------------------------------------------------ */
function playFinale(){
  startStory(FINALE.pages, FINALE.label, () => {
    progress.finaleDone = true;
    saveProgress();

    state = 'ending';
    showEndingView(
      FINALE.epilogue.title,
      FINALE.epilogue.text,
      FINALE.epilogue.scene,
      '—— 终章 · 完 ——'
    );

    const again = $('btnAgain');
    if(again) again.style.display = 'none';
  });
}

/* --------------------------------------------------------------
 * 15. 事件绑定
 * ------------------------------------------------------------ */

/* 开始 / 继续 / 终章 */
$('btnPlay').addEventListener('click', () => {
  initAudio();
  const n = nextChapterIdx();

  if(n === -1){
    if(!progress.finaleDone){
      playFinale();
    }else{
      /* 全部看完，从头再来 */
      progress = { done:{}, finaleDone:false };
      saveProgress();
      enterChapter(0);
    }
    return;
  }

  enterChapter(n);
});

/* 章节回顾 */
$('btnChapters').addEventListener('click', () => {
  initAudio();
  state = 'select';
  selectedIdx = Math.max(0, nextChapterIdx());

  if(selTitleEl) selTitleEl.textContent = '章 节 回 顾';
  if(selDescEl)  selDescEl.textContent =
    '走过的路可以再走一次。\n每一条路，她都是第一次走。';

  renderChapterGrid();
  showView(vSelect);
});

$('btnSelBack').addEventListener('click', gotoTile);

$('btnSelGo').addEventListener('click', () => {
  if(!isUnlocked(selectedIdx)){
    if(selDescEl) selDescEl.textContent = '这一章还没有解锁。\n先把前面的路走完吧。';
    return;
  }
  enterChapter(selectedIdx);
});

/* 序章按钮 */
$('btnNext').addEventListener('click', storyNext);
$('btnSkip').addEventListener('click', finishStory);

/* 结算页 */
$('btnToTitle').addEventListener('click', () => {
  const again = $('btnAgain');
  if(again) again.style.display = '';
  gotoTile();
});

$('btnAgain').addEventListener('click', () => {
  initAudio();
  enterChapter(Math.max(0, selectedIdx));
});

/* 重置进度 */
$('btnReset').addEventListener('click', () => {
  progress = { done:{}, finaleDone:false };
  saveProgress();
  bucketDone = {};
  try{
    localStorage.removeItem('tn_bucket');
    localStorage.removeItem(LS_PROG);
  }catch(e){}
  rebuildBucketUI();
  selectedIdx = 0;
  refreshTitle();
});

/* --------------------------------------------------------------
 * 16. 把实现接上 game.js 的钩子，然后启动
 * ------------------------------------------------------------ */
HOOK.showDialog     = showDialog;
HOOK.checkTriggers  = checkTriggers;
HOOK.pumpDialog     = pumpDialog;
HOOK.updateStory    = updateStory;
HOOK.drawStoryScene = drawStoryScene;
HOOK.drawStoryText  = drawStoryTextImpl;

gotoTile();