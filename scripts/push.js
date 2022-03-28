#!/usr/bin/env node

const { exec } = require('child_process');
const args = process.argv;
const commitMsg = args[2];
if (!commitMsg) {
  console.error('commit msg is null');
  process.exit(1);
}

const childProcs = exec(`git add . && git commit -m "${commitMsg}" && git push origin master`);
childProcs.stdout.on('data', data => console.log(`${data}`));
childProcs.stderr.on('data', data => console.log(`${data}`));
childProcs.on('exit', code => console.log(`$ End: ${code ? '失败' : '成功'}`));
