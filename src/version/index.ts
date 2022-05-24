/**
 * @Author: wenlin
 * @Description: 生产当前git和发布信息
 */
import { execSync } from "child_process";
import fs from "fs";

const log = execSync("git log -1").toString();
const remote = execSync("git remote -v").toString();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString();

console.log("写入版本信息");

const args = process.argv.splice(2);
const dir = args[0] || "dist";
// 写入版本信息
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  `${dir}/version.html`,
  `
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>版本信息</title>
</head>
<pre>
打包分支：${branch}
打包时间：${new Date().toLocaleString()}
  
提交信息：
${log}
  
远端：
${remote}
</pre>
</html>
 `
);
