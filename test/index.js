const lib = require('../lib/index');

lib.setDebug(false);

const source = 'root.js src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js';

[
    {
        files: source,
        pattern: 'src/index.js',
        result: 'src/index.js',
        count: 1
    },
    {
        files: source,
        pattern: 'src/test/**',
        result: 'src/test/t1.js,src/test/t2.js',
        count: 2
    },
    {
        files: source,
        pattern: 'src/test/** common/vue/**',
        result: 'src/test/t1.js,src/test/t2.js,common/vue/index.js',
        count: 3
    },
    {
        files: source,
        pattern: '!src/** src/root.js',
        result: 'root.js,src/root.js,common/index.js,common/vue/index.js',
        count: 4
    },
    {
        files: '',
        pattern: 'src/**',
        result: '',
        count: 0
    },
    {
        files: source,
        pattern: '',
        result: source.replace(/ /g, ','),
        count: source.split(' ').length
    },
    {
        files: source,
        pattern: '!src/test/** root.js !common/vue/index.js',
        result: 'root.js,src/index.js,src/root.js,src/test/t1.js,src/test/t2.js,common/index.js,common/vue/index.js',
        count: 7
    },
    {
        files: source,
        pattern: 'src/**',
        result: 'src/index.js,src/root.js,src/test/t1.js,src/test/t2.js',
        count: 4
    },
    {
        files: source,
        pattern: 'abc/**',
        result: 'package.json',
        defaultFile: 'package.json',
        count: 1
    }

].forEach(item => {
    console.log('------------------------------------------------');
    console.log(`source: ${item.files}`);
    console.log(`filter: ${item.pattern}`);
    let ret = lib.runWithTemplate(item, '{{filter pattern}}', item.defaultFile);
    let count = lib.runWithTemplate(item, '{{count pattern}}', item.defaultFile);
    
    if (item.result !== ret || item.count != count) {
        console.error(`[error>>>] result: ${ret}`);
        console.error(`[error>>>] should: ${item.result}`);
        console.error(`[error>>>] count: ${count}`);
        console.error(`[error>>>] should: ${item.count}`);
        throw('test failed!');
    } else {
        console.log(`result: ${ret}`);
        console.log(`count: ${count}`);
    }
});



