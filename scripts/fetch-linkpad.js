import fs from 'fs';

async function fetchAndAnalyze() {
  const repoRes = await fetch('https://linkpad.site/api/repos/4d19583b-37bb-4232-af2f-edd90c855f98');
  const repo = await repoRes.json();
  const linksRes = await fetch('https://linkpad.site/api/repos/4d19583b-37bb-4232-af2f-edd90c855f98/links');
  const links = await linksRes.json();

  console.log('Categories from repo:', repo.categories);

  const catMap = {};
  for (const c of repo.categories) {
    catMap[c] = [];
  }

  for (const link of links) {
    const c = link.category_id || '未分类';
    if (!catMap[c]) catMap[c] = [];
    catMap[c].push(link);
  }

  for (const [c, list] of Object.entries(catMap)) {
    console.log(`分类 [${c}]: ${list.length} 个链接`);
  }

  // 检查是否有缺失 url 或 title
  let validCount = 0;
  for (const l of links) {
    if (l.url && l.name) validCount++;
  }
  console.log(`总链接数: ${links.length}, 有效链接数: ${validCount}`);

  // 保存原始数据到 scratch 方便随时分析
  fs.writeFileSync('scripts/linkpad-raw.json', JSON.stringify({ repo, links }, null, 2));
}

fetchAndAnalyze();
