#!/usr/bin/env node
 
const program = require('commander');
const lib = require('../lib/index');
 
program
  .version('0.0.1', '-v, --version')
  .option('-p, --pkgfile [pkgfile]', 'package.json file path')
  .option('-f, --files <files>', 'updated file list')
  .option('-d, --debug', 'debug log')
  .parse(process.argv);

if (!program.files) {
    console.log('[replace-pkg-vars] empty file arg, exit 0');
    process.exit(0);
}

if (program.debug) {
    console.log(program);
}

lib.setDebug(program.debug);
lib.run(program.files, program.pkgfile);