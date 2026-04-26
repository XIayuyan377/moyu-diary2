export const CLOCK_IN_QUOTES = [
  "打卡成功，导师的期望又多了一天",
  "你来了，实验室又多了一个活的",
  "身体到工位，灵魂在床上",
  "恭喜成功开始今日表演",
  "又是被论文支配的一天，加油",
  "今天的你，一定可以水出一篇文章的",
  "工位已就绪，摸鱼请低调",
  "研究生的早晨，从上午十点开始",
  "实验不会做，但打卡必须到",
  "今天的目标：活着，并假装在努力",
  "呀，你来了，咖啡机表示欢迎",
  "一个普通的打工日，普通地开始",
  "实验室的门又被你推开了，勇气可嘉",
  "今天运气会好一点的，也许",
  "打卡这件事，你做到了，很好",
  "欢迎回到学术地狱，请保持微笑",
  "今日份科研表演，正式开幕",
  "进来了就别想跑，导师盯着呢",
  "又一个充满可能性的早晨（不会实现）",
  "来都来了，不如认真摸一天",
]

export const CLOCK_OUT_QUOTES = [
  "活着下班，已经赢了99%的实验",
  "今天的数据，明天再看（说不定有救）",
  "撤了，导师找我请用无人机",
  "下班了，但论文还在等你",
  "今天的你，尽力了（实验不这么认为）",
  "恭喜逃出升天，明天继续受苦",
  "回家路上不要想工作，想也没用",
  "又过了一天，离毕业又近了一天点点",
  "今天的BUG，明天的惊喜",
  "走了，明天的我会解决今天的问题",
]

export const DAILY_QUOTES = [
  "论文不会写，但今天可以先打个卡",
  "不是不努力，是努力了数据还是不对",
  "研究生的尽头是什么？答辩。答辩的尽头是什么？还是研究生",
  "师兄说这个实验做三天，我做了三个月",
  "你的论文不会因为你不看它就自动写好",
  "每天都觉得要毕业了，每天都没有毕业",
  "科研的意义是什么？是让你觉得自己很有意义",
  "今天又是「快出结果了」的一天",
  "实验数据骗过了导师，但骗不过审稿人",
  "早安，祝今天的你比昨天多写一个字",
  "研究生快乐，研究不快乐",
  "今天的任务：让导师觉得你在努力",
  "咖啡续命，数据救命，论文要命",
  "毕业遥遥无期，摸鱼近在眼前",
  "不要问我在干嘛，我也不知道",
]

export const PANDA_DIALOGUES = {
  normal: [
    "哦吼～今天也要好好摸鱼哦",
    "主人，要不要吃根竹子压压惊",
    "滚滚在这里，你不孤单",
    "今天感觉怎么样？",
  ],
  tired: [
    "哦吼～主人你眼圈比我还黑了",
    "休息一下嘛，论文又不会跑",
    "我帮你盯着，你先闭眼五分钟",
    "看起来你需要一根竹子",
  ],
  overtime: [
    "哦吼？还没走？导师发工资了吗",
    "主人你的植物在家等你",
    "滚滚已经困了，你还在卷",
    "建议立刻原地躺平，仅建议",
  ],
  fishing: [
    "哦吼！我看见你在摸鱼！",
    "这个也算学术冥想对吧",
    "被抓到了，但我不说",
    "偶尔放空也是生产力的一部分",
  ],
  happy: [
    "哦吼！主人今天好厉害！",
    "滚滚为你骄傲！",
    "这就是传说中的效率？",
    "继续！感觉要出成果了！",
  ],
  working: [
    "认真的主人最好看了",
    "专注模式已开启，加油！",
    "数据不会辜负努力的人（大概）",
  ],
}

