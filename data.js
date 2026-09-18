/* ═══════════════════════════════════════════════════════════
   雙個展 · 王國召 × 張琳
   畫布 4000 × 6700，分為上下兩個展廳：
     上廳 (y 200–2700)   王國召 · 在場的缺席     16 件 · 區 1–3
     中縫 (y 3080)       展覽序廳
     下廳 (y 3400–6600)  張琳 · 時間的印跡       21 件 · 區 4–7
   ═══════════════════════════════════════════════════════════ */

const STAGE = { w: 4000, h: 6700 };

/* ── 展覽序廳 ──────────────────────────────────────────── */
const HUB = { pos: [2000, 3080], scale: 0.5 };

/* ── 兩位藝術家 ────────────────────────────────────────── */
const ARTISTS = [
  {
    id: 'wang',
    zh: '王国召',
    en: 'Wang Guozhao',
    title: '在場的缺席',
    titleEn: 'The Presence of Absence',
    color: '#d4a574',
    zones: [1, 2, 3],
    pos: [2000, 1400],
    scale: 0.5
  },
  {
    id: 'zhang',
    zh: '张琳',
    en: 'Zhang Lin',
    title: '時間的印跡',
    titleEn: 'Traces of Time',
    color: '#d1738f',
    zones: [4, 5, 6, 7],
    pos: [2000, 4700],
    scale: 0.5
  }
];

