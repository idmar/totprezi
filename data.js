/* ═══════════════════════════════════════════════════════════
   王國召 · 16 件作品數據
   畫布 4000 × 2800，作品排布在三個主題區。
   ═══════════════════════════════════════════════════════════ */

const ARTWORKS = [
  // ── 壹 · 混沌 (Zone 1) — top-left, 圍繞中心 (700, 750) ──
  {
    id: 'chaos',
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

  // ── 貳 · 形態 (Zone 2) — top-right, 圍繞中心 (3300, 750) ──
  {
    id: 'gaze',
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

  // ── 參 · 山海 (Zone 3) — bottom-center, 圍繞中心 (2000, 2200) ──
  {
    id: 'forest-1',
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
];

const ZONES = {
  1: {
    name: '壹 · 混沌',
    en: 'Chaos / Atmosphere',
    color: '#d4a574',
    center: [700, 950]
  },
  2: {
    name: '貳 · 形態',
    en: 'Forms / Flesh',
    color: '#7a9eb5',
    center: [3300, 1100]
  },
  3: {
    name: '參 · 山海',
    en: 'Wilderness / Sea',
    color: '#a8b89d',
    center: [2000, 2200]
  }
};
