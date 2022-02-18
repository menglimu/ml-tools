import { execSync } from 'child_process';
import fs__default from 'fs';

const log = execSync("git log -1").toString();
const remote = execSync("git remote -v").toString();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString();
console.log("写入版本信息");
// 写入版本信息
fs__default.mkdirSync("dist", { recursive: true });
fs__default.writeFileSync("dist/version.text", `
打包分支：${branch}
打包时间：${new Date().toLocaleString()}
  
提交信息：
${log}
  
远端：
${remote}
 `);
