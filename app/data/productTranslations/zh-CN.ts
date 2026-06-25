export type VariantTranslation = {
  name: string
  material: string
}

export type ProductTranslation = {
  name: string
  tagline: string
  description: string
  category: string
  dimensions: string
  variants: Record<string, VariantTranslation>
}

export const zhCNProductTranslations: Record<string, ProductTranslation> = {
  '1': {
    name: '伊姆斯休闲椅与脚凳',
    tagline: 'Charles & Ray Eames — 现代舒适的标志',
    description:
      '1956 年问世、由 Vitra 生产的伊姆斯休闲椅，将曲木壳体、细腻皮革软包与压铸铝底座融为一体。配套脚凳完整呈现这一在总裁办公室与客厅中备受推崇的休闲系统。',
    category: '座椅',
    dimensions: '椅 宽 83 × 深 85–109 × 高 99 cm · 脚凳 宽 66 × 深 56 × 高 41 cm',
    variants: {
      '1a': { name: '紫檀 / 黑色皮革', material: '紫檀夹板 + 皮革' },
      '1b': { name: '胡桃木 / MCL 皮革', material: '胡桃木夹板 + MCL 皮革' },
    },
  },
  '2': {
    name: 'LC2 三人沙发',
    tagline: 'Le Corbusier — 钢管与建筑感软垫',
    description:
      'Cassina LC2 沙发凝练了 Le Corbusier、Pierre Jeanneret 与 Charlotte Perriand 于 1928 年提出的镀铬钢管框架与厚实矩形软垫，是国际主义风格座椅的结构典范。',
    category: '座椅',
    dimensions: '宽 180 × 深 72 × 高 70 cm',
    variants: {
      '2a': { name: '镀铬 / 黑色皮革', material: '钢材 + 全粒面皮革' },
      '2b': { name: '镀铬 / 米色皮革', material: '钢材 + 全粒面皮革' },
    },
  },
  '3': {
    name: 'Arco 落地灯',
    tagline: 'Achille & Pier Giacomo Castiglioni · Flos',
    description:
      '1962 年推出的 Arco 以卡拉拉大理石底座支撑抛光不锈钢弧形灯臂，无需吊顶即可提供餐桌上方照明。可调不锈钢反射罩六十余年来照亮了无数餐厅与客厅。',
    category: '灯饰',
    dimensions: '高 213–240 × 延伸 200 cm · 底座 Ø 22 cm',
    variants: {
      '3a': { name: '不锈钢 / 大理石底座', material: '钢材 + 卡拉拉大理石' },
    },
  },
  '4': {
    name: 'Tufty-Time 15 沙发',
    tagline: 'Patricia Urquiola · B&B Italia',
    description:
      'Tufty-Time 以模块沙发形式重新诠释经典拉扣软包，座深宽裕、外套可拆洗。圆润轮廓与灵活组合，使其成为豪宅与精品酒店中的当代标志。',
    category: '座椅',
    dimensions: '宽 285 × 深 102 × 高 68 cm（15 模块）',
    variants: {
      '4a': { name: '象牙圈圈纱', material: '圈圈纱面料' },
      '4b': { name: '石墨色丝绒', material: '丝绒' },
    },
  },
  '5': {
    name: 'Symbiosis 餐边柜',
    tagline: 'Poliform — 建筑感收纳',
    description:
      'Poliform Symbiosis 餐边柜以齐平柜门、开放格与精致木皮呈现整体雕塑感。缓冲铰链与可选内置灯带，适合需要「收纳即陈设」的用餐空间。',
    category: '收纳',
    dimensions: '宽 220 × 深 50 × 高 75 cm',
    variants: {
      '5a': { name: '橡木 / 石墨玻璃', material: '橡木贴皮 + 玻璃' },
    },
  },
  '6': {
    name: '诺古奇茶几',
    tagline: 'Isamu Noguchi · Herman Miller',
    description:
      'Noguchi 于 1948 年将自由形态玻璃台面与受日本Bracket结构启发的实木底座结合，成为馆藏级设计走入日常的经典——雕塑感、平衡感，难以被真正替代。',
    category: '桌几',
    dimensions: '宽 128 × 深 93 × 高 40 cm',
    variants: {
      '6a': { name: '胡桃木 / 玻璃', material: '胡桃木 + 钢化玻璃' },
    },
  },
  '7': {
    name: 'USM Haller 储物系统',
    tagline: '瑞士模块化精工，自 1965 年',
    description:
      'USM Haller 以球节连接粉末涂层钢板与镀铬黄铜接头，可从低柜扩展至整墙书柜。经典 USM 配色下自由配置门、抽屉与翻板模块，历久弥新。',
    category: '收纳',
    dimensions: '宽 150 × 深 35 × 高 74 cm（3 × 3 模块）',
    variants: {
      '7a': { name: '纯白 / 镀铬', material: '钢材 + 镀铬' },
      '7b': { name: '炭灰 / 镀铬', material: '钢材 + 镀铬' },
    },
  },
  '8': {
    name: 'Alys 平台床架',
    tagline: 'Maxalto — 卧室的静谧奢华',
    description:
      'Maxalto Alys 以缝线皮革软包头板搭配低平台实木床架，无需箱簧。可选床下储物与内置灯光，轮廓克制，呈现酒店式睡眠氛围。',
    category: '卧室',
    dimensions: 'Queen：宽 160 × 长 210 cm',
    variants: {
      '8a': { name: 'Queen / 灰鸽皮革', material: '橡木 + 皮革' },
      '8b': { name: 'King / 灰鸽皮革', material: '橡木 + 皮革' },
    },
  },
  '9': {
    name: 'PH 5 吊灯',
    tagline: 'Poul Henningsen · Louis Poulsen',
    description:
      '1958 年问世的 PH 5 以多层灯罩实现无眩光漫射照明。彩色顶盖与旋压铝反射罩，使其成为从哥本哈根到东京餐厅中的经典之选。',
    category: '灯饰',
    dimensions: '直径 50 × 高 26.7 cm',
    variants: {
      '9a': { name: '经典白', material: '旋压铝' },
      '9b': { name: '橙色调', material: '旋压铝' },
    },
  },
  '10': {
    name: 'Vitra Home Desk 书桌',
    tagline: 'Vitra — 理线有序的书写桌面',
    description:
      'Vitra Home Desk 以宽大橡木贴面搭配烤漆钢架、内置线槽与抽屉模块，为紧凑都市书房而生——同一张桌面兼顾视频会议、手绘草稿与文件收纳。',
    category: '办公',
    dimensions: '宽 142 × 深 65 × 高 74 cm',
    variants: {
      '10a': { name: '橡木 / 浅灰', material: '橡木贴皮 + 钢材' },
      '10b': { name: '橡木 / 石墨灰', material: '橡木贴皮 + 钢材' },
    },
  },
}
