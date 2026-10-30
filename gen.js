const fs = require('fs');
const path = require('path');

// 1. 在此配置你需要抓取的 RSS 源列表
// name: 最终生成的静态文件名
// url:  对应的 RSSHub 路由或外部 RSS 链接
const FEEDS = [
  { name: 'v2ex.xml', url: 'https://rsshub.app/v2ex/topics/hot' },
  { name: 'zhihu.xml', url: 'https://rsshub.app/zhihu/hotlist' }
];

async function generate() {
  // 2. 确保本地根目录下存在 dist 输出文件夹
  const outputDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('创建输出目录: dist');
  }

  // 3. 循环拉取并保存各个 RSS 数据
  for (const feed of FEEDS) {
    try {
      console.log(`正在抓取: ${feed.url}`);
      
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP 响应错误! 状态码: ${response.status}`);
      }

      const xmlData = await response.text();
      const filePath = path.join(outputDir, feed.name);
      
      // 写入 xml 文本文件
      fs.writeFileSync(filePath, xmlData, 'utf-8');
      console.log(`成功保存文件: ${feed.name}`);
    } catch (error) {
      console.error(`抓取/保存 ${feed.name} 失败:`, error.message);
    }
  }
}

generate();