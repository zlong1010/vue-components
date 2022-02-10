#!/usr/bin/env node

const child_process = require('child_process');
const args = process.argv;
const commitMsg = args[2];

if (!commitMsg) {
  console.error('commit msg is null');
  return;
}
function cb(error, stdout, stderr) {
  if (error) {
    console.log(error.stack);
    console.log('\nError code: ' + error.code);
    console.log('\nSignal received: ' + error.signal);
  }
  console.log(stdout);
  // console.log('stdout: ' + stdout);
  // console.log('stderr: ' + stderr);
}
var workerProcess = child_process.exec(`git add . && git commit -m "${commitMsg}" && git push origin master`, cb);
// 子进程结束
// workerProcess.on('exit', function(code) {
//   console.log('$ end %s\n' + code);
// });