export const WEATHER_QUOTES = {
  sunny: "晴空万里，和你的论文进度形成鲜明对比",
  rainy: "下雨了，适合在实验室假装努力",
  cloudy: "多云，和你的未来一样难以预测",
  snowy: "下雪了，导师应该不会来实验室（希望）",
  hot: "好热，大脑已经开始自动节能",
  cold: "好冷，建议抱着电脑取暖（顺便工作）",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 兼容层 - 保持与旧代码的向后兼容性
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const copywriting = {
  // 打卡相关
  greetings: CLOCK_IN_QUOTES,
  motivations: CLOCK_IN_QUOTES,
  successToxic: DAILY_QUOTES,
  clockOutTexts: CLOCK_OUT_QUOTES,
  
  // 数据标签
  dataLabels: {
    duration: '今日在岗',
    tasksCompleted: '完成课题',
    tasksRemaining: '未完成',
    favoriteApp: '今日最宠软件',
    meditation: '学术冥想',
    dailyExp: '今日EXP',
  },

  // 冥想评价
  meditationStatus: {
    healthy: '合理范围',
    needReview: '需反思',
    excessive: '过度了',
  },

  // EXP标题
  expTitle: '+10 EXP · 今日第一步',

  // 星期提示语
  weekdayTips: {
    1: '又是被论文支配的一周',
    2: '星期二，周一的复制黏贴',
    3: '中点倒计时中',
    4: '星期四，再熬一天',
    5: '最后一天！！冲！',
    6: '周末快到了，论文还在',
    0: '周日……做好准备了吗',
  },
}

/**
 * 获取随机文案
 * @param array 文案数组
 * @returns 随机选择的文案
 */
export function getRandomCopywriting(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 获取星期提示
 * @param dayOfWeek 周几 (0-6, 0=周日)
 * @returns 提示文案
 */
export function getWeekdayTip(dayOfWeek: number): string {
  return copywriting.weekdayTips[dayOfWeek as keyof typeof copywriting.weekdayTips] || '今天也要加油'
}

/**
 * 计算距离周末的天数
 * @param dayOfWeek 周几 (0-6, 0=周日)
 * @returns 距离周末的天数和文本
 */
export function getDaysToWeekend(dayOfWeek: number): {
  days: number
  text: string
} {
  if (dayOfWeek === 5) {
    // 周五
    return { days: 0, text: '最后一天！！冲！' }
  } else if (dayOfWeek === 1) {
    // 周一
    return { days: 4, text: '又是被论文支配的一周' }
  } else if (dayOfWeek === 0) {
    // 周日
    return { days: 5, text: '还有5天到周末' }
  } else if (dayOfWeek === 6) {
    // 周六
    return { days: 6, text: '还有6天到周末' }
  } else {
    // 周二、三、四
    const daysLeft = 5 - dayOfWeek
    return { days: daysLeft, text: `还有${daysLeft}天到周末` }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 报告页面相关文案
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EFFICIENCY_RATINGS = {
  excellent: {
    score: 90,
    title: '卷王附体，明日之星',
    emoji: '⭐',
  },
  good: {
    score: 70,
    title: '正常发挥，保持',
    emoji: '✨',
  },
  normal: {
    score: 50,
    title: '摸鱼适度，人之常情',
    emoji: '🐟',
  },
  low: {
    score: 30,
    title: '今日冥想偏多，明日加油',
    emoji: '🧘',
  },
  critical: {
    score: 0,
    title: '建议检讨，导师在看',
    emoji: '😰',
  },
}

export const ANNUAL_TITLES = {
  ascetic: {
    hoursMin: 2000,
    title: '科研苦行僧',
    description: '年工时破2000h，肝硬度已达Lv.MAX',
  },
  corporate_slave: {
    hoursMin: 1500,
    hoursMax: 1999,
    title: '标准社畜',
    description: '年工时1500-2000h，堪称研究生模范',
  },
  clearheaded: {
    hoursMax: 999,
    title: '人间清醒',
    description: '年工时<1000h，生活智慧值满满',
  },
}

export const DAILY_SUMMARIES = [
  "今天和往常一样，活着下班",
  "又是平凡而伟大的一天",
  "数据有点问题，明天再看",
  "收获了一个新的BUG和一个新的想法",
  "今天特别卷，但效果未知",
]

export const WEEKLY_INTROS = [
  "哦吼～本周打工实录：",
  "滚滚的周报来啦～",
  "本周摸鱼数据统计如下：",
]

export const WEEKLY_SUMMARIES = [
  "滚滚综合评定：这周你挺能的",
  "滚滚综合评定：继续保持",
  "滚滚综合评定：需要调整节奏",
  "滚滚综合评定：建议多喝热水",
]

export const REPORT_LABELS = {
  today: '【今日报告】',
  week: '【周报告】',
  year: '【年度报告】',
  efficiency: '效率指数',
  timeDistribution: '时间分布',
  dailyHours: '每日工时',
  taskCompletion: '课题完成率',
  topAppTitle: '本周精神伴侣榜',
  copy: '一键复制',
  share: '分享卡片',
  certification: '打工等级认证',
}