const ARTWORKS = [
  /* ═════════ 王國召 ═════════════════════════════════════ */

  // ── 壹 · 混沌 (Zone 1) — 圍繞中心 (700, 950) ──
  {
    id: 'chaos',
    artist: 'wang',
    zh: '混沌',
    en: 'Chaos',
    year: '2022',
    medium: '布面油彩（三聯作）',
    size: '55 × 112 cm × 3',
    note: '黃與黑交織成煙霧，在還未成形之前，一切都在發生。混沌不是無序，而是所有秩序尚未找到自己的位置。',
    image: 'img-art-01-chaos.jpg',
    zone: 1,
    pos: [700, 1300],
    scale: 1.5
  },
  {
    id: 'light-2',
    artist: 'wang',
    zh: '光之二',
    en: 'The Light No. 2',
    year: '2021',
    medium: '布面油彩',
    size: '76.5 × 126 cm',
    note: '當一切都被黑吞沒，仍然有一線光從內部滲出——那是記憶的痕跡，也是對將來的卑微祈求。',
    image: 'img-art-03-light-2.jpg',
    zone: 1,
    pos: [180, 750],
    scale: 1
  },
  {
    id: 'to-the-end',
    artist: 'wang',
    zh: '至盡頭',
    en: 'To The End',
    year: '2018',
    medium: '紙本獨幅版畫',
    size: '60 × 80 cm',
    note: '在版畫被刮去又留下的痕跡之間，時間本身成為材料。不是走向盡頭，而是與盡頭同行。',
    image: 'img-art-04-to-the-end.jpg',
    zone: 1,
    pos: [1280, 750],
    scale: 1
  },
  {
    id: 'paradise-lost',
    artist: 'wang',
    zh: '失樂園',
    en: 'Paradise Lost',
    year: '2015',
    medium: '紙本綜合材料',
    size: '60 × 80 cm',
    note: '樂園失落之後，剩下的不是荒蕪，而是對於曾經在場的緬懷。藍與金的衝突，是記憶與遺忘的對話。',
    image: 'img-art-06-paradise-lost.jpg',
    zone: 1,
    pos: [400, 1500],
    scale: 1
  },
  {
    id: 'blurred-form-2',
    artist: 'wang',
    zh: '模糊的形狀之二',
    en: 'Blurred Form No. 2',
    year: '2016',
    medium: '紙本水彩',
    size: '60 × 80 cm',
    note: '形狀拒絕被辨認。它就那樣浮在紙上，等待觀看者的眼睛也願意一同模糊下來。',
    image: 'img-art-12-blurred-form-2.jpg',
    zone: 1,
    pos: [1100, 1500],
    scale: 1
  },
  {
    id: 'far-away',
    artist: 'wang',
    zh: '遠方',
    en: 'Far Away',
    year: '2023',
    medium: '紙本水彩',
    size: '55 × 35 cm',
    note: '遠方不是地理名詞，而是時間——是尚未發生的將來，是再也回不去的從前。',
    image: 'img-art-15-far-away.jpg',
    zone: 1,
    pos: [700, 400],
    scale: 1
  },

  // ── 貳 · 形態 (Zone 2) — 圍繞中心 (3300, 1100) ──
  {
    id: 'gaze',
    artist: 'wang',
    zh: '凝視',
    en: 'Gaze',
    year: '2020',
    medium: '紙本木炭',
    size: '75 × 105 cm',
    note: '人背對著海，背對著觀者，而我們仍然想像她在被什麼所注視——那不是眼睛，是光，是風，是時光。',
    image: 'img-art-05-gaze.jpg',
    zone: 2,
    pos: [3300, 1100],
    scale: 1
  },
  {
    id: 'far',
    artist: 'wang',
    zh: '遠',
    en: 'Far',
    year: '2019',
    medium: '紙本木炭',
    size: '35 × 55 cm',
    note: '一隻手伸向遠方，另一隻手正在收回。兩者之間的距離，就是存在的全部。',
    image: 'img-art-02-far.jpg',
    zone: 2,
    pos: [3850, 500],
    scale: 1
  },
  {
    id: 'form-8',
    artist: 'wang',
    zh: '形態之八',
    en: 'Form No. 8',
    year: '2020',
    medium: '紙本木炭',
    size: '35 × 35 cm',
    note: '沉睡的、不完整的、似乎被什麼啃噬過的形狀。它不要求被理解——它只是曾經在場。',
    image: 'img-art-07-form-8.jpg',
    zone: 2,
    pos: [3850, 1100],
    scale: 1
  },
  {
    id: 'form-series-1',
    artist: 'wang',
    zh: '形態系列之一',
    en: 'Forms Series No. 1',
    year: '2020',
    medium: '紙本木炭',
    size: '35 × 35 cm',
    note: '球狀的身體生出細弱的腿，像是剛剛降臨的某種生物，笨拙地學習站立的可能。',
    image: 'img-art-08-form-series-1.jpg',
    zone: 2,
    pos: [3650, 1500],
    scale: 1
  },
  {
    id: 'form-series-2',
    artist: 'wang',
    zh: '形態系列之二',
    en: 'Forms Series No. 2',
    year: '2020',
    medium: '紙本木炭',
    size: '35 × 35 cm',
    note: '蒙著頭的人，或者剛從蛋裡出來的什麼。姿態裡帶著羞怯，也帶著對世界的首次試探。',
    image: 'img-art-09-form-series-2.jpg',
    zone: 2,
    pos: [2800, 700],
    scale: 1
  },
  {
    id: 'form-series-3',
    artist: 'wang',
    zh: '形態系列之三',
    en: 'Forms Series No. 3',
    year: '2020',
    medium: '紙本木炭',
    size: '35 × 35 cm',
    note: '尖耳、蛙腿、捲曲的尾巴——這是神話裡的某種生物，還是夢裡的某個自己？',
    image: 'img-art-10-form-series-3.jpg',
    zone: 2,
    pos: [3800, 1700],
    scale: 1
  },

  // ── 參 · 山海 (Zone 3) — 圍繞中心 (2000, 2200) ──
  {
    id: 'forest-1',
    artist: 'wang',
    zh: '森林之一',
    en: 'Forest No. 1',
    year: '2023',
    medium: '紙本獨幅版畫',
    size: '55 × 35 cm',
    note: '一片深藍，被白色的雨絲刮破。森林從未如此安靜，彷彿所有的樹都在屏息。',
    image: 'img-art-11-forest-1.jpg',
    zone: 3,
    pos: [1450, 2100],
    scale: 1
  },
  {
    id: 'wilderness',
    artist: 'wang',
    zh: '荒原',
    en: 'Wilderness',
    year: '2020',
    medium: '紙本木口版畫',
    size: '60 × 80 cm',
    note: '一個女人站在荒原的中央，雲層從她背後翻湧上來。戲劇性的天空下，她是唯一仍在呼吸的東西。',
    image: 'img-art-13-wilderness.jpg',
    zone: 3,
    pos: [2550, 2350],
    scale: 1.3
  },
  {
    id: 'viewing-sea',
    artist: 'wang',
    zh: '觀海',
    en: 'Viewing the Sea',
    year: '2022',
    medium: '紙本拼貼',
    size: '56.5 × 96 cm',
    note: '黑色、藍色、綠色、桃色——四塊材料拼成一片海。你從未真正看見海，你只是拼貼出你想像的海。',
    image: 'img-art-14-viewing-sea.jpg',
    zone: 3,
    pos: [1400, 2500],
    scale: 1
  },
  {
    id: 'path-to-sea-5',
    artist: 'wang',
    zh: '通向海之五',
    en: 'Path to the Sea No. 5',
    year: '2023',
    medium: '紙本水彩',
    size: '60 × 80 cm',
    note: '綠的、黃的、藍的、灰的。色塊之間似乎藏著一條路——誰說那一定是通向海？也可能是通向自己。',
    image: 'img-art-16-path-to-sea-5.jpg',
    zone: 3,
    pos: [2600, 1900],
    scale: 1.2
  },

  /* ═════════ 張琳 ═══════════════════════════════════════ */

  // ── 肆 · 印跡 (Zone 4) — 圍繞中心 (975, 4000) ──
  {
    id: 'zl-form-1',
    artist: 'zhang',
    zh: '形式印跡系列之一',
    en: 'Traces of Form No. 1',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '色塊彼此疊印，邊緣互相滲透。所謂形式，不過是顏色在紙上停留過的證據。',
    image: 'img-zl-01-form-trace-1.jpg',
    zone: 4,
    pos: [450, 3750],
    scale: 1
  },
  {
    id: 'zl-form-2',
    artist: 'zhang',
    zh: '形式印跡系列之二',
    en: 'Traces of Form No. 2',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '橙與絳在紙上交錯，像黃昏落在牆上的幾何。每一次套色，都是一個不可撤回的決定。',
    image: 'img-zl-02-form-trace-2.jpg',
    zone: 4,
    pos: [1000, 3660],
    scale: 1
  },
  {
    id: 'zl-form-3',
    artist: 'zhang',
    zh: '形式印跡系列之三',
    en: 'Traces of Form No. 3',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '深藍與琥珀彼此逼近，在交界處生出第三種顏色——那是版與版之間的呼吸。',
    image: 'img-zl-03-form-trace-3.jpg',
    zone: 4,
    pos: [1550, 3800],
    scale: 1
  },
  {
    id: 'zl-transparent-1',
    artist: 'zhang',
    zh: '透明印跡系列之一',
    en: 'Transparent Traces No. 1',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '桃紅漫過整張紙，只在一側留下幾方半透明的沉靜。透明不是空無，而是讓底下的東西繼續說話。',
    image: 'img-zl-04-transparent-trace-1.jpg',
    zone: 4,
    pos: [400, 4190],
    scale: 1
  },
  {
    id: 'zl-transparent-2',
    artist: 'zhang',
    zh: '透明印跡系列之二',
    en: 'Transparent Traces No. 2',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '重疊處的顏色最誠實：它同時記得覆蓋它的，和被它覆蓋的。',
    image: 'img-zl-05-transparent-trace-2.jpg',
    zone: 4,
    pos: [950, 4290],
    scale: 1
  },
  {
    id: 'zl-untitled-magenta',
    artist: 'zhang',
    zh: '無題（桃紅）',
    en: 'Untitled (Magenta)',
    year: '2026',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '螢光的桃紅像一面不肯安靜的牆，方塊上排列的小圓點，是落在牆上還未乾的雨。',
    image: 'img-zl-06-untitled-magenta.jpg',
    zone: 4,
    pos: [1500, 4200],
    scale: 1
  },

  // ── 伍 · 日月 (Zone 5) — 圍繞中心 (3200, 4200) ──
  {
    id: 'zl-sun-moon-1',
    artist: 'zhang',
    zh: '日之東與月之西（一）',
    en: 'East of the Sun, West of the Moon No. 1',
    year: '',
    medium: '紙本版畫',
    size: '60 × 80 cm',
    note: '四枚渾圓的形體互相穿過，灰、藍與黑在交疊處變得更深。它們像月，也像被水磨過的石。',
    image: 'img-zl-07-sun-moon-1.jpg',
    zone: 5,
    pos: [2720, 3750],
    scale: 1
  },
  {
    id: 'zl-sun-moon-2',
    artist: 'zhang',
    zh: '日之東與月之西（二）',
    en: 'East of the Sun, West of the Moon No. 2',
    year: '',
    medium: '紙本版畫',
    size: '60 × 80 cm',
    note: '懸在空白之中的三枚形體，表面佈滿斑駁的紋理——那是月亮的背面，還是顯微鏡下的某處？',
    image: 'img-zl-08-sun-moon-2.jpg',
    zone: 5,
    pos: [3250, 3800],
    scale: 1
  },
  {
    id: 'zl-sun-moon-3',
    artist: 'zhang',
    zh: '日之東與月之西（三）',
    en: 'East of the Sun, West of the Moon No. 3',
    year: '',
    medium: '紙本版畫',
    size: '60 × 80 cm',
    note: '暗紅的地平線上浮著兩顆星體。光從側面過來，卻照不亮它們的內部。',
    image: 'img-zl-09-sun-moon-3.jpg',
    zone: 5,
    pos: [3780, 3730],
    scale: 1
  },
  {
    id: 'zl-sun-moon-8',
    artist: 'zhang',
    zh: '日之東與月之西（八）',
    en: 'East of the Sun, West of the Moon No. 8',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '灼熱的紅裡浮著兩枚冷的月。日與月本不相見，卻在同一張紙上同時在場。',
    image: 'img-zl-10-sun-moon-8.jpg',
    zone: 5,
    pos: [2730, 4160],
    scale: 1
  },
  {
    id: 'zl-sun-moon-east-3',
    artist: 'zhang',
    zh: '日東與月西（三）',
    en: 'Sun East, Moon West No. 3',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '橄欖綠的圓在藍色的天裡緩慢排列，墨點如星屑四散。這是一場沒有軌道的運行。',
    image: 'img-zl-11-sun-moon-east-3.jpg',
    zone: 5,
    pos: [3255, 4210],
    scale: 1
  },
  {
    id: 'zl-sun-moon-east-5',
    artist: 'zhang',
    zh: '日東與月西（五）',
    en: 'Sun East, Moon West No. 5',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '黃色的光底下，圓形彼此推擠、重疊。飛濺的墨點記錄了手當時的速度。',
    image: 'img-zl-12-sun-moon-east-5.jpg',
    zone: 5,
    pos: [3775, 4140],
    scale: 1
  },
  {
    id: 'zl-sun-moon-main',
    artist: 'zhang',
    zh: '日東月西',
    en: 'Sun East, Moon West',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '一群青黃的圓聚在紙上，輕得像要浮起來。左上角那枚灰色的，是唯一還記得重量的。',
    image: 'img-zl-13-sun-moon-main.jpg',
    zone: 5,
    pos: [3000, 4570],
    scale: 1
  },

  // ── 陸 · 時間 (Zone 6) — 圍繞中心 (2500, 5750) ──
  {
    id: 'zl-time-2',
    artist: 'zhang',
    zh: '時間與痕跡（二）',
    en: 'Time and Traces No. 2',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '一片藍裡，有人用線、用點、用圈標記過。時間不會留下痕跡，是我們替它留下的。',
    image: 'img-zl-14-time-trace-2.jpg',
    zone: 6,
    pos: [1950, 5580],
    scale: 1
  },
  {
    id: 'zl-time-3',
    artist: 'zhang',
    zh: '時間與痕跡（三）',
    en: 'Time and Traces No. 3',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '紅與赭之間浮著無數小方塊，像某種未被破譯的日曆。右側那個白色的圈，是還沒填上的今天。',
    image: 'img-zl-15-time-trace-3.jpg',
    zone: 6,
    pos: [2500, 5490],
    scale: 1
  },
  {
    id: 'zl-time-5',
    artist: 'zhang',
    zh: '時間與痕跡（五）',
    en: 'Time and Traces No. 5',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '黑底上的綠方塊四散如窗。中央那團灰紫的形體正在緩慢離開，留下的是它待過的位置。',
    image: 'img-zl-16-time-trace-5.jpg',
    zone: 6,
    pos: [3050, 5630],
    scale: 1
  },
  {
    id: 'zl-time-6',
    artist: 'zhang',
    zh: '時間與痕跡（六）',
    en: 'Time and Traces No. 6',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '近乎全黑的紙面，只剩兩處還亮著。那不是光，是記憶在黑暗裡反射的一點餘溫。',
    image: 'img-zl-17-time-trace-6.jpg',
    zone: 6,
    pos: [2250, 6000],
    scale: 1
  },
  {
    id: 'zl-time-11',
    artist: 'zhang',
    zh: '時間的痕跡系列（十一）',
    en: 'Traces of Time Series No. 11',
    year: '',
    medium: '紙本絲網版畫',
    size: '60 × 80 cm',
    note: '褐、絳、靛三種時間並置。中間的方塊上排著整齊的圓點，像被一一數過的日子。',
    image: 'img-zl-18-time-trace-11.jpg',
    zone: 6,
    pos: [2800, 6050],
    scale: 1
  },

  // ── 柒 · 色域 (Zone 7) — 圍繞中心 (800, 5750) ──
  {
    id: 'zl-field-1',
    artist: 'zhang',
    zh: '無題（藍黃）之一',
    en: 'Untitled (Blue and Yellow) No. 1',
    year: '',
    medium: '紙本絲網版畫',
    size: '',
    note: '深藍的筆觸圍成一個框，把所有顏色都留在裡面。框不是為了限制，是為了讓它們彼此相認。',
    image: 'img-zl-19-color-field-1.jpg',
    zone: 7,
    pos: [620, 5600],
    scale: 1
  },
  {
    id: 'zl-field-2',
    artist: 'zhang',
    zh: '無題（藍黃）之二',
    en: 'Untitled (Blue and Yellow) No. 2',
    year: '',
    medium: '紙本絲網版畫',
    size: '',
    note: '一個綠色的圓穿過整個畫面，藍與黃在它身後各自分開。這是色域之間的一次讓路。',
    image: 'img-zl-20-color-field-2.jpg',
    zone: 7,
    pos: [1160, 5780],
    scale: 1
  },
  {
    id: 'zl-field-3',
    artist: 'zhang',
    zh: '無題（藍黃）之三',
    en: 'Untitled (Blue and Yellow) No. 3',
    year: '',
    medium: '紙本絲網版畫',
    size: '',
    note: '青色的圓沉在左邊，像一口井。其餘的顏色都圍著它，維持著剛剛好的距離。',
    image: 'img-zl-21-color-field-3.jpg',
    zone: 7,
    pos: [660, 6080],
    scale: 1
  }
];

