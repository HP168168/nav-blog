import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync('scripts/linkpad-raw.json', 'utf8'));
const { repo, links } = rawData;

// 定义每个分类的元数据配置（英文slug、显示名称、Emoji图标、order顺序）
const categoryConfigs = {
  '新词监控': {
    slug: 'keyword-monitoring',
    name: '新词监控',
    icon: '📈',
    order: 3,
  },
  'SEO 工具': {
    slug: 'seo-tools',
    name: 'SEO 工具',
    icon: '🔍',
    order: 4,
  },
  '外链资源': {
    slug: 'backlink-resources',
    name: '外链资源',
    icon: '🔗',
    order: 5,
  },
  '网站建设': {
    slug: 'website-building',
    name: '网站建设',
    icon: '🏗️',
    order: 6,
  },
  '竞品榜单': {
    slug: 'competitor-rankings',
    name: '竞品榜单',
    icon: '🏆',
    order: 7,
  },
  '统计工具': {
    slug: 'analytics-tools',
    name: '统计工具',
    icon: '📊',
    order: 8,
  },
  '支付工具': {
    slug: 'payment-tools',
    name: '支付工具',
    icon: '💳',
    order: 9,
  },
  '学习资源': {
    slug: 'learning-resources',
    name: '学习资源',
    icon: '📚',
    order: 10,
  },
};

// 整理归类
const groupedLinks = {};
for (const catName of repo.categories) {
  groupedLinks[catName] = [];
}

for (const link of links) {
  const cat = link.category_id || '其他';
  if (!groupedLinks[cat]) {
    groupedLinks[cat] = [];
  }

  // 格式化站点条目
  let icon = link.icon || '🌐';
  // 如果 icon 只是纯英文字母/数字且不是 url 或 emoji，做个默认美化
  if (icon && !icon.startsWith('http') && icon.length <= 2 && !/[\u{1F300}-\u{1F9FF}]/u.test(icon)) {
    // 可能是单字缩写，保留或替换
  }

  groupedLinks[cat].push({
    title: link.name ? link.name.trim() : '未命名站点',
    url: link.url ? link.url.trim() : '',
    description: (link.desc || '').trim(),
    icon: icon,
    tag: (link.sort_order > 0 || (link.desc && link.desc.includes('推荐'))) ? '推荐' : '',
  });
}

// 写入 src/content/navigation/ 目录
const targetDir = path.resolve('src/content/navigation');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let totalCreated = 0;
let totalLinksCount = 0;

for (const [catName, catLinks] of Object.entries(groupedLinks)) {
  const config = categoryConfigs[catName] || {
    slug: Buffer.from(catName).toString('hex').slice(0, 10),
    name: catName,
    icon: '📁',
    order: 99,
  };

  const fileData = {
    name: config.name,
    icon: config.icon,
    order: config.order,
    links: catLinks,
  };

  const filePath = path.join(targetDir, `${config.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
  console.log(`已写入分类 [${config.name}] -> ${config.slug}.json (${catLinks.length} 个站点)`);
  totalCreated++;
  totalLinksCount += catLinks.length;
}

console.log(`\n全部完成！共导入 ${totalCreated} 个分类，${totalLinksCount} 个链接。`);
