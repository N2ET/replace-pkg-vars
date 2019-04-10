#!/usr/bin/env node
 
const program = require('commander');
const lib = require('../lib/index');
const fs = require('fs');
 
program
  .version('0.0.1', '-v, --version')
  .option('-p, --pkgfile [pkgfile]', 'package.json file path')
  .option('-f, --files <files>', 'updated file list')
  .option('-d, --debug', 'debug log')
  .option('-g, --default-file [defaultfile]', 'use default file')
  .parse(process.argv);

if (!program.files) {
    console.log('[replace-pkg-vars] empty file arg, exit 0');
    process.exit(0);
}

if (program.debug) {
    console.log(program);
}

// 当过滤结果为空时，使用默认文件
const defualtFileName = typeof(program.defaultFile) === 'string' ? 
    program.defaultFile : '__replace_pkg_vars_default_file__';

let defaultFile = [];

if (program.defaultFile) {
    defaultFile.push(defualtFileName);
}

lib.setDebug(program.debug);
lib.run(program.files, program.pkgfile, true, defaultFile);

// 默认文件不存在则创建，内容为空
if (program.defaultFile && !fs.existsSync(defualtFileName)) {
    lib.writeFile(defualtFileName, '');
}