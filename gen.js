const fs = require('fs');
const path = require('path');

// 1. 在此处定义你需要生成的 RSS 源链接列表（可替换为任何标准的 RSSHub 路由或外部 RSS）
const FEEDS = [
  { name: 'v2ex.xml', url: 'https://rsshub.app/v2ex/topics/hot' },
  { name: 'zhihu.xml', url: 'https://rsshub.app/zhihu/hotlist' }
];

async function fetchAndSave() {
  // 确保输出目录存在
  const outputDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const feed of FEEDS) {
    try {
      console.log(`正在抓取: ${feed.url}`);
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const xmlData = await response.text();
      
      // 保存成静态 xml 文件
      fs.writeFileSync(path.join(outputDir, feed.name), xmlData, 'utf-8');
      console.log(`成功保存: ${feed.name}`);
    } catch (error) {
      console.error(`抓取 ${feed.name} 失败:`, error);
    }
  }
}

fetchAndSave();