const ZONES = {
  1: {
    name: '壹 · 混沌',
    en: 'Chaos / Atmosphere',
    color: '#d4a574',
    grad: 'lineGrad1',
    artist: 'wang',
    center: [700, 950],
    label: [700, 1800],
    scale: 0.85
  },
  2: {
    name: '貳 · 形態',
    en: 'Forms / Flesh',
    color: '#7a9eb5',
    grad: 'lineGrad2',
    artist: 'wang',
    center: [3300, 1100],
    label: [3300, 1950],
    scale: 0.85
  },
  3: {
    name: '參 · 山海',
    en: 'Wilderness / Sea',
    color: '#a8b89d',
    grad: 'lineGrad3',
    artist: 'wang',
    center: [2000, 2200],
    label: [2000, 2600],
    scale: 0.95
  },
  4: {
    name: '肆 · 印跡',
    en: 'Imprints / Overlay',
    color: '#d1738f',
    grad: 'lineGrad4',
    artist: 'zhang',
    center: [975, 3975],
    label: [975, 4800],
    scale: 0.78
  },
  5: {
    name: '伍 · 日月',
    en: 'Sun and Moon',
    color: '#c3c455',
    grad: 'lineGrad5',
    artist: 'zhang',
    center: [3250, 4150],
    label: [3250, 5120],
    scale: 0.66
  },
  6: {
    name: '陸 · 時間',
    en: 'Time and Traces',
    color: '#8d7fc7',
    grad: 'lineGrad6',
    artist: 'zhang',
    center: [2500, 5770],
    label: [2500, 6450],
    scale: 0.84
  },
  7: {
    name: '柒 · 色域',
    en: 'Field and Gesture',
    color: '#58b6c9',
    grad: 'lineGrad7',
    artist: 'zhang',
    center: [890, 5840],
    label: [890, 6450],
    scale: 0.90
  }
};
