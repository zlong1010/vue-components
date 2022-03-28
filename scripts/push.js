#!/usr/bin/env node

const { exec } = require('child_process');
const args = process.argv;
const commitMsg = args[2];
if (!commitMsg) {
  console.error('commit msg is null');
  process.exit(1);
}

const childProcs = exec(`git add . && git commit -m "${commitMsg}" && git push origin master`);
childProcs.stdout.on('data', data => log(`${data}`));
childProcs.stderr.on('data', data => log(`${data}`));
childProcs.on('exit', code => log(`$ End: ${code ? '失败' : '成功'}`));
