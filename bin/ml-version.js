#!/usr/bin/env node
'use strict';

var child_process = require('child_process');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

// bin
const log = child_process.execSync("git log -1").toString();
const remote = child_process.execSync("git remote -v").toString();
const branch = child_process.execSync("git rev-parse --abbrev-ref HEAD").toString();
console.log("写入版本信息");
// 写入版本信息
fs__default["default"].mkdirSync("dist", { recursive: true });
fs__default["default"].writeFileSync("dist/version.text", `
打包分支：${branch}
打包时间：${new Date().toLocaleString()}
  
提交信息：
${log}
  
远端：
${remote}
 `);
