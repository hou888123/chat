const fs = require('fs');
const path = require('path');

// 定義源資產目錄和目標目錄
const sourceDir = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'dist/assets');

// 確保目標目錄存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`創建目錄: ${targetDir}`);
}

// 複製資產檔案
fs.readdirSync(sourceDir).forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  // 檢查是否是文件而不是目錄
  if (fs.statSync(sourcePath).isFile()) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`複製: ${sourcePath} -> ${targetPath}`);
  }
});

console.log('資源複製完成！'); 