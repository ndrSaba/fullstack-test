const { execSync } = require('child_process');
const fs = require('fs');

let env = 'dev';
try {
  env = fs.readFileSync('/home/ec2-user/env', 'utf8').trim();
} catch (e) {
  // Ignore
}
process.env.ENV = env;

const action = process.argv[2] || 'up';
const name = process.argv[3] ? ` ${process.argv[3]}` : '';

let command = '';
if (action === 'create') {
  command = `npx migrate create${name} --migrations-dir ./db/migrations`;
} else {
  command = `npx migrate ${action} --store=./db/db-migrate-store.js --migrations-dir ./db/migrations`;
}

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
