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
    name: '北欧休闲椅',
    tagline: '为现代生活雕塑般的舒适',
    description: '手工白蜡木框架搭配优质羊毛软包。在北欧极简与人体工学支撑之间取得平衡的点睛之作。',
    category: '座椅',
    dimensions: '宽 78 × 深 82 × 高 72 cm',
    variants: {
      '1a': { name: '本色 / 羊毛灰', material: '白蜡木 + 羊毛' },
      '1b': { name: '胡桃木 / 羊毛炭灰', material: '胡桃木 + 羊毛' },
    },
  },
  '2': {
    name: '地平线餐桌',
    tagline: '围坐于匠心橡木之上',
    description: '实心欧洲橡木餐桌，锥形桌腿与缎面饰面。舒适容纳六人，空间从容不迫。',
    category: '桌几',
    dimensions: '宽 200 × 深 95 × 高 75 cm',
    variants: {
      '2a': { name: '本色橡木', material: '橡木' },
      '2b': { name: '烟熏橡木', material: '橡木' },
    },
  },
  '3': {
    name: '弧形落地灯',
    tagline: '雕塑光影，柔和漫射',
    description: '拉丝黄铜弧形灯杆搭配亚麻灯罩。可调高度灯臂为空间投射温暖环境光。',
    category: '灯饰',
    dimensions: '高 180 × 延伸 120 cm',
    variants: {
      '3a': { name: '黄铜 / 亚麻', material: '黄铜 + 亚麻' },
    },
  },
  '4': {
    name: '云朵模块沙发',
    tagline: '轻松组合的模块奢华',
    description: '三件式模块沙发，深座设计且外套可拆洗。灵活适配各种房间布局。',
    category: '座椅',
    dimensions: '宽 280 × 深 95 × 高 68 cm',
    variants: {
      '4a': { name: '象牙圈圈纱', material: '圈圈纱' },
      '4b': { name: '石板色丝绒', material: '丝绒' },
    },
  },
  '5': {
    name: '柱式餐边柜',
    tagline: '收纳亦是雕塑',
    description: '胡桃木餐边柜，配备缓冲闭合抽屉与开放式层架。极简五金，最大化存在感。',
    category: '收纳',
    dimensions: '宽 160 × 深 45 × 高 75 cm',
    variants: {
      '5a': { name: '胡桃木', material: '胡桃木' },
    },
  },
  '6': {
    name: '禅意茶几',
    tagline: '低姿态，高气场',
    description: '洞石与拉丝钢低茶几，为客厅带来沉静锚点。',
    category: '桌几',
    dimensions: '宽 120 × 深 60 × 高 35 cm',
    variants: {
      '6a': { name: '洞石 / 钢材', material: '洞石' },
    },
  },
  '7': {
    name: '框架壁架',
    tagline: '有分寸的展示',
    description: '粉末喷涂钢浮动壁架系统。模块单元可垂直或水平组合。',
    category: '收纳',
    dimensions: '宽 80 × 深 25 × 高 25 cm（单件）',
    variants: {
      '7a': { name: '哑光黑', material: '钢材' },
      '7b': { name: '暖白', material: '钢材' },
    },
  },
  '8': {
    name: '港湾床架',
    tagline: '在精炼简约中安睡',
    description: '实心橡木平台床架，一体式 headboard。无需箱簧床垫。',
    category: '卧室',
    dimensions: 'Queen：宽 160 × 长 210 cm',
    variants: {
      '8a': { name: 'Queen / 本色橡木', material: '橡木' },
      '8b': { name: 'King / 本色橡木', material: '橡木' },
    },
  },
  '9': {
    name: '轨道吊灯',
    tagline: '悬停间的优雅',
    description: '手工吹制玻璃球吊灯，可调光 LED。支持组合集群配置。',
    category: '灯饰',
    dimensions: '直径 30 × 高 35 cm',
    variants: {
      '9a': { name: '透明玻璃', material: '玻璃 + 黄铜' },
      '9b': { name: '烟熏玻璃', material: '玻璃 + 黄铜' },
    },
  },
  '10': {
    name: '工作室书桌',
    tagline: '让工作也赏心悦目',
    description: '带理线管理与抽屉收纳的书桌。白蜡木贴面桌面，钢腿支撑。',
    category: '办公',
    dimensions: '宽 140 × 深 65 × 高 75 cm',
    variants: {
      '10a': { name: '白蜡木 / 白腿', material: '白蜡木 + 钢' },
      '10b': { name: '白蜡木 / 黑腿', material: '白蜡木 + 钢' },
    },
  },
}
