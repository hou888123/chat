import fs from 'fs';
import path from 'path';

// 確保目標目錄存在
const distDir = path.join(process.cwd(), 'dist');
const stylesDir = path.join(distDir, 'styles');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir);
}

// 需要處理的CSS文件列表
const cssFiles = [
  {
    source: path.join(process.cwd(), 'styles', 'index.css'),
    target: path.join(stylesDir, 'index.css')
  },
  {
    source: path.join(process.cwd(), 'styles', 'loading-animations.css'),
    target: path.join(stylesDir, 'loading-animations.css')
  }
];

try {
  // 處理每個CSS文件
  cssFiles.forEach(file => {
    // 確保源目錄存在
    const sourceDirPath = path.dirname(file.source);
    if (!fs.existsSync(sourceDirPath)) {
      fs.mkdirSync(sourceDirPath, { recursive: true });
      // 創建一個基本的CSS文件
      fs.writeFileSync(file.source, `/* 共享組件庫CSS文件: ${path.basename(file.source)} */\n`);
    }

    if (fs.existsSync(file.source)) {
      // 直接複製CSS文件
      console.log(`直接複製CSS文件 ${path.basename(file.source)}...`);
      try {
        // 先確保目標目錄存在
        if (!fs.existsSync(stylesDir)) {
          fs.mkdirSync(stylesDir, { recursive: true });
        }
        
        // 複製文件
        fs.copyFileSync(file.source, file.target);
        console.log(`CSS文件 ${path.basename(file.source)} 已成功複製到`, file.target);
      } catch (error) {
        console.error(`複製CSS文件 ${path.basename(file.source)} 失敗:`, error.message);
      }
    } else {
      console.log(`源CSS文件 ${path.basename(file.source)} 不存在，創建一個空文件`);
      fs.writeFileSync(file.target, `/* 共享組件庫CSS文件: ${path.basename(file.source)} */\n`);
    }
  });
} catch (err) {
  console.error('無法處理CSS文件:', err);
  process.exit(1);
} 