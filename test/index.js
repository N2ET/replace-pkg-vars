const lib = require('../lib/index');

lib.setDebug(false);

const source = 'root.js src/index.js src/root.js src/test/t1.js src/test/t2.js common/index.js common/vue/index.js';

[
    {
        files: source,
        pattern: 'src/index.js',
        result: 'src/index.js'
    },
    {
        files: source,
        pattern: 'src/test/**',
        result: 'src/test/t1.js,src/test/t2.js'
    },
    {
        files: source,
        pattern: 'src/test/** common/vue/**',
        result: 'src/test/t1.js,src/test/t2.js,common/vue/index.js'
    },
    {
        files: source,
        pattern: '!src/** src/root.js',
        result: 'root.js,src/root.js,common/index.js,common/vue/index.js'
    },
    {
        files: '',
        pattern: 'src/**',
        result: ''
    },
    {
        files: source,
        pattern: '',
        result: source.replace(/ /g, ',')
    },
    {
        files: source,
        pattern: '!src/test/** root.js !common/vue/index.js',
        result: 'root.js,src/index.js,src/root.js,src/test/t1.js,src/test/t2.js,common/index.js,common/vue/index.js'
    },
    {
        files: source,
        pattern: 'src/**',
        result: 'src/index.js,src/root.js,src/test/t1.js,src/test/t2.js'
    },
    {
        files: source,
        pattern: 'abc/**',
        result: 'package.json',
        defaultFile: 'package.json'
    }

].forEach(item => {
    console.log('------------------------------------------------');
    console.log(`source: ${item.files}`);
    console.log(`filter: ${item.pattern}`);
    let ret = lib.runWithTemplate(item, '{{filter pattern}}', item.defaultFile);
    
    if (item.result !== ret) {
        console.error(`[error>>>] result: ${ret}`);
        console.error(`[error>>>] should: ${item.result}`);
        throw('test failed!');
    } else {
        console.log(`result: ${ret}`);
    }
});



