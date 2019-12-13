#! /usr/bin/env node
/* eslint import/no-dynamic-require: 0 */

const commands = [
    'start',
    'build',
    'docker-build',
    'test',
    'ensure-yarn',
    'archive-build',
];

const command = commands[1];

if (!command || commands.indexOf(command) === -1) {
    console.error(`Please specify one of available commands: ${commands.map(c => `"${c}"`).join(' ')}`);

    process.exit(-1);
}

require(`../commands/${command}`);
