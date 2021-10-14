var name = process.argv[2];
// const { exec } = require('child_process');

const { spawn } = require('child_process');
// 原因，windows下npm执行名不同
const ls = spawn('npx.cmd', ['rollup',  '-c', './run/config.js', '-i', name]);

ls.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// console.log('npx rollup -c run/config.js -i ' + name);
// console.log(process.cwd());

// exec('npx rollup -c ./run/config.js -i ' + name, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });
// exec('rollup -c ./run/config.js -i ' + name, function(err, stdout, stderr) {
//   exec('rm -rf runtime')
//   if (err) throw err;
//   console.log(stdout);
// });