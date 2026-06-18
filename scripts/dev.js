import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

function start(name, args) {
  const child = spawn(npmCmd, args, {
    stdio: 'inherit',
    shell: false,
    env: process.env
  });

  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n[${name}] exited with code ${code}`);
      shutdown(code);
    }
  });

  child.on('error', (error) => {
    console.error(`\n[${name}] failed to start:`, error.message);
    shutdown(1);
  });

  return child;
}

let shuttingDown = false;
const children = [
  start('server', ['run', 'dev', '--prefix', 'server']),
  start('client', ['run', 'dev', '--prefix', 'client'])
];

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill(isWindows ? undefined : 'SIGTERM');
  }
  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
